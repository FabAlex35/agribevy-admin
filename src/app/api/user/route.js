import { querys } from '@/src/app/lib/DbConnection';
import { generateRefreshToken, generateToken, showRole, verifyToken } from '@/src/app/lib/Token';
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import cookie from 'cookie';


export async function POST(req) {
    try {
        const user = await req.json()

        // Validate input values
        if (!user.name || !user.password || !user.mobile) {
            return NextResponse.json({
                message: 'Missing required fields: name, password, and mobile are required',
                status: 400
            }, { status: 400 });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashPW = await bcrypt.hash(user.password, salt)
        const id = nanoid();

        // Check if the mobile number already exists
        const existingUser = await querys({
            query: 'SELECT * FROM users WHERE user_mobile = ?',
            values: [user.mobile]
        });

        if (existingUser.length > 0) {
            return NextResponse.json({
                message: 'Phone Number Already Exists',
                status: 409
            }, { status: 409 });
        }

        const rows = await querys({
            query: `INSERT INTO users (user_id, user_name, user_pwd, user_mobile, user_role, user_address, market, access, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            values: [id, user.name, hashPW, user.mobile, "admin", "No need", 'No need', '{}', 'own']
        });
        let users;
        if (rows.affectedRows > 0) {
            const [data] = await querys({
                query: `SELECT * FROM users WHERE user_id = ?`,
                values: [id]
            });

             users = data

            const response = NextResponse.json({
                message: 'Admin Registered successfully',
                status: 200
            }, { status: 200 })

            const token = await generateToken(data)
            const refresh = await generateRefreshToken(data)
            const role = showRole(users);

            response.headers.append('Set-Cookie', cookie.serialize('adminAccToken', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge:24* 60 * 60, 
                path: '/', 
            }));

            response.headers.append('Set-Cookie', cookie.serialize('adminRefToken', refresh, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge:24* 60 * 60, 
                path: '/', 
            }));

            response.headers.append('Set-Cookie', cookie.serialize('adminrole', role, {
                httpOnly: false, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge:24* 60 * 60,
                path: '/', 
            }));
            return response
        } else {
            return NextResponse.json({
                message: 'Failed to register admin',
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

export async function GET(req) {
    try {
        // Verify the token
        const auth = await verifyToken(req);
  
        const { decoded } = auth;
        const userId = decoded.userId;

        // Fetch user data from the database
        const rows = await querys({
            query: `SELECT * FROM users WHERE user_id = ? AND user_role=?`,
            values: [userId,"admin"]
        });

        // Check if any rows were returned
        if (rows.length > 0) {
            return NextResponse.json({
                message: 'Admin fetched successfully',
                status: 200,
                data: rows[0]
            }, { status: 200 });
        } else {
            return NextResponse.json({
                message: 'Admin not found',
                status: 404
            }, { status: 404 });
        }

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}