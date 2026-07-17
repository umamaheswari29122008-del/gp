import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin, Send, Clock, CheckCircle2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { FrozenHeroFX } from '../components/FrozenHeroFX';

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.section-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function Contact() {
  const content = useContent();
  const { site, contact_page, faqs } = content;
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  useReveal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }, 1200);
  };

  const contactItems = [
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: Phone, label: 'Phone', value: site.phone, href: site.phone_href },
    { icon: MapPin, label: contact_page.service_area_label, value: contact_page.service_area_value, href: null },
    { icon: Clock, label: contact_page.response_time_label, value: contact_page.response_time_value, href: null },
  ];

  return (
    <div className="light-page">
      {/* ─── HERO — stays dark blue ─── */}
      <section className="relative pt-32 pb-16 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(13,178,232,0.09) 0%, transparent 65%), linear-gradient(135deg, #030c1e 0%, #071528 60%, #0a1d38 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{ backgroundImage: 'linear-gradient(rgba(56,201,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,201,247,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <FrozenHeroFX />
        <div className="max-w-3xl mx-auto px-6 text-center section-reveal relative z-[3]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-400 text-xs font-semibold mb-5">{contact_page.hero_badge}</div>
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            {contact_page.hero_title_line1}<br />
            <span className="gradient-text">{contact_page.hero_title_line2}</span>
          </h1>
          <p className="text-ice-200/65 text-lg leading-relaxed">{contact_page.hero_sub}</p>
        </div>
      </section>

      {/* ─── CONTACT SECTION — white ─── */}
      <section className="py-16 max-w-7xl mx-auto px-6 light-section-white">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left column — contact info */}
          <div className="lg:col-span-2 space-y-5 section-reveal">
            <a href={site.whatsapp_number} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 light-card rounded-2xl p-5 group">
              <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/25 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#0d2a5a] font-semibold text-sm">{contact_page.whatsapp_card_title}</div>
                <div className="text-green-700/75 text-xs mt-0.5">{contact_page.whatsapp_card_sub}</div>
              </div>
              <Send className="w-4 h-4 text-green-600/50 rotate-45 group-hover:text-green-600 transition-colors flex-shrink-0" />
            </a>

            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4 light-card rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-[#e8f2fc] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#1a56a0]" />
                </div>
                <div>
                  <div className="text-[#5a7a9a] text-xs font-medium">{label}</div>
                  {href ? (
                    <a href={href} className="font-medium text-sm mt-0.5 text-[#1a56a0] hover:opacity-70 transition-opacity">{value}</a>
                  ) : (
                    <div className="text-[#0d2a5a] font-medium text-sm mt-0.5">{value}</div>
                  )}
                </div>
              </div>
            ))}

            <div className="light-card rounded-2xl p-5">
              <h4 className="font-display font-semibold text-[#0d2a5a] text-sm mb-3">{contact_page.help_heading}</h4>
              <ul className="space-y-2">
                {contact_page.help_items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[#5a7a9a] text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1a56a0] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column — form */}
          <div className="lg:col-span-3 section-reveal">
            <form onSubmit={handleSubmit} className="light-card rounded-3xl p-8 space-y-5">
              <div>
                <h2 className="font-display font-bold text-[#0d2a5a] text-2xl mb-1">{contact_page.form_title}</h2>
                <p className="text-[#5a7a9a] text-sm">{contact_page.form_sub}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="light-input-label">{contact_page.form_name_label}</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={contact_page.form_name_ph} className="light-input" />
                </div>
                <div>
                  <label className="light-input-label">{contact_page.form_email_label}</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={contact_page.form_email_ph} className="light-input" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="light-input-label">{contact_page.form_company_label}</label>
                  <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder={contact_page.form_company_ph} className="light-input" />
                </div>
                <div>
                  <label className="light-input-label">{contact_page.form_phone_label}</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={contact_page.form_phone_ph} className="light-input" />
                </div>
              </div>
              <div>
                <label className="light-input-label">{contact_page.form_subject_label}</label>
                <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="light-input" style={{ color: form.subject ? '#0d2a5a' : '#9ab0c8' }}>
                  <option value="" disabled>Select a subject</option>
                  {contact_page.form_subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="light-input-label">{contact_page.form_message_label}</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={contact_page.form_message_ph}
                  className="light-input resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="glow-button w-full py-4 rounded-xl bg-ice-500 text-white font-bold text-sm hover:bg-ice-400 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-ice-500/25">
                {sending ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {contact_page.form_btn_sending}</>
                ) : sent ? (
                  <><CheckCircle2 className="w-4 h-4" /> {contact_page.form_btn_sent}</>
                ) : (
                  <><Send className="w-4 h-4" /> {contact_page.form_btn_send}</>
                )}
              </button>
              {sent && (
                <div className="text-center py-2 px-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                  {contact_page.form_success_msg}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ─── FAQ — light blue ─── */}
      <section className="py-16 max-w-7xl mx-auto px-6 light-section-blue">
        <div className="text-center mb-10 section-reveal">
          <h2 className="font-display text-3xl font-bold light-heading mb-2">
            {contact_page.faq_title_line1} <span className="gradient-text-dark">{contact_page.faq_title_line2}</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {faqs.map((faq, i) => (
            <div key={faq.id || i} className="section-reveal light-card rounded-2xl p-5" style={{ transitionDelay: `${i * 0.08}s` }}>
              <h4 className="font-display font-semibold text-[#0d2a5a] text-sm mb-2">{faq.q}</h4>
              <p className="text-[#5a7a9a] text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA — white ─── */}
      <section className="py-14 text-center section-reveal light-section-white">
        <p className="text-[#5a7a9a] text-sm mb-4">{contact_page.cta_text}</p>
        <Link to="/products" className="light-btn-outline">
          {contact_page.cta_btn}
        </Link>
      </section>
    </div>
  );
}
