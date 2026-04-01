type CacheEntry = {
    count: number;
    expiresAt: number;
};

// In-memory cache map
const rateLimitCache = new Map<string, CacheEntry>();

/**
 * A simple in-memory rate limiter using a sliding window.
 * Note: When deployed to serverless environments (like Vercel), this cache is not 
 * shared across workers/lambdas and will reset on cold starts. However, it's 
 * sufficient for basic mitigation of rapid-fire bot requests per individual lambda.
 * 
 * @param identifier Custom ID to rate limit (e.g. "submit_review_" + userId)
 * @param limit Maximum number of requests allowed within the window
 * @param windowInSeconds The sliding time window in seconds
 * @returns { success: boolean, remaining: number }
 */
export function checkRateLimit(
    identifier: string,
    limit: number,
    windowInSeconds: number
): { success: boolean; message?: string } {
    const now = Date.now();
    const windowInMs = windowInSeconds * 1000;

    // Retrieve existing entry
    let entry = rateLimitCache.get(identifier);

    // If entry does not exist or has expired, reset it
    if (!entry || now > entry.expiresAt) {
        entry = {
            count: 0,
            expiresAt: now + windowInMs,
        };
    }

    // Increment request count
    entry.count += 1;
    rateLimitCache.set(identifier, entry);

    if (entry.count > limit) {
        return { 
            success: false, 
            message: "You are doing this too fast. Please wait a moment and try again." 
        };
    }

    return { success: true };
}
