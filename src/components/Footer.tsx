import { NavLink } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { DoveLogo } from './DoveLogo';
import { useContent } from '../context/ContentContext';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Applications', to: '/applications' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const productList = [
  'Ice Gel Packs / Pouches',
  'Ice Gel Containers (HDPE)',
  'Ice Gel Sheets (12 & 24 cell)',
  'Thermocol Insulated Boxes',
];

export function Footer() {
  const { site } = useContent();

  const socials = [
    { label: 'Facebook', href: site.facebook_url, icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
    { label: 'WhatsApp', href: site.whatsapp_channel, icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
    { label: 'Instagram', href: site.instagram_url, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round"/></svg> },
    { label: 'LinkedIn', href: site.linkedin_url, icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg> },
  ];

  return (
    <footer className="relative" style={{ background: 'linear-gradient(180deg, #030c1e 0%, #051022 100%)', borderTop: '1px solid rgba(13,178,232,0.12)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <NavLink to="/" className="flex items-center gap-2.5">
              {site.logo_url ? (
                <img src={site.logo_url} alt={site.site_name} className="w-10 h-10 object-contain" />
              ) : (
                <DoveLogo className="w-10 h-10" />
              )}
              <div className="leading-none">
                <span className="font-display font-bold text-white text-lg">{site.footer_brand_name}</span>
              </div>
            </NavLink>
            <p className="text-ice-200/45 text-sm leading-relaxed max-w-xs">{site.footer_tagline}</p>
            <div className="flex gap-2 pt-1">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-ice-500/8 border border-ice-500/15 flex items-center justify-center text-ice-300/50 hover:text-ice-300 hover:bg-ice-500/15 hover:border-ice-500/30 transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-5 uppercase tracking-widest">{site.footer_quick_links_title}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="text-ice-200/45 text-sm hover:text-ice-300 transition-colors inline-flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-ice-500/30 group-hover:bg-ice-400 transition-colors" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-5 uppercase tracking-widest">{site.footer_products_title}</h4>
            <ul className="space-y-2.5">
              {productList.map((p) => (
                <li key={p} className="text-ice-200/45 text-sm flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-ice-500/25 mt-1.5 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-5 uppercase tracking-widest">{site.footer_contact_title}</h4>
            <div className="space-y-3.5">
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-ice-200/45 hover:text-ice-300 transition-colors text-sm">
                <Mail className="w-4 h-4 text-ice-400 flex-shrink-0" />
                {site.email}
              </a>
              <a href={site.whatsapp_number} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-ice-200/45 hover:text-ice-300 transition-colors text-sm">
                <Phone className="w-4 h-4 text-ice-400 flex-shrink-0" />
                {site.footer_whatsapp_label}
              </a>
              <p className="flex items-start gap-3 text-ice-200/45 text-sm">
                <MapPin className="w-4 h-4 text-ice-400 flex-shrink-0 mt-0.5" />
                {site.address}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-ice-500/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ice-200/30 text-xs">&copy; {new Date().getFullYear()} {site.site_name}. {site.footer_rights}</p>
          <div className="flex gap-4">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="text-ice-300/30 hover:text-ice-300 transition-colors">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
