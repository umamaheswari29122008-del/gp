import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ── Exact interfaces pages destructure ────────────────────────────────────────
export interface SiteInfo {
  logo_url: string; site_name: string; tagline: string;
  whatsapp_number: string; whatsapp_channel: string;
  email: string; phone: string; phone_href: string; address: string;
  footer_tagline: string;
  facebook_url: string; instagram_url: string; linkedin_url: string;
  nav_btn_quote: string;
  footer_brand_name: string; footer_quick_links_title: string; footer_products_title: string;
  footer_contact_title: string; footer_whatsapp_label: string; footer_rights: string;
}
export interface HeroData {
  badge_text: string;
  headline_line1: string; headline_line2: string;
  headline_line3: string; headline_line4: string;
  subheadline: string;
  btn_products_text: string; btn_whatsapp_text: string;
  cta_headline: string; cta_sub: string;
  cta_btn_whatsapp: string; cta_btn_quote: string;
  cta_title_highlight: string;
}
export interface StatItem    { icon: string; value: string; label: string; color: string; }
export interface BigStat     { value: string; label: string; sub: string; }
export interface ServiceItem { icon: string; text: string; }
// home_products: pages use `.desc`
export interface HomeProduct { id: number; name: string; desc: string; icon: string; tag: string; grad: string; sizes: string; image: string; sort_order: number; }
export interface ProductVariant { id: number; category_id: string; name: string; image: string; sort_order: number; }
export interface ProductCategory { id: string; label: string; title: string; description: string; accent_from: string; accent_to: string; specs: string[]; sort_order: number; variants: ProductVariant[]; }
// home_applications: pages use `.desc`
export interface HomeApplication { id: number; title: string; icon: string; desc: string; sort_order: number; }
export interface Testimonial { id: number; name: string; role: string; text: string; rating: number; sort_order: number; }
export interface Application { id: number; title: string; description: string; img: string; tag: string; details: string[]; sort_order: number; }
export interface AboutPage {
  hero_title_line1: string; hero_title_line2: string; hero_title_line3: string; hero_sub: string;
  hero_badge: string; story_badge: string; values_badge: string; features_badge: string;
  story_title: string; values_title: string; features_title: string; features_sub: string;
  cta_headline: string; cta_sub: string;
  about_intro_title: string; about_intro_highlight: string; about_intro_p1: string; about_intro_p2: string;
  btn_products: string; btn_contact: string; cta_btn_contact: string; cta_btn_products: string;
}
export interface AboutStat     { icon: string; value: string; label: string; }
export interface Value         { icon: string; title: string; desc: string; color: string; }
export interface Feature       { text: string; }
export interface Certification { name: string; }
// milestones: pages use `.desc`
export interface Milestone     { id: number; year: string; title: string; desc: string; sort_order: number; }
export interface ContactPage   {
  hero_title_line1: string; hero_title_line2: string; hero_sub: string; help_items: string[];
  hero_badge: string;
  service_area_label: string; service_area_value: string;
  response_time_label: string; response_time_value: string;
  whatsapp_card_title: string; whatsapp_card_sub: string;
  help_heading: string; form_title: string; form_sub: string;
  form_name_label: string; form_email_label: string; form_company_label: string;
  form_phone_label: string; form_subject_label: string; form_message_label: string;
  form_name_ph: string; form_email_ph: string; form_company_ph: string;
  form_phone_ph: string; form_message_ph: string;
  form_subjects: { label: string; value: string }[];
  form_btn_sending: string; form_btn_sent: string; form_btn_send: string; form_success_msg: string;
  faq_title_line1: string; faq_title_line2: string;
  cta_text: string; cta_btn: string;
}
export interface ProductsPage {
  hero_badge: string; hero_title_line1: string; hero_title_line2: string; hero_sub: string;
  btn_whatsapp: string; btn_quote: string; strip_title: string;
}
export interface ApplicationsPage {
  hero_badge: string; hero_title_line1: string; hero_title_line2: string; hero_sub: string;
  cta_headline: string; cta_sub: string; cta_btn_contact: string; cta_btn_products: string;
}
export interface HomeSections {
  about_badge: string;
  products_badge: string; products_title_line1: string; products_title_line2: string;
  products_sub: string; products_btn: string;
  applications_badge: string; applications_title_line1: string; applications_title_line2: string;
  applications_sub: string; applications_btn: string;
  testimonials_badge: string; testimonials_title_line1: string; testimonials_title_line2: string;
}
// faqs: pages use `.q` and `.a`
export interface Faq           { id: number; q: string; a: string; sort_order: number; }

export interface SiteContent {
  site: SiteInfo;
  hero: HeroData;
  stats: StatItem[];
  big_stats: BigStat[];
  services: ServiceItem[];
  home_products: HomeProduct[];
  product_categories: ProductCategory[];
  home_applications: HomeApplication[];
  testimonials: Testimonial[];
  applications: Application[];
  about_page: AboutPage;
  about_snippets: { icon: string; title: string; desc: string }[];
  about_stats: AboutStat[];
  values: Value[];
  features: Feature[];
  certifications: Certification[];
  milestones: Milestone[];
  contact_page: ContactPage;
  faqs: Faq[];
  products_page: ProductsPage;
  applications_page: ApplicationsPage;
  home_sections: HomeSections;
  loaded: boolean;
}

