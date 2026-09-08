import { z } from 'zod';
export const contact = { email: 'johnmanuelcuerdo@gmail.com', heading: 'Got a project in mind?', description: "I'm open to discussing websites, systems, internal tools, and custom digital platforms." };
export const projectTypes = ['Website', 'Web Application', 'Business System', 'Collaboration', 'Other'] as const;
export const contactSchema = z.object({ name: z.string().trim().min(2, 'Please enter your name.').max(100), email: z.email('Enter a valid email address.').max(254), projectType: z.enum(projectTypes), message: z.string().trim().min(20, 'Please write at least 20 characters.').max(5000), website: z.string().max(0).optional() });
export type ContactValues = z.infer<typeof contactSchema>;
