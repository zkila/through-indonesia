
import { supabaseServer } from "../../lib/supabase-server";

export async function POST({request}:{request : Request}){

    try{
        const body= await request.json();
        const fullName = body.fullName?.trim();
        const email = body.email?.trim();
        const subject = body.subject?.trim();
        const message = body.message?.trim();   

        if (!fullName) {
        return Response.json(
            { error: "Full name is required." },
            { status: 400 }
        );
        }

        if (!email) {
        return Response.json(
            { error: "Email is required." },
            { status: 400 }
        );
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return Response.json(
            { error: "Invalid email." },
            { status: 400 }
        );
        }

        const { error } = await supabaseServer
        .from("contact")
        .insert({
            full_name: fullName,
            email: email,
            subject: subject,
            message: message,
        });

        if (error) {
        console.error("Supabase error:", error);

        return Response.json(
            { error: "Failed to save message." },
            { status: 500 }
        );
        }

    } catch (err) {
    console.error("Contact endpoint error:", err);

    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}