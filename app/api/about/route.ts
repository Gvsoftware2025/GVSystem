import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("portfolio_about")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.log("[v0] Error fetching about:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[v0] About info fetched:", data?.id);
    return NextResponse.json(data);
  } catch (error: any) {
    console.log("[v0] Error in GET:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const supabase = createClient();
  try {
    const body = await request.json();
    const { id, title, description, projects_count, clients_count, years_experience } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing ID for update" }, { status: 400 });
    }

    console.log("[v0] Updating about with ID:", id, "Data:", {
      projects_count,
      clients_count,
      years_experience,
    });

    const { data, error } = await supabase
      .from("portfolio_about")
      .update({
        title,
        description,
        projects_count,
        clients_count,
        years_experience,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log("[v0] Error updating about:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[v0] About updated successfully:", data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.log("[v0] Error in PUT:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
