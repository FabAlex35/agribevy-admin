import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const validUpto = process.env.JWT_EXPIRATION

// create token for user 
export function generateToken(user) {
    return jwt.sign(
        { userId: user.user_id, mobile: user.user_mobile, role: user.user_role },
        SECRET_KEY,
        { expiresIn: validUpto }
    );
}
export function showRole(user){
    return user.user_role
}
export async function verifyToken(req) {
    const cookies = req.cookies;
    const token = cookies.get('adminToken')
    if (!token) {
        return NextResponse.json({
            message: 'Authentication required',
            status: 400
        });
    } else {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET_KEY);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        // console.log(decoded.userId);
        
        // Check token expiry
        if (decoded.exp < currentTime) {
            return NextResponse.json({
                message: 'Token has expired',
                status: 401
            }, { status: 401 });
        }

        return { isValid: true, decoded };
    }
} 