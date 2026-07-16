<?php
// Security headers on every response
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

define('DB_PATH',    __DIR__ . '/../data/dovagel.db');
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_BASE','/uploads/');

function cors(): void {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token');
    header('Content-Type: application/json; charset=utf-8');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
}

function json_out(mixed $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function body(): array {
    $d = json_decode(file_get_contents('php://input') ?: '{}', true);
    return is_array($d) ? $d : [];
}

function get_db(): PDO {
    static $db = null;
    if ($db) return $db;
    $dir = dirname(DB_PATH);
    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        json_out(['error' => 'Cannot create data directory. Set permissions 755 on the data/ folder via cPanel.'], 500);
    }
    if (!is_writable($dir)) {
        json_out(['error' => 'data/ directory is not writable. Set permissions to 755 (or 777) via cPanel File Manager.'], 500);
    }
    try { $db = new PDO('sqlite:' . DB_PATH); }
    catch (PDOException $e) { json_out(['error' => 'DB open failed: ' . $e->getMessage()], 500); }
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $db->exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');
    try { setup_schema($db); }
    catch (PDOException $e) { json_out(['error' => 'Schema error: ' . $e->getMessage()], 500); }
    return $db;
}

function setup_schema(PDO $db): void {
    $db->exec("CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL, failed_attempts INTEGER DEFAULT 0,
        locked_until TEXT DEFAULT NULL, created_at TEXT DEFAULT (datetime('now'))
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS tokens (
        token TEXT PRIMARY KEY, admin_id INTEGER NOT NULL, expires_at TEXT NOT NULL
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT ''
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS home_products (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
        description TEXT DEFAULT '', icon TEXT DEFAULT '🧊', tag TEXT DEFAULT '',
        grad TEXT DEFAULT 'from-ice-600 to-ice-500', sizes TEXT DEFAULT '',
        image TEXT DEFAULT '', sort_order INTEGER DEFAULT 0
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS product_categories (
        id TEXT PRIMARY KEY, label TEXT NOT NULL, title TEXT NOT NULL,
        description TEXT DEFAULT '', accent_from TEXT DEFAULT '#1e7ec8',
        accent_to TEXT DEFAULT '#0db2e8', specs TEXT DEFAULT '[]', sort_order INTEGER DEFAULT 0
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS product_variants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id TEXT NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
        name TEXT NOT NULL, image TEXT DEFAULT '', sort_order INTEGER DEFAULT 0
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
        role TEXT DEFAULT '', text TEXT DEFAULT '', rating INTEGER DEFAULT 5, sort_order INTEGER DEFAULT 0
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL, answer TEXT DEFAULT '', sort_order INTEGER DEFAULT 0
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS home_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
        icon TEXT DEFAULT '🧊', description TEXT DEFAULT '', sort_order INTEGER DEFAULT 0
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
        description TEXT DEFAULT '', img TEXT DEFAULT '', tag TEXT DEFAULT '',
        details TEXT DEFAULT '[]', sort_order INTEGER DEFAULT 0
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS milestones (
        id INTEGER PRIMARY KEY AUTOINCREMENT, year TEXT NOT NULL,
        title TEXT NOT NULL, description TEXT DEFAULT '', sort_order INTEGER DEFAULT 0
    )");
    if ((int)$db->query("SELECT COUNT(*) FROM settings")->fetchColumn() === 0) seed_defaults($db);
}

function seed_defaults(PDO $db): void {
    $settings = [
        'logo_url'=>'','site_name'=>'Dove Gel Packs','tagline'=>'Superior Cooling Technology',
        'whatsapp_number'=>'https://wa.me/message/dovegelpacks',
        'whatsapp_channel'=>'https://www.whatsapp.com/channel/0029Vapq05N3AzNLpO2tkO1x',
        'email'=>'info@dovegelpacks.com','phone'=>'+1 (800) DOVE-GEL','phone_href'=>'tel:+18003683435',
        'address'=>'Made in India — Worldwide Shipping',
        'footer_tagline'=>'Superior cooling technology engineered for medical, food, pharmaceutical, and packaging applications worldwide. Made in India.',
        'facebook_url'=>'https://www.facebook.com/dove.gelpacks',
        'instagram_url'=>'https://www.instagram.com/dovegelpacks/',
        'linkedin_url'=>'https://www.linkedin.com/company/doveindustries/',
        'hero_badge_text'=>'20+ Years of Cooling Innovation • Made in India',
        'hero_headline_line1'=>'Superior','hero_headline_line2'=>'Cooling.',
        'hero_headline_line3'=>'Engineered','hero_headline_line4'=>'for Excellence.',
        'hero_subheadline'=>'DOVE Ice Gel Packs are independently lab-tested, non-toxic, and stay cold up to <strong class="text-ice-300">65% longer</strong> than regular ice.',
        'hero_btn_products_text'=>'View Products','hero_btn_whatsapp_text'=>'Buy on WhatsApp',
        'hero_cta_headline'=>'Ready to Keep Your Products Perfectly Cold?',
        'hero_cta_sub'=>'Bulk orders, custom sizes, OEM — we deliver worldwide.',
        'hero_cta_btn_whatsapp'=>'Buy on WhatsApp','hero_cta_btn_quote'=>'Get a Quote',
        'about_hero_title_line1'=>'Two Decades of','about_hero_title_line2'=>'Cold Chain','about_hero_title_line3'=>'Excellence',
        'about_hero_sub'=>'Since 2003, Dove Ice Gel Packs has been at the forefront of cooling technology — delivering durable, leak-proof solutions trusted worldwide.',
        'about_story_title'=>'A Journey of Innovation','about_values_title'=>'What Drives Us Forward',
        'about_features_title'=>'Built to the Highest Standards',
        'about_features_sub'=>'Every Dove Gel Pack undergoes rigorous quality control before leaving our facility.',
        'about_cta_headline'=>'Partner with Dove Gel Packs','about_cta_sub'=>'Join 500+ businesses worldwide who trust our cooling solutions.',
        'about_intro_title'=>"India's Trusted",'about_intro_highlight'=>'Cold Chain Partner',
        'about_intro_p1'=>'Founded over two decades ago, Dove Industries manufactures premium ice gel packs, containers, sheets, and insulated thermocol boxes — all independently lab-tested and non-toxic.',
        'about_intro_p2'=>'Our products are a proven substitute for dry ice, keeping items fresh up to 24 hours.',
        'contact_hero_title_line1'=>"Let's Talk About",'contact_hero_title_line2'=>'Staying Cold',
        'contact_hero_sub'=>"Whether you need bulk pricing, custom sizes, technical specifications, or just have a question — our team is ready to help.",
        'contact_help_items'=>json_encode(['Bulk order pricing & discounts','Custom sizes & configurations','Pharmaceutical certifications','Technical specifications','Private label & branding','International shipping logistics']),
    ];
    $st = $db->prepare("INSERT OR IGNORE INTO settings (key,value) VALUES (?,?)");
    foreach ($settings as $k => $v) $st->execute([$k, $v]);

    $db->exec("INSERT OR IGNORE INTO home_products (name,description,icon,tag,grad,sizes,sort_order) VALUES
        ('Ice Gel Packs / Pouches','50g–500g. Lab-tested, non-toxic. Stays cold 65% longer than regular ice.','🧊','Most Popular','from-ice-600 to-ice-500','50g · 100g · 150g · 200g · 250g · 400g · 500g',1),
        ('Ice Gel Container','Rigid HDPE containers. 300g–700g. Vacuum-sealed, ideal for seafood & pharma.','📦','For Export','from-cyan-600 to-teal-500','300g · 500g · 700g',2),
        ('Ice Gel Sheets','12-cell & 24-cell. Trimmable to any size. Eco-friendly & reusable.','🧱','Flexible','from-teal-600 to-cyan-500','12-Cell · 24-Cell',3),
        ('Thermocol Insulated Box','EPS insulated boxes 3L–150L. Water-resistant, vermin-proof.','🏗️','Heavy Duty','from-arctic-600 to-teal-500','3L · 5L · 7L · 10L · 15L · 20L · 36L · 55L · 120L · 150L',4)");

    $db->exec("INSERT OR IGNORE INTO product_categories (id,label,title,description,accent_from,accent_to,specs,sort_order) VALUES
        ('pouches','Pouches','ICE GEL PACKS','Durable reusable pouches 50g–500g. Lab-tested, non-toxic.','#1e7ec8','#0db2e8','[\"32\u00b0F & 10\u00b0F formulations\",\"Lab-tested & certified\",\"Non-toxic, food-safe\",\"Leak-proof & reusable\",\"Custom sizes available\"]',1),
        ('container','Container','ICE GEL CONTAINER','Rigid HDPE containers. Ideal for seafood export and pharma.','#0d9488','#06b6d4','[\"Rigid HDPE material\",\"300g, 500g, 700g\",\"Vacuum-sealed fill\",\"White colour\",\"Made in India\"]',2),
        ('sheets','Sheets','ICE GEL SHEETS','Multi-cell sheets trimmable to any size.','#0d7a6e','#14b8a6','[\"12-cell & 24-cell configs\",\"Trimmable to any size\",\"Ambient / fridge / frozen\",\"Eco-friendly & reusable\",\"Lightweight design\"]',3),
        ('thermocol','Thermocol Box','THERMOCOL INSULATED BOX','EPS boxes 3L–150L. Water-resistant, vermin-proof.','#1a4e8a','#2e7ce0','[\"3L to 150L range\",\"EPS construction\",\"Water-resistant\",\"Drain plug (RM version)\",\"Custom sizes available\"]',4)");

    $vdata=[['pouches','50 Gram',1],['pouches','100 Gram',2],['pouches','150 Gram',3],['pouches','200 Gram',4],
        ['pouches','250 Gram',5],['pouches','400 Gram',6],['pouches','500 Gram',7],
        ['container','300 Gram',1],['container','500 Gram',2],['container','700 Gram',3],
        ['sheets','12 Cell',1],['sheets','24 Cell',2],
        ['thermocol','3 Litre',1],['thermocol','5 Litre',2],['thermocol','7 Litre',3],['thermocol','10 Litre',4],
        ['thermocol','15 Litre',5],['thermocol','20 Litre',6],['thermocol','36 Litre',7],['thermocol','55 Litre',8],
        ['thermocol','120 Litre',9],['thermocol','150 Litre',10]];
    $st=$db->prepare("INSERT OR IGNORE INTO product_variants (category_id,name,sort_order) VALUES (?,?,?)");
    foreach($vdata as $v) $st->execute($v);

    $db->exec("INSERT OR IGNORE INTO testimonials (name,role,text,rating,sort_order) VALUES
        ('Rahul Mehta','Operations Head, FreshExpress Logistics','Dove Gel Packs have completely transformed our cold chain. Leak-proof, every single time. We cut product loss by over 30% since switching.',5,1),
        ('Dr. Priya Nair','Procurement Manager, Apollo Pharma','The pharmaceutical-grade packs meet all our regulatory requirements. Temperature stability is excellent — Dove delivers exactly that.',5,2),
        ('James Thornton','Founder, ChillBox UK','We switched to Dove Gel Sheets for our subscription meal kits. Customers love that they are reusable. Our reviews went up significantly.',5,3)");

    $db->exec("INSERT OR IGNORE INTO faqs (question,answer,sort_order) VALUES
        ('What is the minimum order quantity?','We welcome orders of all sizes. For bulk pricing tiers, please contact us directly.',1),
        ('Are your gel packs food safe?','Yes — all packs use FDA-compliant, non-toxic gel formulas certified food safe.',2),
        ('How quickly can gel packs be frozen?','Packs reach working temperature in under 60 minutes in a standard freezer.',3),
        ('Do you offer custom sizes and branding?','Yes. Custom sizes, colours, and private-label printing available for bulk orders.',4)");

    $db->exec("INSERT OR IGNORE INTO home_applications (title,icon,description,sort_order) VALUES
        ('Food & Seafood','🐟','Frozen goods, fresh produce, seafood, dairy',1),
        ('Pharmaceutical','💊','Vaccines, medicines, biologics, lab samples',2),
        ('Medical / Healthcare','🏥','Surgical items, blood transport, clinical use',3),
        ('Fruits & Vegetables','🥦','Post-harvest freshness, farm-to-table delivery',4),
        ('Cold Chain Logistics','🚛','Long-haul, last-mile, international shipment',5),
        ('Packaging & Retail','📦','E-commerce, subscription boxes, gifting',6)");

    $db->exec("INSERT OR IGNORE INTO applications (title,description,img,tag,details,sort_order) VALUES
        ('Medical & Healthcare','Precise temperature control for medications, blood samples, surgical instruments and recovery kits.','https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=600','Healthcare','[\"Blood sample transport\",\"Medication storage\",\"Post-surgical recovery\",\"Emergency medical kits\"]',1),
        ('Pharmaceutical Cold Chain','Maintain strict thermal conditions for vaccines, biologics and temperature-sensitive drugs.','https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=600','Pharma','[\"Vaccine transport\",\"Biologics storage\",\"Drug stability testing\",\"Clinical trial samples\"]',2),
        ('Food Preservation','Keep fresh produce, meat, dairy and perishables at safe temperatures from farm to table.','https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600','Food Safety','[\"Fresh produce\",\"Meat & seafood\",\"Dairy products\",\"Baked goods\"]',3),
        ('Packaging & Shipping','Versatile cooling inserts for any insulated box or mailer for e-commerce fulfilment.','https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg?auto=compress&cs=tinysrgb&w=600','Packaging','[\"E-commerce fulfillment\",\"Meal kit delivery\",\"Subscription boxes\",\"Direct-to-consumer\"]',4),
        ('Transport & Logistics','Lightweight and durable for long-haul delivery and last-mile cold-chain operations.','https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=600','Logistics','[\"Long-haul trucking\",\"Last-mile delivery\",\"Courier services\",\"Air freight\"]',5)");

    $db->exec("INSERT OR IGNORE INTO milestones (year,title,description,sort_order) VALUES
        ('2003','Company Founded','Dove Gel Packs established with a focus on superior cold-chain solutions.',1),
        ('2008','ISO Certification','Achieved ISO 9001 quality management certification.',2),
        ('2012','Pharmaceutical Grade','Launched FDA-compliant pharmaceutical-grade gel pack line.',3),
        ('2016','Global Expansion','Extended distribution to 40+ countries worldwide.',4),
        ('2020','Eco Reusable Line','Introduced 100% recyclable packaging and enhanced reusable gel formula.',5),
        ('2024','20 Years Strong','Celebrating two decades of innovation and cold-chain excellence.',6)");
}

function check_token(): void {
    $token = trim($_SERVER['HTTP_X_AUTH_TOKEN'] ?? '');
    if (!$token) json_out(['error' => 'Unauthorized'], 401);
    $db = get_db();
    $db->exec("DELETE FROM tokens WHERE expires_at < datetime('now')");
    $st = $db->prepare("SELECT admin_id FROM tokens WHERE token = ?");
    $st->execute([$token]);
    if (!$st->fetch()) json_out(['error' => 'Session expired — please login again'], 401);
}

function make_token(int $admin_id): string {
    $token = bin2hex(random_bytes(32));
    get_db()->prepare("INSERT INTO tokens (token,admin_id,expires_at) VALUES (?,?,datetime('now','+7 days'))")
        ->execute([$token, $admin_id]);
    return $token;
}
