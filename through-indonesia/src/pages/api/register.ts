export const prerender = false;

import { supabaseServer } from "../../lib/supabase-server";

export async function POST({ request }: { request: Request }) {
  const body = await request.json();

  console.log("Received body:", body);

  if (!body.fullName) {
  return Response.json(
    { error: "Full name is required." },
    { status: 400 }
  );
}

if (!body.email) {
  return Response.json(
    { error: "Email is required." },
    { status: 400 }
  );
}

if (!body.workshopSlug) {
  return Response.json(
    { error: "Workshop not specified." },
    { status: 400 }
  );
}

  const { error } = await supabaseServer
    .from("registrations")
    .insert({
      workshop_slug: body.workshopSlug,
      workshop_title: body.workshopTitle,
      full_name: body.fullName,
      email: body.email,
      phone: body.phone,
      country: body.country,
      notes: body.notes,
    });

  if (error) {
    return Response.json(
  {
    error: error.message,
  },
  {
    status: 500,
  }
);
  }

  return Response.json({
  success: true,
});
}