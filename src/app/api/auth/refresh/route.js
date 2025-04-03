import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import cookie from 'cookie';
import { querys } from '@/src/app/lib/DbConnection';
import { generateRefreshToken, generateToken, showRole } from '@/src/app/lib/Token';

const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        const cookies = cookie.parse(req.headers.get("cookie") || "");
        const refreshToken = cookies.adminRefToken;

        if (!refreshToken) {
            return NextResponse.json({ message: "No refresh token provided", status: 401 }, { status: 401 });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);

        const user = {
            userId: decoded.userId,
            mobile: decoded.mobile,
            role: decoded.role
        };

        // Generate authentication token
        const token = await generateToken(user);
        const refresh = await generateRefreshToken(user);
        const role = await showRole(user);

        // Create JSON response
        const response = NextResponse.json({
            message: 'Successfully refreshed tokens',
            data: {...user,access:token},
            status: 200
        });

        // Set the token in a secure cookie
        response.headers.append('Set-Cookie', cookie.serialize('adminAccToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60,
            path: '/',
        }));

        response.headers.append('Set-Cookie', cookie.serialize('adminRefToken', refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60,
            path: '/',
        }));

        response.headers.append('Set-Cookie', cookie.serialize('adminrole', role, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60,
            path: '/',
        }));

        return response;

    } catch (error) {
        console.log(error);
        
        return NextResponse.json({
            message: 'Server Error',
            data: error.message,
            status: 500
        }, { status: 500 });
    }

}
