<?php
require_once __DIR__ . '/core.php';
cors();

$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $srows = $db->query("SELECT key,value FROM settings")->fetchAll();
    $settings = [];
    foreach ($srows as $r) $settings[$r['key']] = $r['value'];

    $hp   = $db->query("SELECT * FROM home_products ORDER BY sort_order,id")->fetchAll();
    $cats = $db->query("SELECT * FROM product_categories ORDER BY sort_order")->fetchAll();
    $vars = $db->query("SELECT * FROM product_variants ORDER BY sort_order")->fetchAll();
    foreach ($cats as &$cat) {
        $cat['specs']    = json_decode($cat['specs'] ?? '[]', true) ?: [];
        $cat['variants'] = array_values(array_filter($vars, fn($v) => $v['category_id'] === $cat['id']));
    } unset($cat);

    $tests = $db->query("SELECT * FROM testimonials ORDER BY sort_order,id")->fetchAll();
    $faqs  = $db->query("SELECT * FROM faqs ORDER BY sort_order,id")->fetchAll();
    $happs = $db->query("SELECT * FROM home_applications ORDER BY sort_order,id")->fetchAll();
    $miles = $db->query("SELECT * FROM milestones ORDER BY sort_order,id")->fetchAll();
    $apps  = $db->query("SELECT * FROM applications ORDER BY sort_order,id")->fetchAll();
    foreach ($apps as &$a) $a['details'] = json_decode($a['details'] ?? '[]', true) ?: [];
    unset($a);

    json_out([
        'settings'           => $settings,
        'home_products'      => $hp,
        'product_categories' => $cats,
        'testimonials'       => $tests,
        'faqs'               => $faqs,
        'home_applications'  => $happs,
        'applications'       => $apps,
        'milestones'         => $miles,
    ]);
}

if ($method === 'POST') {
    check_token();
    $b = body();
    $allowed = [
        'logo_url','site_name','tagline','whatsapp_number','whatsapp_channel',
        'email','phone','phone_href','address','footer_tagline',
        'facebook_url','instagram_url','linkedin_url',
        'hero_badge_text','hero_headline_line1','hero_headline_line2','hero_headline_line3','hero_headline_line4',
        'hero_subheadline','hero_btn_products_text','hero_btn_whatsapp_text',
        'hero_cta_headline','hero_cta_sub','hero_cta_btn_whatsapp','hero_cta_btn_quote',
        'about_hero_title_line1','about_hero_title_line2','about_hero_title_line3','about_hero_sub',
        'about_story_title','about_values_title','about_features_title','about_features_sub',
        'about_cta_headline','about_cta_sub','about_intro_title','about_intro_highlight',
        'about_intro_p1','about_intro_p2',
        'contact_hero_title_line1','contact_hero_title_line2','contact_hero_sub','contact_help_items',
    ];
    $st = $db->prepare("INSERT INTO settings (key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value");
    foreach ($b as $k => $v) {
        if (!in_array($k, $allowed, true)) continue;
        $val = is_array($v) ? json_encode($v, JSON_UNESCAPED_UNICODE) : substr((string)$v, 0, 65535);
        $st->execute([$k, $val]);
    }
    json_out(['ok' => true]);
}

json_out(['error' => 'Method not allowed'], 405);
