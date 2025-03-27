import { querys } from "@/src/app/lib/DbConnection";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
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
        const data = await req.formData();
        const file = data.get('file');
        const name = data.get('name');
        const tamil_name = data.get('tamil_name');

        if (!name) {
            return NextResponse.json({
                message: 'Name is required',
                status: 400
            }, { status: 400 });
        }

        let storePath;
        if (file) {
            const mimeType = file.type;
            const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            if (!validMimeTypes.includes(mimeType)) {
                return NextResponse.json({
                    success: false,
                    message: 'Invalid file type. Only JPEG, PNG, and JPG are allowed.'
                }, { status: 400 });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const extname = path.extname(file.name);
            const basename = path.basename(file.name, extname);

            // Create new filename with a timestamp
            const newName = `${basename}-${Date.now().toString()}${extname}`;
            const uploadDirectory = 'C:\\images';
            storePath = path.join(uploadDirectory, newName);

            // Write the file to the new location
            await writeFile(storePath, buffer);
        }

        // Check if the vegetable already exists
        const existingRecord = await querys({
            query: 'SELECT status FROM veg_list WHERE veg_name = ?',
            values: [name]
        });

        if (existingRecord.length > 0) {
            const currentStatus = existingRecord[0].status;

            if (currentStatus === 1) {
                return NextResponse.json({
                    message: 'Vegetable already exists',
                    status: 409
                }, { status: 409 });
            } else {
                // Update the existing record to activate it
                const updateResult = await querys({
                    query: 'UPDATE veg_list SET status = 1, path = ? ,tamil_name=? WHERE veg_name = ?',
                    values: [storePath,tamil_name, name]
                });

                if (updateResult.affectedRows > 0) {
                    return NextResponse.json({
                        message: 'Vegetable reactivated successfully',
                        status: 200
                    }, { status: 200 });
                } else {
                    return NextResponse.json({
                        message: 'Failed to reactivate vegetable',
                        status: 500
                    }, { status: 500 });
                }
            }
        } else {
            // Insert a new vegetable with status 1
            const result = await querys({
                query: 'INSERT INTO veg_list (veg_name, veg_id, path, tamil_name,status) VALUES (?, ?, ?,?, 1)',
                values: [name, id, storePath ,tamil_name]
            });

            if (result.affectedRows > 0) {
                return NextResponse.json({
                    message: 'Vegetable added successfully',
                    status: 200
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    message: 'Failed to add vegetable',
                    status: 500
                }, { status: 500 });
            }
        }
    } catch (error) {
        console.error('Server Error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({
                message: 'Vegetable already exists',
                status: 409
            }, { status: 409 });
        }

        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const auth = await verifyToken(req)

        if (!auth.isValid) {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 401
            }, { status: 401 });
        }

        const data = await req.formData()
        const file = data.get('file')
        const id = data.get('id')
        const name = data.get('name')
        const tamil_name = data.get('tamil_name')
        const existing = data.get('existingPath')
        // Parse request body

        let storePath = existing
        if (!existing && file) {
            const mimeType = file.type;
            const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            if (!validMimeTypes.includes(mimeType)) {
                return NextResponse.json({
                    success: false,
                    message: 'Invalid file type. Only JPEG, PNG, and JPG are allowed.'
                }, { status: 400 });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const extname = path.extname(file.name);
            const basename = path.basename(file.name, extname);

            // Create new filename with a timestamp
            const newName = `${basename}-${Date.now().toString()}${extname}`;
            const uploadDirectory = 'C:\\images';
            storePath = path.join(uploadDirectory, newName);

            // Write the file to the new location
            await writeFile(storePath, buffer);
        }

        const query = (!existing && file)
            ? `UPDATE veg_list SET veg_name = ?, path = ?,tamil_name=? WHERE veg_id = ?`
            : `UPDATE veg_list SET veg_name = ?,tamil_name=? WHERE veg_id = ?`;

        const values = (!existing && file)
            ? [name, storePath,tamil_name, id]
            : [name,tamil_name, id];

        const result = await querys({ query, values });

        if (result.affectedRows > 0) {
            return NextResponse.json({
                message: 'Vegetable updated successfully',
                status: 200
            }, { status: 200 });
        }

        return NextResponse.json({
            message: 'Failed to add product',
            status: 400
        }, { status: 400 });


    } catch (error) {
        console.error('Server Error:', error);

        if (error.code == 'ER_DUP_ENTRY') {
            return NextResponse.json({
                message: 'Product already exists',
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
                query: `SELECT veg_name, veg_id ,path ,tamil_name FROM veg_list WHERE status=1`,
                values: []
            });

            if (rows) {
                return NextResponse.json({
                    message: 'Vegetables Listed successfully',
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

