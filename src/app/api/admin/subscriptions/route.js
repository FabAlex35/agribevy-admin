import { querys } from "@/src/app/lib/DbConnection";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { verifyToken } from "@/src/app/lib/Token";

export async function POST(req) {
    try {
        const auth = await verifyToken(req);

        if (!auth.isValid) {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 401
            }, { status: 401 });
        }

        const id = nanoid();
        const data = await req.json();
        const name=data.name
        const price=data.price
        const duration=data.duration
        const features=data.features

        if (!name || !price || ! duration ||features.length===0) {
            return NextResponse.json({
                message: 'All fields are required',
                status: 400
            }, { status: 400 });
        }

        // Check if the vegetable already exists
        const existingRecord = await querys({
            query: 'SELECT subscription_status FROM subscriptions WHERE subscription_name = ?',
            values: [name]
        });

        if (existingRecord.length > 0) {
            const currentStatus = existingRecord[0].subscription_status;

            if (currentStatus === 1) {
                return NextResponse.json({
                    message: 'Subscription plan already exists',
                    status: 409
                }, { status: 409 });
            } else {
                // Update the existing record to activate it
                const updateResult = await querys({
                    query: 'UPDATE subscriptions SET subscription_status = 1, subscription_price=?,subscription_months=? , subscription_days=? ,  subscription_features=? WHERE subscription_name = ?',
                    values: [price, duration,duration*30,features,name]
                });

                if (updateResult.affectedRows > 0) {
                    return NextResponse.json({
                        message: 'Subscription plan reactivated successfully',
                        status: 200
                    }, { status: 200 });
                } else {
                    return NextResponse.json({
                        message: 'Failed to reactivate Subscription plan',
                        status: 500
                    }, { status: 500 });
                }
            }
        } else {
            // Insert a new vegetable with status 1
            const result = await querys({
                query: 'INSERT INTO subscriptions (subscription_name, subscription_id, subscription_price, subscription_months, subscription_days,subscription_features,subscription_status) VALUES (?, ?, ?, ?, ? ,? ,?)',
                values: [name, id, price,duration,duration*30,features,1]
            });

            if (result.affectedRows > 0) {
                return NextResponse.json({
                    message: 'Subscription plan added successfully',
                    status: 200
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    message: 'Failed to add Subscription plan',
                    status: 500
                }, { status: 500 });
            }
        }
    } catch (error) {
        console.error('Server Error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({
                message: 'Subscription plan already exists',
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
        const auth = await verifyToken(req)

        if (!auth.isValid) {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 401
            }, { status: 401 });
        }

        const { decoded } = auth
        const role = decoded.role

        if (role == 'admin') {
            const rows = await querys({
                query: `SELECT * FROM subscriptions WHERE subscription_status=1`,
                values: []
            });

            if (rows) {
                return NextResponse.json({
                    message: 'Subscription plans Listed successfully',
                    data: rows,
                    status: 200
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    message: 'No Data Found',
                    status: 404
                }, { status: 404 });
            }
        } else {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }

    } catch (error) {
        console.log(error);

        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}
