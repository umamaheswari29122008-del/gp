<?php
define('DB_PATH', __DIR__ . '/../data/dovagel.db');

function get_db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO('sqlite:' . DB_PATH);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec('PRAGMA journal_mode=WAL');
        $pdo->exec('PRAGMA foreign_keys=ON');
        migrate($pdo);
    }
    return $pdo;
}

function migrate(PDO $pdo): void {
    $pdo->exec("CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL DEFAULT ''
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT NOT NULL,
        label TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT 'Award',
        color TEXT NOT NULL DEFAULT 'text-ice-400',
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS big_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT NOT NULL,
        label TEXT NOT NULL,
        sub TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon TEXT NOT NULL DEFAULT 'Shield',
        text TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS about_snippets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        icon TEXT NOT NULL DEFAULT 'Shield',
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS about_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT NOT NULL,
        label TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT 'Award',
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS milestones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS values_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon TEXT NOT NULL DEFAULT 'Shield',
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        color TEXT NOT NULL DEFAULT 'from-ice-500 to-ice-400',
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS certifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        text TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5,
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS home_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT '🧊',
        description TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        img TEXT NOT NULL DEFAULT '',
        tag TEXT NOT NULL DEFAULT '',
        details TEXT NOT NULL DEFAULT '[]',
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS home_products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        icon TEXT NOT NULL DEFAULT '🧊',
        tag TEXT NOT NULL DEFAULT '',
        grad TEXT NOT NULL DEFAULT 'from-ice-600 to-ice-500',
        sizes TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS product_categories (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        accent_from TEXT NOT NULL DEFAULT '#1e7ec8',
        accent_to TEXT NOT NULL DEFAULT '#0db2e8',
        specs TEXT NOT NULL DEFAULT '[]',
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS product_variants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id TEXT NOT NULL,
        name TEXT NOT NULL,
        image TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        run_at TEXT NOT NULL DEFAULT (datetime('now'))
    )");

    seed_if_empty($pdo);
}

function seed_if_empty(PDO $pdo): void {
    $count = $pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
    if ($count > 0) return;

    // Settings
    $defaults = [
        'logo_url' => '',
        'site_name' => 'Dove Gel Packs',
        'tagline' => 'Superior Cooling Technology',
        'whatsapp_number' => 'https://wa.me/message/dovegelpacks',
        'whatsapp_channel' => 'https://www.whatsapp.com/channel/0029Vapq05N3AzNLpO2tkO1x',
        'email' => 'info@dovegelpacks.com',
        'phone' => '+1 (800) DOVE-GEL',
        'phone_href' => 'tel:+18003683435',
        'address' => 'Made in India — Worldwide Shipping',
        'footer_tagline' => 'Superior cooling technology engineered for medical, food, pharmaceutical, and packaging applications worldwide. Made in India.',
        'facebook_url' => 'https://www.facebook.com/dove.gelpacks',
        'instagram_url' => 'https://www.instagram.com/dovegelpacks/',
        'linkedin_url' => 'https://www.linkedin.com/company/doveindustries/',
        // Hero
        'hero_badge_text' => '20+ Years of Cooling Innovation • Made in India',
        'hero_headline_line1' => 'Superior',
        'hero_headline_line2' => 'Cooling.',
        'hero_headline_line3' => 'Engineered',
        'hero_headline_line4' => 'for Excellence.',
        'hero_subheadline' => 'DOVE Ice Gel Packs are independently lab-tested, non-toxic, and stay cold up to <strong class="text-ice-300">65% longer</strong> than regular ice — trusted by medical, food, and pharmaceutical professionals worldwide.',
        'hero_btn_products_text' => 'View Products',
        'hero_btn_whatsapp_text' => 'Buy on WhatsApp',
        'hero_cta_headline' => 'Ready to Keep Your Products Perfectly Cold?',
        'hero_cta_sub' => 'Bulk orders, custom sizes, OEM — we deliver worldwide.',
        'hero_cta_btn_whatsapp' => 'Buy on WhatsApp',
        'hero_cta_btn_quote' => 'Get a Quote',
        // About page
        'about_hero_title_line1' => 'Two Decades of',
        'about_hero_title_line2' => 'Cold Chain',
        'about_hero_title_line3' => 'Excellence',
        'about_hero_sub' => 'Since 2003, Dove Ice Gel Packs has been at the forefront of cooling technology — delivering durable, leak-proof, and lightweight solutions trusted by medical professionals, food distributors, and logistics companies worldwide.',
        'about_story_title' => 'A Journey of Innovation',
        'about_values_title' => 'What Drives Us Forward',
        'about_features_title' => 'Built to the Highest Standards',
        'about_features_sub' => 'Every Dove Gel Pack undergoes rigorous quality control before leaving our facility.',
        'about_cta_headline' => 'Partner with Dove Gel Packs',
        'about_cta_sub' => 'Join 500+ businesses worldwide who trust our cooling solutions.',
        'about_intro_title' => "India's Trusted",
        'about_intro_highlight' => 'Cold Chain Partner',
        'about_intro_p1' => 'Founded over two decades ago, Dove Industries manufactures premium ice gel packs, containers, sheets, and insulated thermocol boxes — all independently lab-tested and non-toxic.',
        'about_intro_p2' => 'Our products are a proven substitute for dry ice, keeping items fresh up to 24 hours and performing in ambient, refrigerated, or frozen environments. We serve medical, pharmaceutical, food, and logistics industries across 40+ countries.',
        // Contact page
        'contact_hero_title_line1' => "Let's Talk About",
        'contact_hero_title_line2' => 'Staying Cold',
        'contact_hero_sub' => "Whether you need bulk pricing, custom sizes, technical specifications, or just have a question — our team is ready to help.",
        'contact_faq_title' => 'Frequently Asked Questions',
        'contact_help_items' => json_encode(['Bulk order pricing & discounts', 'Custom sizes & configurations', 'Pharmaceutical certifications', 'Technical specifications', 'Private label & branding', 'International shipping logistics']),
    ];
    $stmt = $pdo->prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
    foreach ($defaults as $k => $v) $stmt->execute([$k, $v]);

    // Stats
    $stats = [
        [1, '24h', 'Max Cooling', 'Timer', 'text-ice-400'],
        [2, '100%', 'Leak-Proof', 'Droplets', 'text-cyan-400'],
        [3, '∞', 'Reusable', 'RotateCcw', 'text-teal-400'],
        [4, '20+', 'Years Trust', 'Award', 'text-arctic-400'],
    ];
    $stmt = $pdo->prepare("INSERT INTO stats (sort_order, value, label, icon, color) VALUES (?, ?, ?, ?, ?)");
    foreach ($stats as $r) $stmt->execute($r);

    // Big stats
    $big = [[1,'20+','Years in Cold Chain','Since 2003'],[2,'40+','Countries Served','Globally trusted'],[3,'500+','Happy Clients','B2B & B2C'],[4,'65%','Longer Cooling','vs regular ice']];
    $stmt = $pdo->prepare("INSERT INTO big_stats (sort_order, value, label, sub) VALUES (?, ?, ?, ?)");
    foreach ($big as $r) $stmt->execute($r);

    // Services
    $services = [[1,'Shield','Leak-Proof Seal'],[2,'Zap','Quick Freeze'],[3,'Thermometer','−18°C Rated'],[4,'RotateCcw','Reusable']];
    $stmt = $pdo->prepare("INSERT INTO services (sort_order, icon, text) VALUES (?, ?, ?)");
    foreach ($services as $r) $stmt->execute($r);

    // About snippets
    $snips = [[1,'Non-Toxic Formula','Safe for food contact, FDA compliant gel','Shield'],[2,'Lab Tested','Independently certified for performance','Award'],[3,'Quick Freeze','Ready to use in under 60 minutes','Zap'],[4,'Eco-Friendly','Reusable, sustainable, zero waste','RotateCcw']];
    $stmt = $pdo->prepare("INSERT INTO about_snippets (sort_order, title, description, icon) VALUES (?, ?, ?, ?)");
    foreach ($snips as $r) $stmt->execute($r);

    // About stats
    $astats = [[1,'20+','Years of Innovation','Award'],[2,'40+','Countries Served','Globe'],[3,'500+','Global Clients','Users'],[4,'100%','Reusable Products','RotateCcw']];
    $stmt = $pdo->prepare("INSERT INTO about_stats (sort_order, value, label, icon) VALUES (?, ?, ?, ?)");
    foreach ($astats as $r) $stmt->execute($r);

    // Milestones
    $ms = [
        [1,'2003','Company Founded','Dove Gel Packs established with a focus on superior cold-chain solutions.'],
        [2,'2008','ISO Certification','Achieved ISO 9001 quality management certification for manufacturing.'],
        [3,'2012','Pharmaceutical Grade','Launched FDA-compliant pharmaceutical-grade gel pack line.'],
        [4,'2016','Global Expansion','Extended distribution to 40+ countries across Asia, Europe, and Americas.'],
        [5,'2020','Eco Reusable Line','Introduced 100% recyclable packaging and enhanced reusable gel formula.'],
        [6,'2024','20 Years Strong','Celebrating two decades of innovation, trust, and cold-chain excellence.'],
    ];
    $stmt = $pdo->prepare("INSERT INTO milestones (sort_order, year, title, description) VALUES (?, ?, ?, ?)");
    foreach ($ms as $r) $stmt->execute($r);

    // Values
    $vals = [
        [1,'Shield','Reliability','Every pack tested for consistent performance across hundreds of freeze cycles.','from-ice-500 to-ice-400'],
        [2,'Zap','Performance','Engineered for maximum cooling efficiency with quick-freeze capability.','from-cyan-500 to-ice-500'],
        [3,'Leaf','Sustainability','Reusable, eco-conscious design that reduces single-use waste dramatically.','from-teal-500 to-cyan-400'],
        [4,'Globe','Global Reach','Serving clients in 40+ countries with reliable worldwide shipping.','from-arctic-500 to-teal-400'],
    ];
    $stmt = $pdo->prepare("INSERT INTO values_table (sort_order, icon, title, description, color) VALUES (?, ?, ?, ?, ?)");
    foreach ($vals as $r) $stmt->execute($r);

    // Features
    $feats = ['Thermoplastic polymer construction for maximum durability','Works with all insulated shipping boxes and coolers','Non-toxic, food-safe gel formula — FDA compliant','Lightweight design reduces shipping costs significantly','Available in multiple sizes from 200g to 2000g+','Custom sizes and branding available for bulk orders','Maintains consistent temperature throughout full cooling cycle','Quick freezing — ready to use in under 60 minutes'];
    $stmt = $pdo->prepare("INSERT INTO features (text, sort_order) VALUES (?, ?)");
    foreach ($feats as $i => $f) $stmt->execute([$f, $i+1]);

    // Certifications
    $certs = ['FDA Compliant','ISO 9001 Certified','Food Safe Gel','Non-Toxic Formula'];
    $stmt = $pdo->prepare("INSERT INTO certifications (name, sort_order) VALUES (?, ?)");
    foreach ($certs as $i => $c) $stmt->execute([$c, $i+1]);

    // Testimonials
    $tms = [
        [1,'Rahul Mehta','Operations Head, FreshExpress Logistics',"Dove Gel Packs have completely transformed our cold chain. The 400g packs keep our seafood deliveries at the right temperature for 10+ hours. Leak-proof, every single time.",5],
        [2,'Dr. Priya Nair','Procurement Manager, Apollo Pharma',"The pharmaceutical-grade packs meet all our regulatory requirements. Consistent temperature maintenance is crucial for our vaccine shipments — Dove delivers exactly that.",5],
        [3,'James Thornton','Founder, ChillBox UK',"We switched to Dove Gel Sheets for our subscription meal kits. The 24-cell sheets are easy to trim, fit every box size, and customers love that they're reusable.",5],
        [4,'Aditya Kumar','Supply Chain Director, BigBasket',"The ice gel containers are a game changer for our long-distance routes. They maintain shape through multiple freeze cycles and significantly reduce our dry ice costs.",5],
    ];
    $stmt = $pdo->prepare("INSERT INTO testimonials (sort_order, name, role, text, rating) VALUES (?, ?, ?, ?, ?)");
    foreach ($tms as $r) $stmt->execute($r);

    // Home applications
    $apps = [
        [1,'Food & Seafood','🐟','Frozen goods, fresh produce, seafood, dairy'],
        [2,'Pharmaceutical','💊','Vaccines, medicines, biologics, lab samples'],
        [3,'Medical / Healthcare','🏥','Surgical items, blood transport, clinical use'],
        [4,'Fruits & Vegetables','🥦','Post-harvest freshness, farm-to-table delivery'],
        [5,'Cold Chain Logistics','🚛','Long-haul, last-mile, international shipment'],
        [6,'Packaging & Retail','📦','E-commerce, subscription boxes, gifting'],
    ];
    $stmt = $pdo->prepare("INSERT INTO home_applications (sort_order, title, icon, description) VALUES (?, ?, ?, ?)");
    foreach ($apps as $r) $stmt->execute($r);

    // Applications
    $fullApps = [
        [1,'Medical & Healthcare','Precise temperature control for medications, blood samples, surgical instruments, and medical supplies requiring cold-chain compliance and reliability.','https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=600','Healthcare',json_encode(['Blood sample transport','Medication storage','Post-surgical recovery','Emergency medical kits'])],
        [2,'Pharmaceutical Cold Chain','Maintain strict thermal conditions for vaccines, biologics, and temperature-sensitive drugs during storage, transport, and last-mile delivery.','https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=600','Pharma',json_encode(['Vaccine transport','Biologics storage','Drug stability testing','Clinical trial samples'])],
        [3,'Food Preservation','Keep fresh produce, meat, dairy, and perishables at safe temperatures during packing, transport, and delivery to end consumers.','https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600','Food Safety',json_encode(['Fresh produce','Meat & seafood','Dairy products','Baked goods'])],
        [4,'Injection & Biotech','Ideal for storing and transporting injectable preparations, biological specimens, and research samples requiring strict cold chain integrity.','https://images.pexels.com/photos/3912364/pexels-photo-3912364.jpeg?auto=compress&cs=tinysrgb&w=600','Biotech',json_encode(['Injectable drugs','Cell cultures','DNA/RNA samples','Enzyme solutions'])],
        [5,'Packaging & Shipping','Versatile cooling inserts that fit any insulated box or mailer — providing reliable cold-chain performance for every shipment size.','https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg?auto=compress&cs=tinysrgb&w=600','Packaging',json_encode(['E-commerce fulfillment','Meal kit delivery','Subscription boxes','Direct-to-consumer'])],
        [6,'Transport & Logistics','Lightweight and durable for long-haul delivery vehicles, courier networks, and freight services maintaining cold-chain integrity across distances.','https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=600','Logistics',json_encode(['Long-haul trucking','Last-mile delivery','Courier services','Air freight'])],
    ];
    $stmt = $pdo->prepare("INSERT INTO applications (sort_order, title, description, img, tag, details) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($fullApps as $r) $stmt->execute($r);

    // Home products
    $hp = [
        [1,'Ice Gel Packs / Pouches','50g–500g. Available in 32°F & 10°F formulations. Lab-tested, non-toxic substitute for dry ice. Stays cold 65% longer than regular ice. Keeps items fresh up to 24 hours.','🧊','Most Popular','from-ice-600 to-ice-500','50g · 100g · 150g · 200g · 250g · 400g · 500g'],
        [2,'Ice Gel Container','Rigid HDPE containers. 300g–700g. Vacuum-sealed for precise fill, maintains shape through freezing, thawing and long-distance transit. Ideal for seafood & pharma.','📦','For Export','from-cyan-600 to-teal-500','300g · 500g · 700g'],
        [3,'Ice Gel Sheets','12-cell & 24-cell multi-cell sheets. Trimmable to fit small parcels or large pallets. Works in ambient, refrigerated, or frozen conditions. Eco-friendly & reusable.','🧱','Flexible','from-teal-600 to-cyan-500','12-Cell · 24-Cell'],
        [4,'Thermocol Insulated Box','EPS insulated boxes from 3L to 150L. Water-resistant, vermin-proof, fungi & bacteria resistant. Rotationally moulded versions with drain plugs. Custom sizes available.','🏗️','Heavy Duty','from-arctic-600 to-teal-500','3L · 5L · 7L · 10L · 15L · 20L · 36L · 55L · 120L · 150L'],
    ];
    $stmt = $pdo->prepare("INSERT INTO home_products (sort_order, name, description, icon, tag, grad, sizes) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($hp as $r) $stmt->execute($r);

    // Product categories + variants
    $cats = [
        ['pouches','Pouches','ICE GEL PACKS','Durable, reusable ice gel pack pouches available in multiple sizes from 50g to 500g, ideal for seafood, frozen food, pharmaceuticals and more. Independently lab-tested, non-toxic substitute for dry ice — stays cold up to 65% longer than regular ice.','#1e7ec8','#0db2e8',json_encode(['32°F & 10°F formulations','Lab-tested & certified','Non-toxic, food-safe','Leak-proof & reusable','Custom sizes available']),1,['50 Gram','100 Gram','150 Gram','200 Gram','250 Gram','400 Gram','500 Gram']],
        ['container','Container','ICE GEL CONTAINER','Rigid HDPE ice gel containers with vacuum-sealed, precise fill for consistent weight. Maintains shape through freezing, thawing and transit. Ideal for seafood export, clinical and pharmaceutical cold chains, long-distance and international shipments.','#0d9488','#06b6d4',json_encode(['Rigid HDPE material','300g, 500g, 700g','Vacuum-sealed fill','White colour','Made in India']),2,['300 Gram','500 Gram','700 Gram']],
        ['sheets','Sheets','ICE GEL SHEETS','Multi-cell flexible ice gel sheets that can be trimmed to fit small parcels or large pallets. Works in ambient, refrigerated, or frozen conditions. Eco-friendly, non-toxic and fully reusable — perfect for e-commerce, meal kits and pharmaceutical packaging.','#0d7a6e','#14b8a6',json_encode(['12-cell & 24-cell configs','Trimmable to any size','Ambient / fridge / frozen','Eco-friendly & reusable','Lightweight design']),3,['12 Cell','24 Cell']],
        ['thermocol','Thermocol Box','THERMOCOL INSULATED BOX','High-performance EPS (expanded polystyrene) insulated boxes available from 3 to 150 litres. Fully water-resistant, vermin-proof, and resistant to fungi and bacteria. Rotationally moulded versions include drain plugs. Custom sizes available.','#1a4e8a','#2e7ce0',json_encode(['3L to 150L range','EPS construction','Water-resistant','Drain plug (RM version)','Custom sizes available']),4,['3 Litre','5 Litre','7 Litre','10 Litre','15 Litre','20 Litre','36 Litre','55 Litre','120 Litre','150 Litre']],
    ];
    $catStmt = $pdo->prepare("INSERT INTO product_categories (id, label, title, description, accent_from, accent_to, specs, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $varStmt = $pdo->prepare("INSERT INTO product_variants (category_id, name, sort_order) VALUES (?, ?, ?)");
    foreach ($cats as $c) {
        $variants = array_pop($c);
        $catStmt->execute($c);
        foreach ($variants as $j => $vname) $varStmt->execute([$c[0], $vname, $j+1]);
    }

    // FAQs
    $faqs = [
        [1,'What is the minimum order quantity?','We welcome orders of all sizes. For bulk pricing, please contact us with your volume requirements.'],
        [2,'Are your gel packs food safe?','Yes — all our packs use FDA-compliant, non-toxic gel formulas that are certified food safe and suitable for direct food contact packaging.'],
        [3,'How quickly can gel packs be frozen?','Our packs are engineered for quick freezing, reaching working temperature in under 60 minutes in a standard freezer.'],
        [4,'Do you offer custom sizes and branding?','Absolutely. We offer custom sizes, weights, and private-label printing for bulk orders. Contact us for details.'],
    ];
    $stmt = $pdo->prepare("INSERT INTO faqs (sort_order, question, answer) VALUES (?, ?, ?)");
    foreach ($faqs as $r) $stmt->execute($r);
}
