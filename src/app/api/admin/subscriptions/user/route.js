import { querys } from "@/src/app/lib/DbConnection";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const data = await req.json();

        // Check if the user exists by their mobile
        const user = await querys({
            query: 'SELECT * FROM users WHERE user_mobile = ?',
            values: [data.mobile]
        });

        // Check if user exists and is a marketer
        if (user.length === 0) {
            return NextResponse.json({
                message: 'No user found',
                status: 400
            }, { status: 400 });
        }

        if (user[0]?.user_role !== 'marketer') {
            return NextResponse.json({
                message: 'Make sure the user is a Marketer',
                status: 400
            }, { status: 400 });
        }

        // Check if subscription data exists
        const [sub_data] = await querys({
            query: "SELECT * FROM subscriptions WHERE subscription_id = ?",
            values: [data?.id]
        });

        if (!sub_data) {
            return NextResponse.json({
                message: 'Subscription Plan not found',
                status: 400
            }, { status: 400 });
        }

        // Ensure subscription_days exists and is a valid number
        const subscriptionDays = sub_data?.subscription_days || 0;

        // Check if the user already has a subscription
        const check = await querys({
            query: "SELECT * FROM subscription_list WHERE user_id = ?",
            values: [user[0]?.user_id]
        });

        const today = new Date();
        const currentDate = today.toISOString().split('T')[0];

        // Make a copy of the date object for calculations
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + subscriptionDays);
        const formattedEndDate = endDate.toISOString().split('T')[0];

        // If the user doesn't have a subscription, insert a new one
        if (check.length === 0) {
            const setSubscription = await querys({
                query: "INSERT INTO subscription_list (sub_id, start_date, sub_status, end_date, user_id, days, is_show) VALUES (?, ?, ?, ?, ?, ?, ?)",
                values: [sub_data?.subscription_id, currentDate, 1, formattedEndDate, user[0]?.user_id, sub_data.subscription_days, 0]
            });

            return NextResponse.json({
                message: 'Successfully added subscription',
                status: 200
            }, { status: 200 });

        } else {
            if (check[0]?.sub_status) {
                return NextResponse.json({
                    message: 'User already has a valid subscription',
                    status: 200
                }, { status: 200 });
            }

            // If the user already has a subscription, update it
            const setSubscription = await querys({
                query: "UPDATE subscription_list SET sub_id = ?, start_date = ?, sub_status = ?, end_date = ?, days = ?, is_show = ? WHERE user_id = ?",
                values: [sub_data?.subscription_id, currentDate, 1, formattedEndDate, sub_data.subscription_days, 0, user[0]?.user_id]
            });

            return NextResponse.json({
                message: 'Successfully updated subscription',
                status: 200
            }, { status: 200 });
        }
    } catch (error) {
        console.error('Server Error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({
                message: 'Subscription for user already exists',
                status: 409
            }, { status: 409 });
        }

        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}


export async function GET(req) {
    try {
        const auth = await verifyToken(req);

        // Check if token is valid
        if (!auth.isValid) {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 401
            }, { status: 401 });
        }

        // Ensure only 'admin' role can access 'admin' path
        if (auth.role !== 'admin') {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }

        // Fetch subscriptions that are active
        const getSubscriptions = await querys({
            query: "SELECT * FROM subscription_list WHERE sub_status = ?",
            values: [1]
        });

        // If no subscriptions found, return a different message
        if (getSubscriptions.length === 0) {
            return NextResponse.json({
                message: 'No active subscriptions found',
                status: 404
            }, { status: 404 });
        }

        // Return the data if subscriptions found
        return NextResponse.json({
            message: 'Fetched all active subscriptions',
            data: getSubscriptions,
            status: 200
        }, { status: 200 });

    } catch (error) {
        console.error('Server Error:', error);  // For better debugging
        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}
