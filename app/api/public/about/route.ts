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
      console.error("[v0] Error fetching about:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "About info not found" }, { status: 404 });
    }

    // Retorna os dados públicos sem autenticação
    return NextResponse.json(
      {
        title: data.title,
        description: data.description,
        projects_count: data.projects_count,
        clients_count: data.clients_count,
        years_experience: data.years_experience,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*", // Permite qualquer origem acessar
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error: any) {
    console.error("[v0] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Necessário para CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
