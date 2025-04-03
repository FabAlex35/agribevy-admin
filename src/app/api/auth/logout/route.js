import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST(req) {
    try {
 
        // Create a JSON response for logout
        const response = NextResponse.json({
            message: 'Successfully logged out',
            status: 200
        });

        // Append Set-Cookie header to clear the 'shopToken' cookie
        response.headers.append('Set-Cookie', cookie.serialize('adminAccToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            expires: new Date(0),
            maxAge: 0 * 60,
            path: '/'
        }));

        response.headers.append('Set-Cookie', cookie.serialize('adminRefToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            expires: new Date(0),
            maxAge: 0 * 60,
            path: '/'
        }));

        response.headers.append('Set-Cookie', cookie.serialize('adminrole', '', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            expires: new Date(0),
            maxAge: 0 * 60,
            path: '/'
        }));

        // Return the response
        return response;
    } catch (error) {
        // Return an error response
        return NextResponse.json({
            message: 'Failed to log out',
            data: error.message,
            status: 500
        }, { status: 500 });
    }
}
