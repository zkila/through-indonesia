interface AdminRegistrationEmailProps {
  fullName: string;
  workshopTitle: string;
  phone: string;
  country: string;
  email: string;
  status: string;
}

export function adminRegistrationEmail({
    fullName,
    workshopTitle,
    phone,
    country,
    email,
    status,
}: AdminRegistrationEmailProps){
    return `

    <div style="text-align:center; margin-bottom:24px;">
    <img
        src="https://images.throughindonesia.com/assets/general/through-indonesia-logo-01.svg"
        alt="Through Indonesia"
        width="260"
    />
    </div>

    <h1>New Registration</h1>

    <ul>
      <li><strong>Workshop:</strong> ${workshopTitle}</li>
      <li><strong>Name:</strong> ${fullName}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone:</strong> ${phone}</li>
      <li><strong>Country:</strong> ${country}</li>
      <li><strong>Status:</strong> ${status}</li>
    </ul>
    `
}