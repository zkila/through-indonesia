export const prerender = false;

import { supabaseServer } from "../../lib/supabase-server";
import { resend } from "../../lib/resend";
import { getWorkshop } from "../../lib/workshops";
import { countConfirmedRegistrations } from "../../lib/registrations";
import { registrationEmail, registrationEmailWaitlist } from "../../emails/registration";
import { adminRegistrationEmail } from "../../emails/admin";

export async function POST({ request }: { request: Request }) {
  
  try {
    const body = await request.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const country = body.country?.trim();
    const token = body["cf-turnstile-response"];

    const workshop = await getWorkshop(body.workshopSlug);

    const workshopTitle = workshop.title;
    const workshopLocation = workshop.location;
    const workshopDateStart = workshop.date_start;
    const workshopDateEnd = workshop.date_end;
    const workshopDate = formatWorkshopDates(
      workshopDateStart,
      workshopDateEnd
    );
    const seatLimit = workshop.max_seats;

    let statusRegistrant: string;

    const confirmed = await countConfirmedRegistrations(body.workshopSlug);

    if (!workshop.registration_open) {
      return new Response(
        JSON.stringify({
          error: "Registrations are closed."
        }),
        { status: 403 }
      );
    }
    
    if (confirmed >= seatLimit) {
      statusRegistrant = "Waitlist";
    } else {
      statusRegistrant = "Confirmed";
    }

    if (!token) {
      return Response.json(
        { error: "Turnstile token missing." },
        { status: 400 }
      );
    }

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

    const ip =
      request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        .trim() ?? "";

    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: import.meta.env.TURNSTILE_SECRET_KEY,
          response: token.toString(),
          remoteip: ip,
        }),
      }
    );

    const verifyResult = await verifyResponse.json();

    if (!verifyResult.success) {
      console.error("Turnstile verification failed:", verifyResult);

      return Response.json(
        { error: "Turnstile verification failed." },
        { status: 403 }
      );
    }

    const { error } = await supabaseServer
      .from("registrations")
      .insert({
        workshop_slug: body.workshopSlug,
        full_name: fullName,
        email: email,
        phone: body.phone,
        country: body.country,
        notes: body.notes,
        status: statusRegistrant
      });

      if (error) {
      console.error("Supabase error:", error);

      return Response.json(
        { error: "Failed to save registration." },
        { status: 500 }
      );
    }

    try {
      if (statusRegistrant === "Confirmed") {
      await resend.emails.send({
        from: "Through Indonesia - Registration <workshops@send.throughindonesia.com>",
        to: email,
        subject: "Workshop Registration - Confirmed",
        html: registrationEmail({
          fullName,
          workshopTitle,
          workshopDate,
          workshopLocation,
        }),
      });
      await resend.emails.send({
        from: "Through Indonesia - Admin Notice <workshops@send.throughindonesia.com>",
        to: "eko.sumartopo@gmail.com",
        subject: "New Registration",
        html: adminRegistrationEmail({
          fullName,
          workshopTitle,
          phone,
          country,
          email,
          status:statusRegistrant
        }),
      });
    } else if (statusRegistrant === "Waitlist") {
      await resend.emails.send({
        from: "Through Indonesia - Registration <workshops@send.throughindonesia.com>",
        to: email,
        subject: "Workshop Registration - Waitlist",
        html: registrationEmailWaitlist({
          fullName,
          workshopTitle,
          workshopDate,
          workshopLocation,
        }),
      });
      await resend.emails.send({
        from: "Through Indonesia - Admin Notice <workshops@send.throughindonesia.com>",
        to: "eko.sumartopo@gmail.com",
        subject: "New Registration",
        html: adminRegistrationEmail({
          fullName,
          workshopTitle,
          phone,
          country,
          email,
          status:statusRegistrant
        }),
      });      
    }
    } catch (err) {
      console.error("Failed to send email:", err);
    }

  } catch (err) {
    console.error("Registration endpoint error:", err);

    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}

function formatWorkshopDates(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const sameMonth =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth();

  if (sameMonth) {
    return `${startDate.toLocaleDateString("en-US", {
      month: "long",
    })} ${startDate.getDate()}–${endDate.getDate()}, ${startDate.getFullYear()}`;
  }

  return `${startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })} – ${endDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
}