// ── Complete hardcoded defaults — site works fully with no backend ─────────────

const D: SiteContent = {
  site: {
    logo_url: '', site_name: 'Dove Gel Packs', tagline: 'Superior Cooling Technology',
    whatsapp_number: 'https://wa.me/message/dovegelpacks',
    whatsapp_channel: 'https://www.whatsapp.com/channel/0029Vapq05N3AzNLpO2tkO1x',
    email: 'info@dovegelpacks.com', phone: '+1 (800) DOVE-GEL', phone_href: 'tel:+18003683435',
    address: 'Made in India — Worldwide Shipping',
    footer_tagline: 'Superior cooling technology engineered for medical, food, pharmaceutical, and packaging applications worldwide. Made in India.',
    facebook_url: 'https://www.facebook.com/dove.gelpacks',
    instagram_url: 'https://www.instagram.com/dovegelpacks/',
    linkedin_url: 'https://www.linkedin.com/company/doveindustries/',
    nav_btn_quote: 'Get a Quote',
    footer_brand_name: 'Dove Gel Packs', footer_quick_links_title: 'Quick Links',
    footer_products_title: 'Products', footer_contact_title: 'Contact Us',
    footer_whatsapp_label: 'WhatsApp Direct', footer_rights: 'All rights reserved.',
  },
  hero: {
    badge_text: '20+ Years of Cooling Innovation • Made in India',
    headline_line1: 'Superior', headline_line2: 'Cooling.',
    headline_line3: 'Engineered', headline_line4: 'For Excellence.',
    subheadline: 'DOVE Ice Gel Packs are independently lab-tested, non-toxic, and stay cold up to <strong class="text-ice-300">65% longer</strong> than regular ice.',
    btn_products_text: 'View Products', btn_whatsapp_text: 'Buy on WhatsApp',
    cta_headline: 'Ready to Keep Your Products Perfectly Cold?',
    cta_sub: 'Bulk orders, custom sizes, OEM — we deliver worldwide.',
    cta_btn_whatsapp: 'Buy on WhatsApp', cta_btn_quote: 'Get a Quote',
    cta_title_highlight: 'Perfectly Cold?',
  },
  stats: [
    { icon: 'Timer',     value: '24h',  label: 'Max Cooling', color: 'text-sky-400'  },
    { icon: 'Droplets',  value: '100%', label: 'Leak-Proof',  color: 'text-cyan-400' },
    { icon: 'RotateCcw', value: '∞',    label: 'Reusable',    color: 'text-teal-400' },
    { icon: 'Award',     value: '20+',  label: 'Years Trust', color: 'text-blue-400' },
  ],
  big_stats: [
    { value: '20+',  label: 'Years in Cold Chain', sub: 'Since 2003'       },
    { value: '40+',  label: 'Countries Served',    sub: 'Globally trusted' },
    { value: '500+', label: 'Happy Clients',        sub: 'B2B & B2C'       },
    { value: '65%',  label: 'Longer Cooling',       sub: 'vs regular ice'  },
  ],
  services: [
    { icon: 'Shield',      text: 'Leak-Proof Seal' },
    { icon: 'Zap',         text: 'Quick Freeze'    },
    { icon: 'Thermometer', text: '−18°C Rated'     },
    { icon: 'RotateCcw',   text: 'Reusable'        },
  ],
  home_products: [
    { id:1, name:'Ice Gel Packs / Pouches', desc:'50g–500g. Lab-tested, non-toxic. Stays cold 65% longer than regular ice.', icon:'🧊', tag:'Most Popular', grad:'from-ice-600 to-ice-500',    sizes:'50g · 100g · 150g · 200g · 250g · 400g · 500g', image:'', sort_order:1 },
    { id:2, name:'Ice Gel Container',       desc:'Rigid HDPE containers. 300g–700g. Vacuum-sealed, ideal for seafood & pharma.', icon:'📦', tag:'For Export',   grad:'from-cyan-600 to-teal-500', sizes:'300g · 500g · 700g', image:'', sort_order:2 },
    { id:3, name:'Ice Gel Sheets',          desc:'12-cell & 24-cell. Trimmable to any size. Eco-friendly & reusable.', icon:'🧱', tag:'Flexible',     grad:'from-teal-600 to-cyan-500', sizes:'12-Cell · 24-Cell', image:'', sort_order:3 },
    { id:4, name:'Thermocol Insulated Box', desc:'EPS insulated boxes 3L–150L. Water-resistant, vermin-proof.', icon:'🏗️', tag:'Heavy Duty',    grad:'from-arctic-600 to-teal-500', sizes:'3L · 5L · 7L · 10L · 15L · 20L · 36L · 55L · 120L · 150L', image:'', sort_order:4 },
  ],
  product_categories: [
    {
      id:'pouches', label:'Pouches', title:'ICE GEL PACKS',
      description:'Durable reusable gel pack pouches 50g–500g. Non-toxic, lab-tested, stays cold 65% longer.',
      accent_from:'#1e7ec8', accent_to:'#0db2e8', sort_order:1,
      specs:['32°F & 10°F formulations','Lab-tested & certified','Non-toxic, food-safe','Leak-proof & reusable','Custom sizes available'],
      variants:[
        {id:1,category_id:'pouches',name:'50 Gram', image:'',sort_order:1},{id:2,category_id:'pouches',name:'100 Gram',image:'',sort_order:2},
        {id:3,category_id:'pouches',name:'150 Gram',image:'',sort_order:3},{id:4,category_id:'pouches',name:'200 Gram',image:'',sort_order:4},
        {id:5,category_id:'pouches',name:'250 Gram',image:'',sort_order:5},{id:6,category_id:'pouches',name:'400 Gram',image:'',sort_order:6},
        {id:7,category_id:'pouches',name:'500 Gram',image:'',sort_order:7},
      ],
    },
    {
      id:'container', label:'Container', title:'ICE GEL CONTAINER',
      description:'Rigid HDPE containers with vacuum-sealed fill. Ideal for seafood export and pharmaceutical cold chains.',
      accent_from:'#0d9488', accent_to:'#06b6d4', sort_order:2,
      specs:['Rigid HDPE material','300g, 500g, 700g','Vacuum-sealed fill','White colour','Made in India'],
      variants:[
        {id:8,category_id:'container',name:'300 Gram',image:'',sort_order:1},
        {id:9,category_id:'container',name:'500 Gram',image:'',sort_order:2},
        {id:10,category_id:'container',name:'700 Gram',image:'',sort_order:3},
      ],
    },
    {
      id:'sheets', label:'Sheets', title:'ICE GEL SHEETS',
      description:'Multi-cell flexible sheets trimmable to any size. Works ambient, refrigerated, or frozen.',
      accent_from:'#0d7a6e', accent_to:'#14b8a6', sort_order:3,
      specs:['12-cell & 24-cell configs','Trimmable to any size','Ambient / fridge / frozen','Eco-friendly & reusable','Lightweight design'],
      variants:[
        {id:11,category_id:'sheets',name:'12 Cell',image:'',sort_order:1},
        {id:12,category_id:'sheets',name:'24 Cell',image:'',sort_order:2},
      ],
    },
    {
      id:'thermocol', label:'Thermocol Box', title:'THERMOCOL INSULATED BOX',
      description:'EPS boxes 3L–150L. Water-resistant, vermin-proof. Rotational moulded versions available.',
      accent_from:'#1a4e8a', accent_to:'#2e7ce0', sort_order:4,
      specs:['3L to 150L range','EPS construction','Water-resistant','Drain plug (RM version)','Custom sizes available'],
      variants:[
        {id:13,category_id:'thermocol',name:'3 Litre', image:'',sort_order:1},{id:14,category_id:'thermocol',name:'5 Litre', image:'',sort_order:2},
        {id:15,category_id:'thermocol',name:'7 Litre', image:'',sort_order:3},{id:16,category_id:'thermocol',name:'10 Litre',image:'',sort_order:4},
        {id:17,category_id:'thermocol',name:'15 Litre',image:'',sort_order:5},{id:18,category_id:'thermocol',name:'20 Litre',image:'',sort_order:6},
        {id:19,category_id:'thermocol',name:'36 Litre',image:'',sort_order:7},{id:20,category_id:'thermocol',name:'55 Litre',image:'',sort_order:8},
        {id:21,category_id:'thermocol',name:'120 Litre',image:'',sort_order:9},{id:22,category_id:'thermocol',name:'150 Litre',image:'',sort_order:10},
      ],
    },
  ],
  home_applications: [
    {id:1,title:'Food & Seafood',       icon:'🐟',desc:'Frozen goods, fresh produce, seafood, dairy',    sort_order:1},
    {id:2,title:'Pharmaceutical',       icon:'💊',desc:'Vaccines, medicines, biologics, lab samples',    sort_order:2},
    {id:3,title:'Medical / Healthcare', icon:'🏥',desc:'Surgical items, blood transport, clinical use',  sort_order:3},
    {id:4,title:'Fruits & Vegetables',  icon:'🥦',desc:'Post-harvest freshness, farm-to-table delivery', sort_order:4},
    {id:5,title:'Cold Chain Logistics', icon:'🚛',desc:'Long-haul, last-mile, international shipment',   sort_order:5},
    {id:6,title:'Packaging & Retail',   icon:'📦',desc:'E-commerce, subscription boxes, gifting',        sort_order:6},
  ],
  testimonials: [
    {id:1,name:'Rahul Mehta',    role:'Operations Head, FreshExpress Logistics', text:"Dove Gel Packs have completely transformed our cold chain. Leak-proof, every single time. We've cut our product loss by over 30% since switching.", rating:5,sort_order:1},
    {id:2,name:'Dr. Priya Nair', role:'Procurement Manager, Apollo Pharma',      text:'The pharmaceutical-grade packs meet all regulatory requirements. Temperature stability is excellent. Dove delivers exactly what we need.',           rating:5,sort_order:2},
    {id:3,name:'James Thornton', role:'Founder, ChillBox UK',                    text:"We switched to Dove Gel Sheets for our subscription meal kits. Customers love that they're reusable. Our reviews went up significantly.",              rating:5,sort_order:3},
  ],
  applications: [
    {id:1,title:'Medical & Healthcare',      description:'Precise temperature control for medications, blood samples, surgical instruments and recovery kits.',      img:'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=600', tag:'Healthcare',  details:['Blood sample transport','Medication storage','Post-surgical recovery','Emergency medical kits'], sort_order:1},
    {id:2,title:'Pharmaceutical Cold Chain', description:'Maintain strict thermal conditions for vaccines, biologics and temperature-sensitive drugs during transit.', img:'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=600', tag:'Pharma',      details:['Vaccine transport','Biologics storage','Drug stability testing','Clinical trial samples'],     sort_order:2},
    {id:3,title:'Food Preservation',         description:'Keep fresh produce, meat, dairy and perishables at safe temperatures from farm to table.',                  img:'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600', tag:'Food Safety', details:['Fresh produce','Meat & seafood','Dairy products','Baked goods'],                               sort_order:3},
    {id:4,title:'Packaging & Shipping',      description:'Versatile cooling inserts for any insulated box or mailer — e-commerce and subscription fulfilment.',       img:'https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg?auto=compress&cs=tinysrgb&w=600', tag:'Packaging',   details:['E-commerce fulfillment','Meal kit delivery','Subscription boxes','Direct-to-consumer'],       sort_order:4},
    {id:5,title:'Transport & Logistics',     description:'Lightweight and durable for long-haul delivery, freight and last-mile cold-chain operations.',              img:'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=600',   tag:'Logistics',   details:['Long-haul trucking','Last-mile delivery','Courier services','Air freight'],                  sort_order:5},
  ],
  about_page: {
    hero_title_line1:'Two Decades of', hero_title_line2:'Cold Chain', hero_title_line3:'Excellence',
    hero_sub:'Since 2003, Dove Ice Gel Packs has been at the forefront of cooling technology — delivering durable, leak-proof solutions trusted by medical professionals, food distributors, and logistics companies worldwide.',
    story_title:'A Journey of Innovation', values_title:'What Drives Us Forward',
    features_title:'Built to the Highest Standards',
    features_sub:'Every Dove Gel Pack undergoes rigorous quality control before leaving our facility.',
    cta_headline:'Partner with Dove Gel Packs', cta_sub:'Join 500+ businesses worldwide who trust our cooling solutions.',
    about_intro_title:"India's Trusted", about_intro_highlight:'Cold Chain Partner',
    about_intro_p1:'Founded over two decades ago, Dove Industries manufactures premium ice gel packs, containers, sheets, and insulated thermocol boxes — all independently lab-tested and non-toxic.',
    about_intro_p2:'Our products are a proven substitute for dry ice, keeping items fresh up to 24 hours and performing in ambient, refrigerated, or frozen environments.',
    hero_badge:'About Dove Gel Packs', story_badge:'Our Story', values_badge:'Our Values', features_badge:'',
    btn_products:'View Products', btn_contact:'Contact Us', cta_btn_contact:'Get in Touch', cta_btn_products:'View Products',
  },
  about_snippets: [
    {icon:'Shield',    title:'Non-Toxic Formula',desc:'Safe for food contact, FDA compliant gel' },
    {icon:'Award',     title:'Lab Tested',       desc:'Independently certified for performance'  },
    {icon:'Zap',       title:'Quick Freeze',     desc:'Ready to use in under 60 minutes'         },
    {icon:'RotateCcw', title:'Eco-Friendly',     desc:'Reusable, sustainable, zero waste'        },
  ],
  about_stats: [
    {icon:'Award',     value:'20+',  label:'Years of Innovation'},
    {icon:'Globe',     value:'40+',  label:'Countries Served'   },
    {icon:'Users',     value:'500+', label:'Global Clients'     },
    {icon:'RotateCcw', value:'100%', label:'Reusable Products'  },
  ],
  values: [
    {icon:'Shield',  title:'Reliability',   desc:'Every pack tested for consistent performance across hundreds of freeze cycles.',  color:'from-ice-500 to-ice-400'    },
    {icon:'Zap',     title:'Performance',   desc:'Engineered for maximum cooling efficiency with quick-freeze capability.',         color:'from-cyan-500 to-ice-500'   },
    {icon:'Leaf',    title:'Sustainability',desc:'Reusable, eco-conscious design that reduces single-use waste dramatically.',      color:'from-teal-500 to-cyan-400'  },
    {icon:'Globe',   title:'Global Reach',  desc:'Serving clients in 40+ countries with reliable worldwide shipping and support.', color:'from-arctic-500 to-teal-400'},
  ],
  features: [
    {text:'Thermoplastic polymer construction for maximum durability'     },
    {text:'Works with all insulated shipping boxes and coolers'           },
    {text:'Non-toxic, food-safe gel formula — FDA compliant'              },
    {text:'Lightweight design reduces shipping costs significantly'       },
    {text:'Available in multiple sizes from 50g to 500g+'                },
    {text:'Custom sizes and branding available for bulk orders'           },
    {text:'Maintains consistent temperature throughout full cooling cycle'},
    {text:'Quick freezing — ready to use in under 60 minutes'            },
  ],
  certifications: [
    {name:'FDA Compliant'},{name:'ISO 9001 Certified'},{name:'Food Safe Gel'},{name:'Non-Toxic Formula'},
  ],
  milestones: [
    {id:1,year:'2003',title:'Company Founded',      desc:'Dove Gel Packs established with a focus on superior cold-chain solutions.',sort_order:1},
    {id:2,year:'2008',title:'ISO Certification',    desc:'Achieved ISO 9001 quality management certification.',                    sort_order:2},
    {id:3,year:'2012',title:'Pharmaceutical Grade', desc:'Launched FDA-compliant pharmaceutical-grade gel pack line.',              sort_order:3},
    {id:4,year:'2016',title:'Global Expansion',     desc:'Extended distribution to 40+ countries worldwide.',                      sort_order:4},
    {id:5,year:'2020',title:'Eco Reusable Line',    desc:'Introduced 100% recyclable packaging and enhanced reusable gel formula.', sort_order:5},
    {id:6,year:'2024',title:'20 Years Strong',      desc:'Celebrating two decades of innovation and cold-chain excellence.',        sort_order:6},
  ],
  contact_page: {
    hero_title_line1:"Let's Talk About", hero_title_line2:'Staying Cold',
    hero_sub:"Whether you need bulk pricing, custom sizes, technical specifications, or just have a question — our team is ready to help.",
    help_items:['Bulk order pricing & discounts','Custom sizes & configurations','Pharmaceutical certifications','Technical specifications','Private label & branding','International shipping logistics'],
    hero_badge:'Contact Us',
    service_area_label:'Service Area', service_area_value:'Worldwide Shipping Available',
    response_time_label:'Response Time', response_time_value:'Within 24 business hours',
    whatsapp_card_title:'WhatsApp', whatsapp_card_sub:'Quick response within minutes',
    help_heading:'We can help with:', form_title:'Send a Message', form_sub:"Fill in the form and we'll get back to you promptly.",
    form_name_label:'Full Name *', form_email_label:'Email *', form_company_label:'Company',
    form_phone_label:'Phone', form_subject_label:'Subject *', form_message_label:'Message *',
    form_name_ph:'Your full name', form_email_ph:'your@company.com', form_company_ph:'Company name (optional)',
    form_phone_ph:'+1 (000) 000-0000', form_message_ph:'Describe your cooling needs — quantities, pack sizes, application, timeline...',
    form_subjects:[{label:'Bulk Order Inquiry',value:'bulk'},{label:'Custom Size Request',value:'custom'},{label:'Pharmaceutical Grade',value:'pharma'},{label:'Technical Specifications',value:'technical'},{label:'Shipping & Logistics',value:'shipping'},{label:'Other',value:'other'}],
    form_btn_sending:'Sending...', form_btn_sent:'Message Sent!', form_btn_send:'Send Message', form_success_msg:'Thank you! We will get back to you within 24 hours.',
    faq_title_line1:'Frequently Asked', faq_title_line2:'Questions',
    cta_text:'Looking for our product range?', cta_btn:'View All Products →',
  },
  faqs: [
    {id:1,q:'What is the minimum order quantity?',    a:'We welcome orders of all sizes. For bulk pricing tiers, please contact us directly.',                               sort_order:1},
    {id:2,q:'Are your gel packs food safe?',           a:'Yes — all our packs use FDA-compliant, non-toxic gel formulas certified food safe for direct contact applications.',sort_order:2},
    {id:3,q:'How quickly can gel packs be frozen?',    a:'Our packs reach working temperature in under 60 minutes in a standard domestic or commercial freezer.',            sort_order:3},
    {id:4,q:'Do you offer custom sizes and branding?', a:'Absolutely. We offer custom sizes, colours, and private-label printing for bulk orders. Contact us for details.',   sort_order:4},
  ],
  products_page: {
    hero_badge:'Product Catalog', hero_title_line1:'Premium Cold Chain', hero_title_line2:'Solutions',
    hero_sub:'4 product lines engineered for every cold-chain application — made in India, trusted worldwide.',
    btn_whatsapp:'Order via WhatsApp', btn_quote:'Get Bulk Quote', strip_title:'All Product Categories',
  },
  applications_page: {
    hero_badge:'Applications', hero_title_line1:'Trusted Across', hero_title_line2:'Every Industry',
    hero_sub:'From hospital wards to home delivery — Dove Gel Packs ensure the cold chain stays intact wherever your products travel.',
    cta_headline:"Don't See Your Industry?", cta_sub:'Our gel packs work wherever temperature control matters. Get in touch for a custom solution.',
    cta_btn_contact:'Contact Us', cta_btn_products:'View Products',
  },
  home_sections: {
    about_badge:'About Dove Gel Packs',
    products_badge:'Our Products', products_title_line1:'The Right Pack for', products_title_line2:'Every Need',
    products_sub:'4 product lines covering every cold-chain application — from small pouches to industrial insulated boxes.',
    products_btn:'View Full Product Details',
    applications_badge:'Applications', applications_title_line1:'Trusted Across', applications_title_line2:'Every Industry',
    applications_sub:'From hospital wards to home delivery — Dove keeps the cold chain intact.',
    applications_btn:'See All Applications',
    testimonials_badge:'Testimonials', testimonials_title_line1:'What Our', testimonials_title_line2:'Clients Say',
  },
  loaded: true,
};

