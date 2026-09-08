import { Resend } from 'resend';
import { contact, contactSchema } from '@/data/contact';
export async function POST(request: Request) {
    if (Number(request.headers.get('content-length')) > 16000)
        return Response.json({ error: 'Message too large.' }, { status: 413 });
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin)
        return Response.json({ error: 'Invalid origin.' }, { status: 403 });
    let body: unknown;
    try {
        const raw = await request.text();
        if (raw.length > 16000)
            return Response.json({ error: 'Message too large.' }, { status: 413 });
        body = JSON.parse(raw);
    }
    catch {
        return Response.json({ error: 'Invalid request.' }, { status: 400 });
    }
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success)
        return Response.json({ error: 'Please check your form fields.' }, { status: 400 });
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL)
        return Response.json({ error: 'The message station is not connected yet. Please email me directly.' }, { status: 503 });
    const { name, email, projectType, message } = parsed.data;
    try {
        const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: process.env.RESEND_FROM_EMAIL, to: process.env.CONTACT_TO_EMAIL || contact.email, replyTo: email, subject: `Portfolio enquiry: ${projectType}`, text: `Name: ${name}\nEmail: ${email}\nProject type: ${projectType}\n\n${message}` });
        if (error)
            throw error;
        return Response.json({ success: true });
    }
    catch {
        return Response.json({ error: 'Your message could not be delivered. Please email me directly.' }, { status: 502 });
    }
}
