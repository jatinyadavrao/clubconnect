
import { NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';


const rateLimiter = new RateLimiterMemory({
    points: 100, // Allow 100 requests
    duration: 60, // Per 60 seconds
});

export async function middleware(req) {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'anonymous';
    console.log(`Incoming request from IP: ${ip}`);

    try {
   
        await rateLimiter.consume(ip);
        console.log(`Request allowed for IP: ${ip}`);

        return NextResponse.next();
    } catch (err) {
        console.log(`Rate limit exceeded for IP: ${ip}`);
   
        return new NextResponse('Too Many Requests', { status: 429 });
    }
}
export const config = {
    matcher: '/api/:path*', 
};

