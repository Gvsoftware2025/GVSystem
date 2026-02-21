import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    if (!supabaseServiceKey) {
      return NextResponse.json({ error: "Missing service role key" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from("portfolio_about")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) throw error

    console.log("[v0] About info fetched:", data?.id)
    return NextResponse.json(data)
  } catch (error: any) {
    console.log("[v0] Error fetching about:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    if (!supabaseServiceKey) {
      return NextResponse.json({ error: "Missing service role key" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body = await request.json()

    console.log("[v0] Updating about with ID:", body.id, "Data:", {
      projects_count: body.projects_count,
      clients_count: body.clients_count,
      years_experience: body.years_experience,
    })

    const { data, error } = await supabase
      .from("portfolio_about")
      .update({
        title: body.title,
        description: body.description,
        projects_count: body.projects_count,
        clients_count: body.clients_count,
        years_experience: body.years_experience,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select()
      .single()

    if (error) {
      console.log("[v0] Error updating about:", error.message)
      throw error
    }

    console.log("[v0] About updated successfully:", data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.log("[v0] Error in PUT:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
