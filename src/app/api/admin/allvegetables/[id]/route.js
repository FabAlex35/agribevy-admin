import { querys } from "@/src/app/lib/DbConnection";
import { NextResponse } from "next/server";
import { verifyToken } from "@/src/app/lib/Token";

export async function DELETE(req) {
    try {
        const auth = await verifyToken(req);

        if (!auth.isValid) {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 401
            }, { status: 401 });
        }
        const id = new URL(req.url).pathname.split('/').filter(Boolean).pop();
        const allBuyer = await querys({
            query: `UPDATE veg_list SET status = ? WHERE veg_id=?`,
            values: [0, id]
        });

        return NextResponse.json({
            message: 'Vegetable Removed successfully',
            status: 200,
        }, { status: 200 });


    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}