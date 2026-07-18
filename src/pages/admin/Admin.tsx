import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent, useContentApi } from '../../context/ContentContext';
import type { SiteContent } from '../../context/ContentContext';
import { supabase } from '../../lib/supabase';
import { Save, Check, Loader2, Eye, Image as ImageIcon } from 'lucide-react';

type Section = 'site' | 'hero' | 'home' | 'products' | 'applications' | 'about' | 'contact';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'site', label: 'Site Settings' },
  { id: 'hero', label: 'Hero' },
  { id: 'home', label: 'Home Page' },
  { id: 'products', label: 'Products' },
  { id: 'applications', label: 'Applications' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none" />
      )}
    </label>
  );
}

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const name = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('site').upload(name, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('site').getPublicUrl(name);
  return data.publicUrl;
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 outline-none" />
        <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium transition">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          <span>Upload</span>
          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setBusy(true);
            try { onChange(await uploadImage(f)); } catch (err) { alert('Upload failed: ' + err.message); }
            finally { setBusy(false); }
          }} />
        </label>
      </div>
      {value && <img src={value} alt="" className="mt-2 h-16 object-contain rounded border border-slate-200" />}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">{children}</div>;
}

function ListEditor<T>({ items, onChange, render, makeNew, title }: {
  items: T[]; onChange: (items: T[]) => void; title: string;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  makeNew: () => T;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">{title} ({items.length})</h3>
        <button onClick={() => onChange([...items, makeNew()])}
          className="text-xs px-2.5 py-1.5 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-500">+ Add</button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-3 space-y-2 bg-slate-50">
            <div className="flex justify-between">
              <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
              <button onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
            </div>
            {render(item, (patch) => onChange(items.map((it, idx) => idx === i ? { ...it, ...patch } : it)))}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function Admin() {
  const content = useContent();
  const { save, loading, saving } = useContentApi();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [section, setSection] = useState<Section>('site');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setDraft(content); }, [content]);

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSave = async () => {
    await save(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>;
  }

  const u = <K extends keyof SiteContent>(k: K) => update(k, draft[k]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-slate-800 text-lg">Dove Admin — Theme Editor</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">Supabase connected</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">
            <Eye className="w-4 h-4" /> View Site
          </button>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold text-sm hover:bg-sky-500 disabled:opacity-50 transition shadow">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div className="flex max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-60px)] p-3">
          <nav className="space-y-1">
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => setSection(s.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${section === s.id ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Editor */}
        <main className="flex-1 p-6 space-y-4 max-w-3xl">
          {section === 'site' && (
            <>
              <Card>
                <h3 className="font-semibold text-slate-700">Branding</h3>
                <ImageField label="Logo URL" value={draft.site.logo_url} onChange={(v) => update('site', { ...draft.site, logo_url: v })} />
                <Field label="Site Name" value={draft.site.site_name} onChange={(v) => update('site', { ...draft.site, site_name: v })} />
                <Field label="Tagline" value={draft.site.tagline} onChange={(v) => update('site', { ...draft.site, tagline: v })} />
                <Field label="Footer Brand Name" value={draft.site.footer_brand_name} onChange={(v) => update('site', { ...draft.site, footer_brand_name: v })} />
                <Field label="Footer Tagline" value={draft.site.footer_tagline} onChange={(v) => update('site', { ...draft.site, footer_tagline: v })} textarea />
              </Card>
              <Card>
                <h3 className="font-semibold text-slate-700">Contact</h3>
                <Field label="Email" value={draft.site.email} onChange={(v) => update('site', { ...draft.site, email: v })} />
                <Field label="Phone" value={draft.site.phone} onChange={(v) => update('site', { ...draft.site, phone: v })} />
                <Field label="Phone href" value={draft.site.phone_href} onChange={(v) => update('site', { ...draft.site, phone_href: v })} />
                <Field label="Address" value={draft.site.address} onChange={(v) => update('site', { ...draft.site, address: v })} />
                <Field label="WhatsApp Number" value={draft.site.whatsapp_number} onChange={(v) => update('site', { ...draft.site, whatsapp_number: v })} />
                <Field label="WhatsApp Channel" value={draft.site.whatsapp_channel} onChange={(v) => update('site', { ...draft.site, whatsapp_channel: v })} />
              </Card>
              <Card>
                <h3 className="font-semibold text-slate-700">Social & Buttons</h3>
                <Field label="Facebook URL" value={draft.site.facebook_url} onChange={(v) => update('site', { ...draft.site, facebook_url: v })} />
                <Field label="Instagram URL" value={draft.site.instagram_url} onChange={(v) => update('site', { ...draft.site, instagram_url: v })} />
                <Field label="LinkedIn URL" value={draft.site.linkedin_url} onChange={(v) => update('site', { ...draft.site, linkedin_url: v })} />
                <Field label="Nav Button Text" value={draft.site.nav_btn_quote} onChange={(v) => update('site', { ...draft.site, nav_btn_quote: v })} />
              </Card>
            </>
          )}

          {section === 'hero' && (
            <Card>
              <h3 className="font-semibold text-slate-700">Hero Section</h3>
              <Field label="Badge Text" value={draft.hero.badge_text} onChange={(v) => update('hero', { ...draft.hero, badge_text: v })} />
              <Field label="Headline Line 1" value={draft.hero.headline_line1} onChange={(v) => update('hero', { ...draft.hero, headline_line1: v })} />
              <Field label="Headline Line 2" value={draft.hero.headline_line2} onChange={(v) => update('hero', { ...draft.hero, headline_line2: v })} />
              <Field label="Headline Line 3" value={draft.hero.headline_line3} onChange={(v) => update('hero', { ...draft.hero, headline_line3: v })} />
              <Field label="Headline Line 4" value={draft.hero.headline_line4} onChange={(v) => update('hero', { ...draft.hero, headline_line4: v })} />
              <Field label="Subheadline" value={draft.hero.subheadline} onChange={(v) => update('hero', { ...draft.hero, subheadline: v })} textarea />
              <Field label="Products Button" value={draft.hero.btn_products_text} onChange={(v) => update('hero', { ...draft.hero, btn_products_text: v })} />
              <Field label="WhatsApp Button" value={draft.hero.btn_whatsapp_text} onChange={(v) => update('hero', { ...draft.hero, btn_whatsapp_text: v })} />
              <Field label="CTA Headline" value={draft.hero.cta_headline} onChange={(v) => update('hero', { ...draft.hero, cta_headline: v })} />
              <Field label="CTA Sub" value={draft.hero.cta_sub} onChange={(v) => update('hero', { ...draft.hero, cta_sub: v })} textarea />
              <Field label="CTA WhatsApp Button" value={draft.hero.cta_btn_whatsapp} onChange={(v) => update('hero', { ...draft.hero, cta_btn_whatsapp: v })} />
              <Field label="CTA Quote Button" value={draft.hero.cta_btn_quote} onChange={(v) => update('hero', { ...draft.hero, cta_btn_quote: v })} />
            </Card>
          )}

          {section === 'home' && (
            <>
              <Card>
                <h3 className="font-semibold text-slate-700">Home Section Texts</h3>
                <Field label="About Badge" value={draft.home_sections.about_badge} onChange={(v) => update('home_sections', { ...draft.home_sections, about_badge: v })} />
                <Field label="Products Badge" value={draft.home_sections.products_badge} onChange={(v) => update('home_sections', { ...draft.home_sections, products_badge: v })} />
                <Field label="Products Title 1" value={draft.home_sections.products_title_line1} onChange={(v) => update('home_sections', { ...draft.home_sections, products_title_line1: v })} />
                <Field label="Products Title 2" value={draft.home_sections.products_title_line2} onChange={(v) => update('home_sections', { ...draft.home_sections, products_title_line2: v })} />
                <Field label="Products Sub" value={draft.home_sections.products_sub} onChange={(v) => update('home_sections', { ...draft.home_sections, products_sub: v })} textarea />
                <Field label="Products Button" value={draft.home_sections.products_btn} onChange={(v) => update('home_sections', { ...draft.home_sections, products_btn: v })} />
                <Field label="Applications Badge" value={draft.home_sections.applications_badge} onChange={(v) => update('home_sections', { ...draft.home_sections, applications_badge: v })} />
                <Field label="Applications Title 1" value={draft.home_sections.applications_title_line1} onChange={(v) => update('home_sections', { ...draft.home_sections, applications_title_line1: v })} />
                <Field label="Applications Title 2" value={draft.home_sections.applications_title_line2} onChange={(v) => update('home_sections', { ...draft.home_sections, applications_title_line2: v })} />
                <Field label="Applications Sub" value={draft.home_sections.applications_sub} onChange={(v) => update('home_sections', { ...draft.home_sections, applications_sub: v })} textarea />
                <Field label="Applications Button" value={draft.home_sections.applications_btn} onChange={(v) => update('home_sections', { ...draft.home_sections, applications_btn: v })} />
                <Field label="Testimonials Badge" value={draft.home_sections.testimonials_badge} onChange={(v) => update('home_sections', { ...draft.home_sections, testimonials_badge: v })} />
                <Field label="Testimonials Title 1" value={draft.home_sections.testimonials_title_line1} onChange={(v) => update('home_sections', { ...draft.home_sections, testimonials_title_line1: v })} />
                <Field label="Testimonials Title 2" value={draft.home_sections.testimonials_title_line2} onChange={(v) => update('home_sections', { ...draft.home_sections, testimonials_title_line2: v })} />
              </Card>
              <ListEditor
                title="Home Products" items={draft.home_products}
                onChange={(items) => u('home_products')(items)}
                makeNew={() => ({ id: Date.now(), name: 'New Product', desc: '', icon: '🧊', tag: '', grad: 'from-ice-600 to-ice-500', sizes: '', image: '', sort_order: draft.home_products.length + 1 })}
                render={(p, upd) => (
                  <>
                    <Field label="Name" value={p.name} onChange={(v) => upd({ name: v })} />
                    <Field label="Description" value={p.desc} onChange={(v) => upd({ desc: v })} textarea />
                    <Field label="Sizes" value={p.sizes} onChange={(v) => upd({ sizes: v })} />
                    <Field label="Tag" value={p.tag} onChange={(v) => upd({ tag: v })} />
                    <ImageField label="Image" value={p.image} onChange={(v) => upd({ image: v })} />
                  </>
                )}
              />
              <ListEditor
                title="Testimonials" items={draft.testimonials}
                onChange={(items) => u('testimonials')(items)}
                makeNew={() => ({ id: Date.now(), name: 'New Client', role: '', text: '', rating: 5, sort_order: draft.testimonials.length + 1 })}
                render={(t, upd) => (
                  <>
                    <Field label="Name" value={t.name} onChange={(v) => upd({ name: v })} />
                    <Field label="Role" value={t.role} onChange={(v) => upd({ role: v })} />
                    <Field label="Text" value={t.text} onChange={(v) => upd({ text: v })} textarea />
                    <Field label="Rating (1-5)" value={String(t.rating)} onChange={(v) => upd({ rating: Number(v) || 5 })} />
                  </>
                )}
              />
            </>
          )}

          {section === 'products' && (
            <>
              <Card>
                <h3 className="font-semibold text-slate-700">Products Page Header</h3>
                <Field label="Hero Badge" value={draft.products_page.hero_badge} onChange={(v) => update('products_page', { ...draft.products_page, hero_badge: v })} />
                <Field label="Hero Title 1" value={draft.products_page.hero_title_line1} onChange={(v) => update('products_page', { ...draft.products_page, hero_title_line1: v })} />
                <Field label="Hero Title 2" value={draft.products_page.hero_title_line2} onChange={(v) => update('products_page', { ...draft.products_page, hero_title_line2: v })} />
                <Field label="Hero Sub" value={draft.products_page.hero_sub} onChange={(v) => update('products_page', { ...draft.products_page, hero_sub: v })} textarea />
                <Field label="WhatsApp Button" value={draft.products_page.btn_whatsapp} onChange={(v) => update('products_page', { ...draft.products_page, btn_whatsapp: v })} />
                <Field label="Quote Button" value={draft.products_page.btn_quote} onChange={(v) => update('products_page', { ...draft.products_page, btn_quote: v })} />
              </Card>
              {draft.product_categories.map((cat, ci) => (
                <Card key={cat.id}>
                  <h3 className="font-semibold text-slate-700">Category: {cat.label}</h3>
                  <Field label="Label" value={cat.label} onChange={(v) => update('product_categories', draft.product_categories.map((c, idx) => idx === ci ? { ...c, label: v } : c))} />
                  <Field label="Title" value={cat.title} onChange={(v) => update('product_categories', draft.product_categories.map((c, idx) => idx === ci ? { ...c, title: v } : c))} />
                  <Field label="Description" value={cat.description} onChange={(v) => update('product_categories', draft.product_categories.map((c, idx) => idx === ci ? { ...c, description: v } : c))} textarea />
                  <Field label="Accent From (hex)" value={cat.accent_from} onChange={(v) => update('product_categories', draft.product_categories.map((c, idx) => idx === ci ? { ...c, accent_from: v } : c))} />
                  <Field label="Accent To (hex)" value={cat.accent_to} onChange={(v) => update('product_categories', draft.product_categories.map((c, idx) => idx === ci ? { ...c, accent_to: v } : c))} />
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Variants</span>
                    {cat.variants.map((v, vi) => (
                      <div key={v.id} className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 bg-slate-50">
                        <input value={v.name} onChange={(e) => update('product_categories', draft.product_categories.map((c, idx) => idx === ci ? { ...c, variants: c.variants.map((vv, vidx) => vidx === vi ? { ...vv, name: e.target.value } : vv) } : c))}
                          className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm" />
                        <ImageField label="" value={v.image || ''} onChange={(url) => update('product_categories', draft.product_categories.map((c, idx) => idx === ci ? { ...c, variants: c.variants.map((vv, vidx) => vidx === vi ? { ...vv, image: url } : vv) } : c))} />
                        <button onClick={() => update('product_categories', draft.product_categories.map((c, idx) => idx === ci ? { ...c, variants: c.variants.filter((_, vidx) => vidx !== vi) } : c))}
                          className="text-xs text-red-500 font-medium">Del</button>
                      </div>
                    ))}
                    <button onClick={() => update('product_categories', draft.product_categories.map((c, idx) => idx === ci ? { ...c, variants: [...c.variants, { id: Date.now(), category_id: c.id, name: 'New', image: '', sort_order: c.variants.length + 1 }] } : c))}
                      className="text-xs px-2 py-1 rounded bg-sky-600 text-white font-medium">+ Add Variant</button>
                  </div>
                </Card>
              ))}
            </>
          )}

          {section === 'applications' && (
            <>
              <Card>
                <h3 className="font-semibold text-slate-700">Applications Page Header</h3>
                <Field label="Hero Badge" value={draft.applications_page.hero_badge} onChange={(v) => update('applications_page', { ...draft.applications_page, hero_badge: v })} />
                <Field label="Hero Title 1" value={draft.applications_page.hero_title_line1} onChange={(v) => update('applications_page', { ...draft.applications_page, hero_title_line1: v })} />
                <Field label="Hero Title 2" value={draft.applications_page.hero_title_line2} onChange={(v) => update('applications_page', { ...draft.applications_page, hero_title_line2: v })} />
                <Field label="Hero Sub" value={draft.applications_page.hero_sub} onChange={(v) => update('applications_page', { ...draft.applications_page, hero_sub: v })} textarea />
                <Field label="CTA Headline" value={draft.applications_page.cta_headline} onChange={(v) => update('applications_page', { ...draft.applications_page, cta_headline: v })} />
                <Field label="CTA Sub" value={draft.applications_page.cta_sub} onChange={(v) => update('applications_page', { ...draft.applications_page, cta_sub: v })} textarea />
              </Card>
              <ListEditor
                title="Applications" items={draft.applications}
                onChange={(items) => u('applications')(items)}
                makeNew={() => ({ id: Date.now(), title: 'New Application', description: '', img: '', tag: '', details: [], sort_order: draft.applications.length + 1 })}
                render={(a, upd) => (
                  <>
                    <Field label="Title" value={a.title} onChange={(v) => upd({ title: v })} />
                    <Field label="Description" value={a.description} onChange={(v) => upd({ description: v })} textarea />
                    <Field label="Tag" value={a.tag} onChange={(v) => upd({ tag: v })} />
                    <ImageField label="Image" value={a.img} onChange={(v) => upd({ img: v })} />
                    <Field label="Details (comma separated)" value={(a.details || []).join(', ')} onChange={(v) => upd({ details: v.split(',').map((s) => s.trim()).filter(Boolean) })} textarea />
                  </>
                )}
              />
            </>
          )}

          {section === 'about' && (
            <>
              <Card>
                <h3 className="font-semibold text-slate-700">About Page Header</h3>
                <Field label="Hero Badge" value={draft.about_page.hero_badge} onChange={(v) => update('about_page', { ...draft.about_page, hero_badge: v })} />
                <Field label="Hero Title 1" value={draft.about_page.hero_title_line1} onChange={(v) => update('about_page', { ...draft.about_page, hero_title_line1: v })} />
                <Field label="Hero Title 2" value={draft.about_page.hero_title_line2} onChange={(v) => update('about_page', { ...draft.about_page, hero_title_line2: v })} />
                <Field label="Hero Title 3" value={draft.about_page.hero_title_line3} onChange={(v) => update('about_page', { ...draft.about_page, hero_title_line3: v })} />
                <Field label="Hero Sub" value={draft.about_page.hero_sub} onChange={(v) => update('about_page', { ...draft.about_page, hero_sub: v })} textarea />
                <Field label="Story Title" value={draft.about_page.story_title} onChange={(v) => update('about_page', { ...draft.about_page, story_title: v })} />
                <Field label="Values Title" value={draft.about_page.values_title} onChange={(v) => update('about_page', { ...draft.about_page, values_title: v })} />
                <Field label="Features Title" value={draft.about_page.features_title} onChange={(v) => update('about_page', { ...draft.about_page, features_title: v })} />
                <Field label="CTA Headline" value={draft.about_page.cta_headline} onChange={(v) => update('about_page', { ...draft.about_page, cta_headline: v })} />
                <Field label="CTA Sub" value={draft.about_page.cta_sub} onChange={(v) => update('about_page', { ...draft.about_page, cta_sub: v })} textarea />
              </Card>
              <ListEditor
                title="Milestones" items={draft.milestones}
                onChange={(items) => u('milestones')(items)}
                makeNew={() => ({ id: Date.now(), year: String(new Date().getFullYear()), title: 'New Milestone', desc: '', sort_order: draft.milestones.length + 1 })}
                render={(m, upd) => (
                  <>
                    <Field label="Year" value={m.year} onChange={(v) => upd({ year: v })} />
                    <Field label="Title" value={m.title} onChange={(v) => upd({ title: v })} />
                    <Field label="Description" value={m.desc} onChange={(v) => upd({ desc: v })} textarea />
                  </>
                )}
              />
              <ListEditor
                title="Features" items={draft.features}
                onChange={(items) => u('features')(items)}
                makeNew={() => ({ text: 'New feature' })}
                render={(f, upd) => (
                  <Field label="Text" value={f.text} onChange={(v) => upd({ text: v })} textarea />
                )}
              />
            </>
          )}

          {section === 'contact' && (
            <>
              <Card>
                <h3 className="font-semibold text-slate-700">Contact Page</h3>
                <Field label="Hero Badge" value={draft.contact_page.hero_badge} onChange={(v) => update('contact_page', { ...draft.contact_page, hero_badge: v })} />
                <Field label="Hero Title 1" value={draft.contact_page.hero_title_line1} onChange={(v) => update('contact_page', { ...draft.contact_page, hero_title_line1: v })} />
                <Field label="Hero Title 2" value={draft.contact_page.hero_title_line2} onChange={(v) => update('contact_page', { ...draft.contact_page, hero_title_line2: v })} />
                <Field label="Hero Sub" value={draft.contact_page.hero_sub} onChange={(v) => update('contact_page', { ...draft.contact_page, hero_sub: v })} textarea />
                <Field label="Form Title" value={draft.contact_page.form_title} onChange={(v) => update('contact_page', { ...draft.contact_page, form_title: v })} />
                <Field label="Form Sub" value={draft.contact_page.form_sub} onChange={(v) => update('contact_page', { ...draft.contact_page, form_sub: v })} />
                <Field label="WhatsApp Card Title" value={draft.contact_page.whatsapp_card_title} onChange={(v) => update('contact_page', { ...draft.contact_page, whatsapp_card_title: v })} />
                <Field label="Send Button" value={draft.contact_page.form_btn_send} onChange={(v) => update('contact_page', { ...draft.contact_page, form_btn_send: v })} />
              </Card>
              <ListEditor
                title="FAQs" items={draft.faqs}
                onChange={(items) => u('faqs')(items)}
                makeNew={() => ({ id: Date.now(), q: 'New question?', a: 'Answer here.', sort_order: draft.faqs.length + 1 })}
                render={(f, upd) => (
                  <>
                    <Field label="Question" value={f.q} onChange={(v) => upd({ q: v })} />
                    <Field label="Answer" value={f.a} onChange={(v) => upd({ a: v })} textarea />
                  </>
                )}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
