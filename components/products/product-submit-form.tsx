"use client";

import  FormField from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";
import { addProductAction } from "@/lib/products/product-actions";
import { useActionState, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

const initialState = {
    success: false,
    error: undefined as Record<string, string[]> | undefined,
    message: "",
}

export default function ProductSubmitForm() {
    const [state, formAction, isPending] = useActionState(addProductAction, initialState);
    const { error, message, success } = state as {
        error?: Record<string, string[]>;
        message: string;
        success: boolean;
    };

    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (message) {
            setShowToast(true);
            const t = setTimeout(() => setShowToast(false), 5000);
            return () => clearTimeout(t);
        }
    }, [message]);

    return (
        <>
            {showToast && message && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`fixed right-4 bottom-4 z-50 max-w-sm rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 ${
                        success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                    }`}
                >
                    <div className={success ? "text-green-700" : "text-red-700"}>
                        {success ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.518 9.8c.75 1.333-.213 2.98-1.742 2.98H4.48c-1.53 0-2.492-1.647-1.742-2.98l5.52-9.8zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <div className="flex-1 text-sm text-foreground">
                        {message}
                    </div>
                    <button
                        type="button"
                        aria-label="Dismiss notification"
                        onClick={() => setShowToast(false)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        ×
                    </button>
                </div>
            )}

            <form className="space-y-6" action={formAction}>
            <FormField 
                label="Product Name" 
                name="name" 
                id="name" 
                placeholder="My Awesome Product"
                onChange={() => {}} 
                required
                error={error?.name?.[0]}
            />
            <FormField 
                label="Slug" 
                name="slug" 
                id="slug"
                placeholder="my-awesome-product"
                onChange={() => {}} 
                required
                error={error?.slug?.[0]}
                helperText="The slug is a URL-friendly version of the product name. It should be unique and contain only lowercase letters, numbers, and hyphens."
            />
            <FormField 
                label="Tagline" 
                name="tagline" 
                id="tagline"
                placeholder="A brief, catchy description of your product"
                onChange={() => {}} 
                required
                error={error?.tagline?.[0]}
            />
            <FormField 
                label="Description" 
                name="description" 
                id="description"
                placeholder="Tell us about your product..."
                onChange={() => {}} 
                required
                error={error?.description?.[0]}
                textarea
            />
            <FormField 
                label="Website URL" 
                name="websiteUrl" 
                id="websiteUrl"
                placeholder="https://my-awesome-product.com"
                onChange={() => {}} 
                required
                error={error?.websiteUrl?.[0]}
                helperText="Enter your product website or landing page"
            />
            <FormField 
                label="Tags" 
                name="tags" 
                id="tags"
                placeholder="AI, SaaS, Productivity"
                onChange={() => {}} 
                required
                error={error?.tags?.[0]}
                helperText="Comma-separated tags (eg: AI, SaaS, Productivity) to help categorize your product"
            />

            <Button type="submit" size="lg" className="w-full">
               {isPending ? (
                    <>
                        <Loader2Icon className="size-4 animate-spin" />
                        Submitting...
                    </>
               ): (
                    <>
                        <SparklesIcon className="size-4" /> 
                        Submit Product
                    </>
               )}
            </Button>
        </form>
        </>
    )
}