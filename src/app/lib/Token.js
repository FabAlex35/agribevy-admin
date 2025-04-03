import cookie from "cookie";
import { jwtVerify, decodeJwt, SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
const REFRESH_SECRET_KEY = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET_KEY);

// Convert string expiration times to valid formats (if needed)
const validUpto = process.env.JWT_EXPIRATION || "5m";  
const refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRATION || "10m";  

// create token for user 
export async function generateToken(user) {
    return await new SignJWT({
        userId: user.user_id ?? user.userId, 
        mobile: user.user_mobile ?? user.mobile,
        role: user.user_role ?? user.role,
    })
        .setExpirationTime(validUpto) 
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .sign(SECRET_KEY);
}

// Generate refresh token
export async function generateRefreshToken(user) {
    return await new SignJWT({
        userId: user.user_id ?? user.userId,
        mobile: user.user_mobile ?? user.mobile,
        role: user.user_role ?? user.role,
    })
        .setExpirationTime(refreshTokenExpiry)
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .sign(REFRESH_SECRET_KEY);
}

export function showRole(user){
    return user.user_role
}

export async function verifyToken(req) {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    let token = cookies.adminAccToken;
    let flag = false; 
    if (!token) {
        token = cookies.adminRefToken;
        flag = true;
    }
    let key = flag ? REFRESH_SECRET_KEY : SECRET_KEY;
    
    try {
        let decoded = await jwtVerify(token, key);
        return { decoded:decoded.payload, error: null }; 
    } catch (error) {
        let decoded = decodeJwt(token);
        if (error.code === "ERR_JWT_EXPIRED") {
            return { decoded:decoded, error: "Token expired" };
        }

        return { payload: null, error: "Invalid token", details: error.message };
    }
}