const Ctx = createContext<SiteContent>(D);
const ApiCtx = createContext<{ save: (c: SiteContent) => Promise<void>; loading: boolean; saving: boolean }>({ save: async () => {}, loading: true, saving: false });

// ── Map PHP API response → SiteContent ────────────────────────────────────────
function applyApi(data: Record<string, unknown>): SiteContent {
  const s = (data.settings as Record<string,string>) ?? {};
  const g = (k: string, fb: string) => (s[k] !== undefined && s[k] !== '') ? s[k] : fb;

  const site: SiteInfo = {
    logo_url:g('logo_url',D.site.logo_url), site_name:g('site_name',D.site.site_name),
    tagline:g('tagline',D.site.tagline), whatsapp_number:g('whatsapp_number',D.site.whatsapp_number),
    whatsapp_channel:g('whatsapp_channel',D.site.whatsapp_channel),
    email:g('email',D.site.email), phone:g('phone',D.site.phone), phone_href:g('phone_href',D.site.phone_href),
    address:g('address',D.site.address), footer_tagline:g('footer_tagline',D.site.footer_tagline),
    facebook_url:g('facebook_url',D.site.facebook_url), instagram_url:g('instagram_url',D.site.instagram_url),
    linkedin_url:g('linkedin_url',D.site.linkedin_url),
    nav_btn_quote:g('nav_btn_quote',D.site.nav_btn_quote),
    footer_brand_name:g('footer_brand_name',D.site.footer_brand_name),
    footer_quick_links_title:g('footer_quick_links_title',D.site.footer_quick_links_title),
    footer_products_title:g('footer_products_title',D.site.footer_products_title),
    footer_contact_title:g('footer_contact_title',D.site.footer_contact_title),
    footer_whatsapp_label:g('footer_whatsapp_label',D.site.footer_whatsapp_label),
    footer_rights:g('footer_rights',D.site.footer_rights),
  };

  const hero: HeroData = {
    badge_text:g('hero_badge_text',D.hero.badge_text),
    headline_line1:g('hero_headline_line1',D.hero.headline_line1),
    headline_line2:g('hero_headline_line2',D.hero.headline_line2),
    headline_line3:g('hero_headline_line3',D.hero.headline_line3),
    headline_line4:g('hero_headline_line4',D.hero.headline_line4),
    subheadline:g('hero_subheadline',D.hero.subheadline),
    btn_products_text:g('hero_btn_products_text',D.hero.btn_products_text),
    btn_whatsapp_text:g('hero_btn_whatsapp_text',D.hero.btn_whatsapp_text),
    cta_headline:g('hero_cta_headline',D.hero.cta_headline),
    cta_sub:g('hero_cta_sub',D.hero.cta_sub),
    cta_btn_whatsapp:g('hero_cta_btn_whatsapp',D.hero.cta_btn_whatsapp),
    cta_btn_quote:g('hero_cta_btn_quote',D.hero.cta_btn_quote),
    cta_title_highlight:g('home_cta_title_highlight',D.hero.cta_title_highlight),
  };

  const about_page: AboutPage = {
    hero_title_line1:g('about_hero_title_line1',D.about_page.hero_title_line1),
    hero_title_line2:g('about_hero_title_line2',D.about_page.hero_title_line2),
    hero_title_line3:g('about_hero_title_line3',D.about_page.hero_title_line3),
    hero_sub:g('about_hero_sub',D.about_page.hero_sub),
    hero_badge:g('about_hero_badge',D.about_page.hero_badge),
    story_badge:g('about_story_badge',D.about_page.story_badge),
    values_badge:g('about_values_badge',D.about_page.values_badge),
    features_badge:g('about_features_badge',D.about_page.features_badge),
    story_title:g('about_story_title',D.about_page.story_title),
    values_title:g('about_values_title',D.about_page.values_title),
    features_title:g('about_features_title',D.about_page.features_title),
    features_sub:g('about_features_sub',D.about_page.features_sub),
    cta_headline:g('about_cta_headline',D.about_page.cta_headline),
    cta_sub:g('about_cta_sub',D.about_page.cta_sub),
    about_intro_title:g('about_intro_title',D.about_page.about_intro_title),
    about_intro_highlight:g('about_intro_highlight',D.about_page.about_intro_highlight),
    about_intro_p1:g('about_intro_p1',D.about_page.about_intro_p1),
    about_intro_p2:g('about_intro_p2',D.about_page.about_intro_p2),
    btn_products:g('about_btn_products',D.about_page.btn_products),
    btn_contact:g('about_btn_contact',D.about_page.btn_contact),
    cta_btn_contact:g('about_cta_btn_contact',D.about_page.cta_btn_contact),
    cta_btn_products:g('about_cta_btn_products',D.about_page.cta_btn_products),
  };

  let help_items = D.contact_page.help_items;
  try { const p = JSON.parse(g('contact_help_items','')); if (Array.isArray(p) && p.length) help_items = p; } catch(_) {}

  let form_subjects = D.contact_page.form_subjects;
  try { const p = JSON.parse(g('contact_form_subjects','')); if (Array.isArray(p) && p.length) form_subjects = p; } catch(_) {}

  const contact_page: ContactPage = {
    hero_title_line1:g('contact_hero_title_line1',D.contact_page.hero_title_line1),
    hero_title_line2:g('contact_hero_title_line2',D.contact_page.hero_title_line2),
    hero_sub:g('contact_hero_sub',D.contact_page.hero_sub),
    help_items,
    hero_badge:g('contact_hero_badge',D.contact_page.hero_badge),
    service_area_label:g('contact_service_area_label',D.contact_page.service_area_label),
    service_area_value:g('contact_service_area_value',D.contact_page.service_area_value),
    response_time_label:g('contact_response_time_label',D.contact_page.response_time_label),
    response_time_value:g('contact_response_time_value',D.contact_page.response_time_value),
    whatsapp_card_title:g('contact_whatsapp_card_title',D.contact_page.whatsapp_card_title),
    whatsapp_card_sub:g('contact_whatsapp_card_sub',D.contact_page.whatsapp_card_sub),
    help_heading:g('contact_help_heading',D.contact_page.help_heading),
    form_title:g('contact_form_title',D.contact_page.form_title),
    form_sub:g('contact_form_sub',D.contact_page.form_sub),
    form_name_label:g('contact_form_name_label',D.contact_page.form_name_label),
    form_email_label:g('contact_form_email_label',D.contact_page.form_email_label),
    form_company_label:g('contact_form_company_label',D.contact_page.form_company_label),
    form_phone_label:g('contact_form_phone_label',D.contact_page.form_phone_label),
    form_subject_label:g('contact_form_subject_label',D.contact_page.form_subject_label),
    form_message_label:g('contact_form_message_label',D.contact_page.form_message_label),
    form_name_ph:g('contact_form_name_ph',D.contact_page.form_name_ph),
    form_email_ph:g('contact_form_email_ph',D.contact_page.form_email_ph),
    form_company_ph:g('contact_form_company_ph',D.contact_page.form_company_ph),
    form_phone_ph:g('contact_form_phone_ph',D.contact_page.form_phone_ph),
    form_message_ph:g('contact_form_message_ph',D.contact_page.form_message_ph),
    form_subjects,
    form_btn_sending:g('contact_form_btn_sending',D.contact_page.form_btn_sending),
    form_btn_sent:g('contact_form_btn_sent',D.contact_page.form_btn_sent),
    form_btn_send:g('contact_form_btn_send',D.contact_page.form_btn_send),
    form_success_msg:g('contact_form_success_msg',D.contact_page.form_success_msg),
    faq_title_line1:g('contact_faq_title_line1',D.contact_page.faq_title_line1),
    faq_title_line2:g('contact_faq_title_line2',D.contact_page.faq_title_line2),
    cta_text:g('contact_cta_text',D.contact_page.cta_text),
    cta_btn:g('contact_cta_btn',D.contact_page.cta_btn),
  };

  type R = Record<string, unknown>;

  const rawHP = (data.home_products as R[]) ?? [];
  const home_products: HomeProduct[] = rawHP.length > 0
    ? rawHP.map(p => ({...p, desc:(p.description ?? p.desc ?? '')} as HomeProduct))
    : D.home_products;

  const rawHA = (data.home_applications as R[]) ?? [];
  const home_applications: HomeApplication[] = rawHA.length > 0
    ? rawHA.map(a => ({...a, desc:(a.description ?? a.desc ?? '')} as HomeApplication))
    : D.home_applications;

  const rawM = (data.milestones as R[]) ?? [];
  const milestones: Milestone[] = rawM.length > 0
    ? rawM.map(m => ({...m, desc:(m.description ?? m.desc ?? '')} as Milestone))
    : D.milestones;

  const rawF = (data.faqs as R[]) ?? [];
  const faqs: Faq[] = rawF.length > 0
    ? rawF.map(f => ({...f, q:(f.question ?? f.q ?? ''), a:(f.answer ?? f.a ?? '')} as Faq))
    : D.faqs;

  const rawC = (data.product_categories as R[]) ?? [];
  const product_categories: ProductCategory[] = rawC.length > 0
    ? rawC.map(c => ({...c, specs:Array.isArray(c.specs)?c.specs:(typeof c.specs==='string'?JSON.parse(c.specs as string):[])} as ProductCategory))
    : D.product_categories;

  const rawA = (data.applications as R[]) ?? [];
  const applications: Application[] = rawA.length > 0
    ? rawA.map(a => ({...a, details:Array.isArray(a.details)?a.details:(typeof a.details==='string'?JSON.parse(a.details as string):[])} as Application))
    : D.applications;

  const rawT = (data.testimonials as Testimonial[]) ?? [];
  const testimonials = rawT.length > 0 ? rawT : D.testimonials;

  const products_page: ProductsPage = {
    hero_badge:g('products_hero_badge',D.products_page.hero_badge),
    hero_title_line1:g('products_hero_title_line1',D.products_page.hero_title_line1),
    hero_title_line2:g('products_hero_title_line2',D.products_page.hero_title_line2),
    hero_sub:g('products_hero_sub',D.products_page.hero_sub),
    btn_whatsapp:g('products_btn_whatsapp',D.products_page.btn_whatsapp),
    btn_quote:g('products_btn_quote',D.products_page.btn_quote),
    strip_title:g('products_strip_title',D.products_page.strip_title),
  };
  const applications_page: ApplicationsPage = {
    hero_badge:g('applications_hero_badge',D.applications_page.hero_badge),
    hero_title_line1:g('applications_hero_title_line1',D.applications_page.hero_title_line1),
    hero_title_line2:g('applications_hero_title_line2',D.applications_page.hero_title_line2),
    hero_sub:g('applications_hero_sub',D.applications_page.hero_sub),
    cta_headline:g('applications_cta_headline',D.applications_page.cta_headline),
    cta_sub:g('applications_cta_sub',D.applications_page.cta_sub),
    cta_btn_contact:g('applications_cta_btn_contact',D.applications_page.cta_btn_contact),
    cta_btn_products:g('applications_cta_btn_products',D.applications_page.cta_btn_products),
  };
  const home_sections: HomeSections = {
    about_badge:g('home_about_badge',D.home_sections.about_badge),
    products_badge:g('home_products_badge',D.home_sections.products_badge),
    products_title_line1:g('home_products_title_line1',D.home_sections.products_title_line1),
    products_title_line2:g('home_products_title_line2',D.home_sections.products_title_line2),
    products_sub:g('home_products_sub',D.home_sections.products_sub),
    products_btn:g('home_products_btn',D.home_sections.products_btn),
    applications_badge:g('home_applications_badge',D.home_sections.applications_badge),
    applications_title_line1:g('home_applications_title_line1',D.home_sections.applications_title_line1),
    applications_title_line2:g('home_applications_title_line2',D.home_sections.applications_title_line2),
    applications_sub:g('home_applications_sub',D.home_sections.applications_sub),
    applications_btn:g('home_applications_btn',D.home_sections.applications_btn),
    testimonials_badge:g('home_testimonials_badge',D.home_sections.testimonials_badge),
    testimonials_title_line1:g('home_testimonials_title_line1',D.home_sections.testimonials_title_line1),
    testimonials_title_line2:g('home_testimonials_title_line2',D.home_sections.testimonials_title_line2),
  };

  const parseArr = <T,>(key: string, fallback: T[]): T[] => {
    try { const p = JSON.parse(g(key, '')); if (Array.isArray(p) && p.length) return p as T[]; } catch(_) {}
    return fallback;
  };

  const stats = parseArr<StatItem>('stats', D.stats);
  const big_stats = parseArr<BigStat>('big_stats', D.big_stats);
  const services = parseArr<ServiceItem>('services', D.services);
  const about_snippets = parseArr<{icon:string;title:string;desc:string}>('about_snippets', D.about_snippets);
  const about_stats = parseArr<AboutStat>('about_stats', D.about_stats);
  const values = parseArr<Value>('values', D.values);
  const features = parseArr<Feature>('features', D.features);
  const certifications = parseArr<Certification>('certifications', D.certifications);

  return {
    ...D,
    site, hero, about_page, contact_page,
    products_page, applications_page, home_sections,
    stats, big_stats, services, about_snippets, about_stats, values, features, certifications,
    home_products, product_categories, home_applications,
    testimonials, applications, milestones, faqs,
    loaded: true,
  };
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(D);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('data')
          .eq('id', 1)
          .maybeSingle();
        if (!cancelled && !error && data && data.data && typeof data.data === 'object' && Object.keys(data.data).length > 0) {
          setContent(applyApi(data.data as Record<string, unknown>));
        }
      } catch {
        // fall back to defaults
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const save = useCallback(async (c: SiteContent) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ id: 1, data: c as unknown as Record<string, unknown> }, { onConflict: 'id' });
      if (error) throw error;
      setContent(c);
    } finally {
      setSaving(false);
    }
  }, []);

  return (
    <Ctx.Provider value={content}>
      <ApiCtx.Provider value={{ save, loading, saving }}>{children}</ApiCtx.Provider>
    </Ctx.Provider>
  );
}

export function useContent() { return useContext(Ctx); }
export function useContentApi() { return useContext(ApiCtx); }
