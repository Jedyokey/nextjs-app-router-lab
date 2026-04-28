import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
        const rateLimit = checkRateLimit(`chat_${ip}`, 20, 60);
        if (!rateLimit.success) {
            return Response.json({ error: "Too many requests. Please slow down." }, { status: 429 });
        }

        const body = await request.json();
        const message: string = (body?.message ?? "").slice(0, 1000);

        if (!message.trim()) {
            return Response.json({ error: "Message is required" }, { status: 400 });
        }

        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        const username = process.env.N8N_WEBHOOK_USERNAME;
        const password = process.env.N8N_WEBHOOK_PASSWORD;

        if (!webhookUrl || !username || !password) {
            console.error("[chat/route] Missing n8n environment variables");
            return Response.json({ error: "Chat service not configured" }, { status: 503 });
        }

        const credentials = Buffer.from(`${username}:${password}`).toString("base64");

        const n8nRes = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${credentials}`,
            },
            body: JSON.stringify({
                chatInput: message,
                sessionId: `session-${ip}`,
             }),
        });

        if (!n8nRes.ok) {
            console.error("[chat/route] n8n returned", n8nRes.status);
            return Response.json(
                { response: "Sorry, the assistant is unavailable right now. Please try again later." },
                { status: 200 }
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await n8nRes.json();

        // Normalise across common n8n response shapes
        let text = "Sorry, I could not process your request.";
        if (Array.isArray(data)) {
            text = data[0]?.output ?? data[0]?.text ?? data[0]?.response ?? text;
        } else if (data && typeof data === "object") {
            text = data.output ?? data.response ?? data.text ?? data.message ?? text;
        }

        return Response.json({ response: text });
    } catch (error) {
        console.error("[chat/route]", error);
        return Response.json(
            { response: "Sorry, something went wrong. Please try again." },
            { status: 200 }
        );
    }
}
