'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Send } from 'lucide-react';
import { contact, contactSchema, ContactValues, projectTypes } from '@/data/contact';
export default function ContactForm({ onDelivered }: { onDelivered?: () => void } = {}) {
    const [status, setStatus] = useState('');
    const [success, setSuccess] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { projectType: 'Website', website: '' } });
    async function submit(data: ContactValues) { setStatus(''); setSuccess(false); try {
        const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const result = await r.json();
        if (!r.ok)
            throw new Error(result.error);
        setStatus('Message delivered. Thanks for reaching out!');
        setSuccess(true);
        onDelivered?.();
        reset();
    }
    catch (e) {
        setStatus(e instanceof Error ? e.message : 'Unable to connect. Please email me directly.');
    } }
    return <><h3>{contact.heading}</h3><p>{contact.description}</p><form onSubmit={handleSubmit(submit)} noValidate><div className="form-row"><label>Name<input autoComplete="name" {...register('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined}/>{errors.name && <small id="name-error">{errors.name.message}</small>}</label><label>Email<input type="email" autoComplete="email" {...register('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}/>{errors.email && <small id="email-error">{errors.email.message}</small>}</label></div><label>Project type<select {...register('projectType')}>{projectTypes.map(t => <option key={t}>{t}</option>)}</select></label><label>Message<textarea rows={4} {...register('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined}/>{errors.message && <small id="message-error">{errors.message.message}</small>}</label><label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register('website')}/></label><button className="primary" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send message'}<Send size={16}/></button><p role="status" className={success ? 'success' : 'form-status'}>{status}</p></form><a className="email-link" href={`mailto:${contact.email}`}>Email me directly <ArrowUpRight size={16}/><span>{contact.email}</span></a></>;
}

