import { querys } from '@/src/app/lib/DbConnection';
import { verifyToken } from '@/src/app/lib/Token';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const auth = await verifyToken(req);
        if (!auth.isValid) {
            return NextResponse.json({ message: 'Unauthorized', status: 401 }, { status: 401 });
        }

        const { decoded } = auth;
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden', status: 403 }, { status: 403 });
        }

        // Fetch subscription details with updated query
        const subscriptions = await querys({
            query: `
                SELECT u.user_name AS shop_name, u.market, u.created_at AS joined_date, 
                    COALESCE(s.subscription_name, 'No Subscription') AS subscription_plan, 
                    COALESCE(
                        CASE 
                            WHEN sl.user_id IS NULL THEN 'Not Subscribed' -- User not found in subscription_list
                            WHEN sl.sub_status = '1' THEN 'Active' 
                        END, 'Inactive'
                    ) AS status,
                    COALESCE(sl.end_date, '0000-00-00') AS expiry_date
                FROM users u
                LEFT JOIN subscription_list sl ON u.user_id = sl.user_id
                LEFT JOIN subscriptions s ON sl.sub_id = s.subscription_id
                WHERE u.user_role = 'marketer'
                ORDER BY u.created_at DESC;`,
            values: []
        });

        if (!subscriptions) {
            return NextResponse.json({ message: 'No data found', status: 404 }, { status: 404 });
        }

        return NextResponse.json({ data: subscriptions, status: 200 }, { status: 200 });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ message: 'Server Error', status: 500 }, { status: 500 });
    }
}
