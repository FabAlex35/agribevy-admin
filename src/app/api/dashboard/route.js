import { NextResponse } from 'next/server';
import { verifyToken } from '@/src/app/lib/Token';
import { querys } from '@/src/app/lib/DbConnection';

export async function GET(req) {
    try {
        // Verify Authentication
        const auth = await verifyToken(req);
        if (!auth.isValid) {
            return NextResponse.json({ message: 'Unauthorized', status: 401 }, { status: 401 });
        }    

        const { decoded } = auth;
        const role = decoded?.role;
        if (role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden', status: 403 }, { status: 403 });
        }

        // Run all queries in parallel
        const [
            userCounts,
            vegCount,
            subscriptionCount,
            expiringSubscriptions,
            activeMarketersCount // New query for active marketers
        ] = await Promise.all([
            querys({
                query: `SELECT 
                            SUM(CASE WHEN user_role = 'marketer' THEN 1 ELSE 0 END) AS totalMarketers,
                            SUM(CASE WHEN user_role = 'farmer' THEN 1 ELSE 0 END) AS totalFarmers,
                            SUM(CASE WHEN user_role = 'buyer' THEN 1 ELSE 0 END) AS totalBuyers
                        FROM users`,
                values: []
            }),
            querys({
                query: `SELECT COUNT(*) AS veg_count FROM veg_list`,
                values: []
            }),
            querys({
                query: `SELECT COUNT(*) AS subscription_count FROM subscriptions`,
                values: []
            }),
            querys({
                query: `SELECT COUNT(*) AS expiring_count FROM subscription_list WHERE days < 5`,
                values: []
            }),
            querys({
                query: `SELECT COUNT(DISTINCT u.user_id) AS activeMarketers
                        FROM users u
                        JOIN subscription_list sl ON u.user_id = sl.user_id
                        WHERE u.user_role = 'marketer' AND sl.sub_status = '1'`,
                values: []
            })
        ]);

        // Validate query responses
        if (!userCounts || !vegCount || !subscriptionCount || !expiringSubscriptions || !activeMarketersCount) {
            return NextResponse.json({ message: 'Failed to retrieve data', status: 500 }, { status: 500 });
        }

        // Extract counts and send response
        return NextResponse.json({
            data: {
                users: userCounts[0] || { totalMarketers: 0, totalFarmers: 0, totalBuyers: 0 },
                totalVegetables: vegCount[0]?.veg_count || 0,
                totalSubscriptionPlans: subscriptionCount[0]?.subscription_count || 0,
                expiringSubscriptions: expiringSubscriptions[0]?.expiring_count || 0,
                activeMarketers: activeMarketersCount[0]?.activeMarketers || 0 // Added active marketer count
            },
            status: 200
        }, { status: 200 });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ message: 'Server Error', status: 500 }, { status: 500 });
    }
}
