import { querys } from "@/src/app/lib/DbConnection";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const data = await req.json();

        // Validate request data
        if (!data?.subscription_id || !data?.id) {
            return NextResponse.json({
                message: "Invalid request: subscription_id and user_id are required",
                status: 400,
            }, { status: 400 });
        }

        // Check if subscription exists
        const [sub_data] = await querys({
            query: "SELECT * FROM subscriptions WHERE subscription_id = ?",
            values: [data.subscription_id],
        });

        if (!sub_data) {
            return NextResponse.json({
                message: "Subscription Plan not found",
                status: 404,
            }, { status: 404 });
        }

        const subscriptionDays = Number(sub_data?.subscription_days) || 0;
        const today = new Date();

        // Format date to YYYY-MM-DD (avoid timezone issues)
        const currentDate = today.toISOString().split("T")[0];

        const endDate = new Date(today);
        endDate.setUTCDate(endDate.getUTCDate() + subscriptionDays);
        const formattedEndDate = endDate.toISOString().split("T")[0];

        // Insert subscription record
        await querys({
            query: "INSERT INTO subscription_list (sub_id, start_date, sub_status, end_date, user_id, days, is_show) VALUES (?, ?, ?, ?, ?, ?, ?)",
            values: [sub_data.subscription_id, currentDate, 1, formattedEndDate, data.id, subscriptionDays, 0],
        });

        return NextResponse.json({
            message: "Successfully added subscription",
            status: 200,
        }, { status: 200 });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return NextResponse.json({
                message: "Subscription for user already exists",
                data: error,
                status: 409,
            }, { status: 409 });
        }

        return NextResponse.json({
            message: "Server Error",
            status: 500,
            data: error.message,
        }, { status: 500 });
    }
}


export async function PUT(req) {
    try {
        const data = await req.json();

        if (!data?.subscription_id || !data?.id) {
            return NextResponse.json({
                message: "Invalid request: subscription_id and user_id are required",
                status: 400,
            }, { status: 400 });
        }

        const [sub_data] = await querys({
            query: "SELECT * FROM subscriptions WHERE subscription_id = ?",
            values: [data.subscription_id],
        });

        if (!sub_data) {
            return NextResponse.json({
                message: "Subscription Plan not found",
                status: 404,
            }, { status: 404 });
        }

        const [existingSub] = await querys({
            query: "SELECT * FROM subscription_list WHERE user_id = ?",
            values: [data.id],
        });

        if (!existingSub) {
            return NextResponse.json({
                message: "User does not have a subscription to update",
                status: 404,
            }, { status: 404 });
        }

        const subscriptionDays = Number(sub_data?.subscription_days) || 0;
        const today = new Date();

        const currentDate = today.toISOString().split("T")[0];

        const endDate = new Date(today);
        endDate.setUTCDate(endDate.getUTCDate() + subscriptionDays);
        const formattedEndDate = endDate.toISOString().split("T")[0];

        await querys({
            query: "UPDATE subscription_list SET sub_id = ?, start_date = ?, sub_status = ?, end_date = ?, days = ?, is_show = ? WHERE user_id = ?",
            values: [sub_data.subscription_id, currentDate, 1, formattedEndDate, subscriptionDays, 0, data.id],
        });

        return NextResponse.json({
            message: "Successfully updated subscription",
            status: 200,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: "Server Error",
            data: error.message,
            status: 500,
        }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        // Fetch subscription details with updated query
        const subscriptions = await querys({
            query: `
                SELECT u.user_name AS shop_name, u.user_id AS id, u.market, u.created_at AS joined_date, 
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
        return NextResponse.json({ message: 'Server Error', status: 500, data: error.message, }, { status: 500 });
    }
}
