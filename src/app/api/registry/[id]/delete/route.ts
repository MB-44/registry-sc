import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Registry from "@/models/Registry";

export async function DELETE(
    req: NextRequest, 
    context: { params: {id: string} }) {
    try {
        await connectToDB();

        const deleteRegistry = await Registry.findByIdAndDelete(context.params.id);

        if (!deleteRegistry) {
            return NextResponse.json(
                {error: "Registry Not found"},
                {status: 404}
            );
        }
        
        return NextResponse.json({ message: "Registry deleted successfully! "});
    } catch (error) {
        return NextResponse.json(
            {error: "Failed to delete registry"},
            {status: 500}
        );
    }
}