interface RegistrationEmailProps {
  fullName: string;
  workshopTitle: string;
  workshopDate: string;
  workshopLocation: string;
}

export function registrationEmail({
  fullName,
  workshopTitle,
  workshopDate,
  workshopLocation,
}: RegistrationEmailProps) {
  return `

    <div style="text-align:center; margin-bottom:24px;">
    <img
        src="https://images.throughindonesia.com/assets/general/through-indonesia-logo-01.svg"
        alt="Through Indonesia"
        width="260"
    />
    </div>

    <h1>Workshop Registration Confirmed</h1>

    <p>Hello ${fullName},</p>

    <p>
      Thank you for registering!
    </p>

    <h2>Your Registration</h2>

    <ul>
      <li><strong>Workshop:</strong> ${workshopTitle}</li>
      <li><strong>Date:</strong> ${workshopDate}</li>
      <li><strong>Location:</strong> ${workshopLocation}</li>
    </ul>

    <p>
      We'll be sending additional information closer to the workshop date.
    </p>

    <p>
      Looking forward to this adventure with you!
    </p>
  `;
}

export function registrationEmailWaitlist({
  fullName,
  workshopTitle,
  workshopDate,
  workshopLocation,
}: RegistrationEmailProps) {
  return `
    <div style="text-align:center; margin-bottom:24px;">
    <img
        src="https://images.throughindonesia.com/assets/general/through-indonesia-logo-01.svg"
        alt="Through Indonesia"
        width="260"
    />
    </div>

    <h1>You've been added to the waitlist!</h1>

    <p>Hello ${fullName},</p>

    <p>
      Thank you for registering for one of my photography workshops!
    </p>

    <h2>Your Registration</h2>

    <ul>
      <li><strong>Workshop:</strong> ${workshopTitle}</li>
      <li><strong>Date:</strong> ${workshopDate}</li>
      <li><strong>Location:</strong> ${workshopLocation}</li>
    </ul>

    <p>We'll contact you as soon as a spot opens up.</p>

    <p>Thank you for being patient with us!</p>
  `;
}