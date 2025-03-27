import { querys } from "@/src/app/lib/DbConnection";
import { generateToken, showRole } from "@/src/app/lib/Token";
import bcrypt from 'bcrypt'
import cookie from 'cookie';
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { mobile, password } = await req.json();

        if (!mobile || !password) {
            return NextResponse.json({
                message: 'Missing mobile number or password',
                status: 400
            }, { status: 400 });
        }

        const rows = await querys({
            query: 'SELECT * FROM users WHERE user_mobile = ? AND user_role=?',
            values: [mobile,"admin"]
        });

        // If user does not exist
        if (rows.length === 0) {
            return NextResponse.json({
                message: 'Admin not found',
                status: 404
            }, { status: 404 });
        }

        const user = rows[0];

        // Compare password
        const match = await bcrypt.compare(password, user.user_pwd);

        if (match) {
            // Generate authentication token
            const token = generateToken(user);
            const role = showRole(user);
            let isSetting;
           
            // Create JSON response
            const response = NextResponse.json({
                message: 'Successfully logged in',
                data: { user_id: user.user_id, user_mobile: user.user_mobile}, // Only include necessary data
                status: 200
            });

            // Set the token in a secure cookie
            response.headers.append('Set-Cookie', cookie.serialize('adminToken', token, {
                httpOnly: true,  // Ensures the cookie is only accessible via HTTP(S)
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'Strict', // Mitigate CSRF attacks
                maxAge: 24 * 60 * 60, // 30 minutes
                path: '/', // Cookie is available site-wide
            }));

            response.headers.append('Set-Cookie', cookie.serialize('adminrole', role, {
                httpOnly: false,  // Ensures the cookie is only accessible via HTTP(S)
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'Strict', // Mitigate CSRF attacks
                maxAge: 24 * 60 * 60, // 30 minutes
                path: '/', // Cookie is available site-wide
            }));

            return response;
        } else {
            return NextResponse.json({
                message: 'Incorrect password',
                status: 400
            }, { status: 400 });
        }
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }

}