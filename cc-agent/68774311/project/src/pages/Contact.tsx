import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin, Send, Clock, CheckCircle2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';

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
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}`, color: 'bg-ice-500/15', iconColor: 'text-ice-400' },
    { icon: Phone, label: 'Phone', value: site.phone, href: site.phone_href, color: 'bg-arctic-500/15', iconColor: 'text-arctic-400' },
    { icon: MapPin, label: 'Service Area', value: 'Worldwide Shipping Available', href: null, color: 'bg-teal-500/15', iconColor: 'text-teal-400' },
    { icon: Clock, label: 'Response Time', value: 'Within 24 business hours', href: null, color: 'bg-cyan-500/15', iconColor: 'text-cyan-400' },
  ];

  return (
    <div style={{ background: '#030c1e', minHeight: '100vh' }}>
      <section className="relative pt-32 pb-16 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(13,178,232,0.09) 0%, transparent 65%), linear-gradient(135deg, #030c1e 0%, #071528 60%, #0a1d38 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{ backgroundImage: 'linear-gradient(rgba(56,201,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,201,247,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-3xl mx-auto px-6 text-center section-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-ice-400 text-xs font-semibold mb-5">Contact Us</div>
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            {contact_page.hero_title_line1}<br />
            <span className="gradient-text">{contact_page.hero_title_line2}</span>
          </h1>
          <p className="text-ice-200/65 text-lg leading-relaxed">{contact_page.hero_sub}</p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-5 section-reveal">
            <a href={site.whatsapp_number} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 glass-card rounded-2xl p-5 card-hover group border border-green-500/20 hover:border-green-500/40">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">WhatsApp</div>
                <div className="text-green-400/75 text-xs mt-0.5">Quick response within minutes</div>
              </div>
              <Send className="w-4 h-4 text-green-400/50 rotate-45 group-hover:text-green-400 transition-colors flex-shrink-0" />
            </a>

            {contactItems.map(({ icon: Icon, label, value, href, color, iconColor }) => (
              <div key={label} className="flex items-center gap-4 glass-card rounded-2xl p-4">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <div className="text-ice-300/55 text-xs font-medium">{label}</div>
                  {href ? (
                    <a href={href} className={`font-medium text-sm mt-0.5 ${iconColor} hover:opacity-80 transition-opacity`}>{value}</a>
                  ) : (
                    <div className="text-white font-medium text-sm mt-0.5">{value}</div>
                  )}
                </div>
              </div>
            ))}

            <div className="glass-card rounded-2xl p-5 border border-ice-500/12">
              <h4 className="font-display font-semibold text-white text-sm mb-3">We can help with:</h4>
              <ul className="space-y-2">
                {contact_page.help_items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-ice-200/60 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ice-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3 section-reveal">
            <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-5">
              <div>
                <h2 className="font-display font-bold text-white text-2xl mb-1">Send a Message</h2>
                <p className="text-ice-300/50 text-sm">Fill in the form and we'll get back to you promptly.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ice-300/65 text-xs font-semibold mb-1.5 uppercase tracking-wide">Full Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl bg-navy-600/50 border border-ice-500/12 text-white placeholder-ice-300/25 text-sm focus:outline-none focus:border-ice-500/45 focus:bg-navy-600/70 transition-colors" />
                </div>
                <div>
                  <label className="block text-ice-300/65 text-xs font-semibold mb-1.5 uppercase tracking-wide">Email *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-navy-600/50 border border-ice-500/12 text-white placeholder-ice-300/25 text-sm focus:outline-none focus:border-ice-500/45 focus:bg-navy-600/70 transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ice-300/65 text-xs font-semibold mb-1.5 uppercase tracking-wide">Company</label>
                  <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Company name (optional)"
                    className="w-full px-4 py-3 rounded-xl bg-navy-600/50 border border-ice-500/12 text-white placeholder-ice-300/25 text-sm focus:outline-none focus:border-ice-500/45 focus:bg-navy-600/70 transition-colors" />
                </div>
                <div>
                  <label className="block text-ice-300/65 text-xs font-semibold mb-1.5 uppercase tracking-wide">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (000) 000-0000"
                    className="w-full px-4 py-3 rounded-xl bg-navy-600/50 border border-ice-500/12 text-white placeholder-ice-300/25 text-sm focus:outline-none focus:border-ice-500/45 focus:bg-navy-600/70 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-ice-300/65 text-xs font-semibold mb-1.5 uppercase tracking-wide">Subject *</label>
                <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-navy-600/50 border border-ice-500/12 text-sm focus:outline-none focus:border-ice-500/45 transition-colors"
                  style={{ color: form.subject ? 'white' : 'rgba(180,220,255,0.25)' }}>
                  <option value="" disabled>Select a subject</option>
                  <option value="bulk">Bulk Order Inquiry</option>
                  <option value="custom">Custom Size Request</option>
                  <option value="pharma">Pharmaceutical Grade</option>
                  <option value="technical">Technical Specifications</option>
                  <option value="shipping">Shipping & Logistics</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-ice-300/65 text-xs font-semibold mb-1.5 uppercase tracking-wide">Message *</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your cooling needs — quantities, pack sizes, application, timeline..."
                  className="w-full px-4 py-3 rounded-xl bg-navy-600/50 border border-ice-500/12 text-white placeholder-ice-300/25 text-sm focus:outline-none focus:border-ice-500/45 focus:bg-navy-600/70 transition-colors resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="glow-button w-full py-4 rounded-xl bg-ice-500 text-white font-bold text-sm hover:bg-ice-400 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-ice-500/25">
                {sending ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : sent ? (
                  <><CheckCircle2 className="w-4 h-4" /> Message Sent!</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Message</>
                )}
              </button>
              {sent && (
                <div className="text-center py-2 px-4 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-sm">
                  Thank you! We will get back to you within 24 hours.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 section-reveal">
          <h2 className="font-display text-3xl font-bold text-white mb-2">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {faqs.map((faq, i) => (
            <div key={faq.id || i} className="section-reveal glass-card rounded-2xl p-5" style={{ transitionDelay: `${i * 0.08}s` }}>
              <h4 className="font-display font-semibold text-white text-sm mb-2">{faq.q}</h4>
              <p className="text-ice-200/55 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 text-center section-reveal">
        <p className="text-ice-300/50 text-sm mb-4">Looking for our product range?</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-card border border-ice-500/20 text-ice-300 font-semibold text-sm hover:text-white hover:border-ice-500/40 transition-colors">
          View All Products →
        </Link>
      </section>
    </div>
  );
}
