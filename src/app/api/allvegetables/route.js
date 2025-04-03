import { querys } from "@/src/app/lib/DbConnection";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import cloudinary from "@/src/app/lib/cloudinary";

export async function POST(req) {
    try {
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

        // **Step 1: Check if vegetable already exists**
        const existingRecord = await querys({
            query: 'SELECT status, path FROM veg_list WHERE veg_name = ?',
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
                // **Reactivating existing vegetable (if previously deleted)**
                const updateResult = await querys({
                    query: 'UPDATE veg_list SET status = 1, tamil_name=? WHERE veg_name = ?',
                    values: [tamil_name, name]
                });

                return NextResponse.json({
                    message: updateResult.affectedRows > 0 ? 'Vegetable reactivated successfully' : 'Failed to reactivate vegetable',
                    status: updateResult.affectedRows > 0 ? 200 : 500
                }, { status: updateResult.affectedRows > 0 ? 200 : 500 });
            }
        }

        // **Step 2: Upload image to Cloudinary (only if vegetable does NOT exist)**
        let storePath = null;
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

            const uploadResponse = await cloudinary.uploader.upload(
                `data:${mimeType};base64,${buffer.toString('base64')}`, 
                { folder: 'uploads', resource_type: 'image' }
            );

            storePath = uploadResponse.secure_url; // Store the uploaded image URL
        }

        // **Step 3: Insert new vegetable into database**
        const result = await querys({
            query: 'INSERT INTO veg_list (veg_name, veg_id, path, tamil_name, status) VALUES (?, ?, ?, ?, 1)',
            values: [name, id, storePath, tamil_name]
        });

        return NextResponse.json({
            message: result.affectedRows > 0 ? 'Vegetable added successfully' : 'Failed to add vegetable',
            status: result.affectedRows > 0 ? 200 : 500
        }, { status: result.affectedRows > 0 ? 200 : 500 });

    } catch (error) {        
        return NextResponse.json({
            message: 'Server Error',
            data: error.message,
            status: 500
        }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const data = await req.formData();
        const file = data.get("file");
        const id = data.get("id");
        const name = data.get("name");
        const tamil_name = data.get("tamil_name");

        // Fetch the existing vegetable record
        const existingRecord = await querys({
            query: "SELECT path FROM veg_list WHERE veg_id = ?",
            values: [id]
        });

        if (existingRecord.length === 0) {
            return NextResponse.json(
                { message: "Vegetable not found", status: 404 },
                { status: 404 }
            );
        }

        let storePath = existingRecord[0].path; // Keep the old image path

        // If a new file is provided, replace the old image with the same name
        if (file) {
            const mimeType = file.type;
            const validMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

            if (!validMimeTypes.includes(mimeType)) {
                return NextResponse.json(
                    { success: false, message: "Invalid file type. Only JPEG, PNG, and JPG are allowed." },
                    { status: 400 }
                );
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Extract old file name from URL
            const oldFileName = storePath.split("/").pop().split(".")[0]; // Removes file extension

            // Upload new image with the same file name to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(
                `data:${mimeType};base64,${buffer.toString("base64")}`,
                {
                    folder: "uploads",
                    public_id: oldFileName, // Keeps the same file name
                    overwrite: true, // Replaces old image
                    resource_type: "image"
                }
            );

            storePath = uploadResponse.secure_url; // Update new image URL
        }

        // Update database with new details
        const result = await querys({
            query: "UPDATE veg_list SET veg_name = ?, path = ?, tamil_name = ? WHERE veg_id = ?",
            values: [name, storePath, tamil_name, id]
        });

        if (result.affectedRows > 0) {
            return NextResponse.json(
                { message: "Vegetable updated successfully", status: 200 },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "Failed to update vegetable", status: 400 },
            { status: 400 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Server Error", data: error.message, status: 500 },
            { status: 500 }
        );
    }
}


export async function GET(req) {
    try {
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

    } catch (error) {
        return NextResponse.json({
            message: 'Server Error',
            data: error.message,
            status: 500
        }, { status: 500 });
    }
}

