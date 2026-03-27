import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("portfolio_contacts")
      .select("id, name, email, message, created_at, is_read")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.log("[v0] API error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[v0] Contacts fetched successfully:", data?.length || 0);
    return NextResponse.json(data || []);
  } catch (err: any) {
    console.log("[v0] API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = createClient();
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID for deletion" }, { status: 400 });
    }

    const { error } = await supabase
      .from("portfolio_contacts")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const supabase = createClient();
  try {
    const { id, is_read } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID for update" }, { status: 400 });
    }

    const { error } = await supabase
      .from("portfolio_contacts")
      .update({ is_read })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
