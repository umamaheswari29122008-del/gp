import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Applications', to: '/applications' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const content = useContent();
  const { site } = content;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const socials = [
    { label: 'Facebook', href: site.facebook_url, icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>) },
    { label: 'WhatsApp', href: site.whatsapp_channel, icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>) },
    { label: 'Instagram', href: site.instagram_url, icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>) },
    { label: 'LinkedIn', href: site.linkedin_url, icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>) },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3 shadow-lg shadow-black/10' : 'py-5'}`}
      style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <img src="/dove-logo.png" alt="Dove Gel Packs" className="h-10 object-contain group-hover:scale-105 transition-all duration-300" />
        </NavLink>

        <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              className={({ isActive }) => `px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-black bg-[#e8f2fc]' : 'text-black/70 hover:text-black hover:bg-black/5'}`}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-black/60 hover:text-black hover:bg-black/8 transition-all duration-200">
              {s.icon}
            </a>
          ))}
          <div className="w-px h-5 bg-black/15 mx-1" />
          <NavLink to="/contact" className="glow-button inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-ice-500 text-white font-semibold text-sm hover:bg-ice-400 transition-colors shadow-lg shadow-ice-500/25">
            {site.nav_btn_quote}
          </NavLink>
        </div>

        <button className="md:hidden p-2 rounded-lg text-black hover:bg-black/5 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/10 mt-2 px-6 py-4 space-y-1" style={{ background: '#ffffff' }}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) => `block px-4 py-2.5 rounded-xl font-medium transition-colors ${isActive ? 'text-black bg-[#e8f2fc]' : 'text-black/70 hover:text-black hover:bg-black/5'}`}>
              {link.label}
            </NavLink>
          ))}
          <div className="flex gap-3 px-4 pt-2">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-black/60 hover:text-black hover:bg-black/8 transition-all">
                {s.icon}
              </a>
            ))}
          </div>
          <NavLink to="/contact" onClick={() => setOpen(false)}
            className="block mt-2 text-center px-4 py-2.5 rounded-xl bg-ice-500 text-white font-semibold hover:bg-ice-400 transition-colors">
            {site.nav_btn_quote}
          </NavLink>
        </div>
      )}
    </nav>
  );
}
