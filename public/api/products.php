<?php
require_once __DIR__ . '/core.php';
cors();
check_token();

$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') json_out(['error' => 'POST only'], 405);
$b = body();
$a = $b['action'] ?? '';

if ($a === 'save_category') {
    $id    = trim($b['id'] ?? ''); if (!$id) json_out(['error' => 'id required'], 400);
    $specs = json_encode(array_values(array_filter(array_map('trim', $b['specs'] ?? []))));
    $st = $db->prepare("SELECT id FROM product_categories WHERE id=?"); $st->execute([$id]);
    if ($st->fetch())
        $db->prepare("UPDATE product_categories SET label=?,title=?,description=?,accent_from=?,accent_to=?,specs=?,sort_order=? WHERE id=?")
           ->execute([$b['label']??'',$b['title']??'',$b['description']??'',$b['accent_from']??'#1e7ec8',$b['accent_to']??'#0db2e8',$specs,(int)($b['sort_order']??0),$id]);
    else
        $db->prepare("INSERT INTO product_categories (id,label,title,description,accent_from,accent_to,specs,sort_order) VALUES (?,?,?,?,?,?,?,?)")
           ->execute([$id,$b['label']??'',$b['title']??'',$b['description']??'',$b['accent_from']??'#1e7ec8',$b['accent_to']??'#0db2e8',$specs,(int)($b['sort_order']??0)]);
    json_out(['ok' => true]);
}
if ($a === 'delete_category') {
    $id = $b['id'] ?? '';
    $db->prepare("DELETE FROM product_variants WHERE category_id=?")->execute([$id]);
    $db->prepare("DELETE FROM product_categories WHERE id=?")->execute([$id]);
    json_out(['ok' => true]);
}
if ($a === 'save_variant') {
    $vid = (int)($b['id']??0); $cid = $b['category_id']??'';
    $name = $b['name']??''; $img = $b['image']??''; $ord = (int)($b['sort_order']??0);
    if ($vid)
        $db->prepare("UPDATE product_variants SET name=?,image=?,sort_order=? WHERE id=?")->execute([$name,$img,$ord,$vid]);
    else {
        $db->prepare("INSERT INTO product_variants (category_id,name,image,sort_order) VALUES (?,?,?,?)")->execute([$cid,$name,$img,$ord]);
        $vid = (int)$db->lastInsertId();
    }
    $st = $db->prepare("SELECT * FROM product_variants WHERE id=?"); $st->execute([$vid]); json_out($st->fetch());
}
if ($a === 'delete_variant') {
    $db->prepare("DELETE FROM product_variants WHERE id=?")->execute([(int)($b['id']??0)]);
    json_out(['ok' => true]);
}
if ($a === 'save_application') {
    $id = (int)($b['id']??0);
    $details = json_encode(array_values(array_filter(array_map('trim', $b['details']??[]))));
    $ord = (int)($b['sort_order']??0);
    if ($id)
        $db->prepare("UPDATE applications SET title=?,description=?,img=?,tag=?,details=?,sort_order=? WHERE id=?")
           ->execute([$b['title']??'',$b['description']??'',$b['img']??'',$b['tag']??'',$details,$ord,$id]);
    else {
        $db->prepare("INSERT INTO applications (title,description,img,tag,details,sort_order) VALUES (?,?,?,?,?,?)")
           ->execute([$b['title']??'',$b['description']??'',$b['img']??'',$b['tag']??'',$details,$ord]);
        $id = (int)$db->lastInsertId();
    }
    $st = $db->prepare("SELECT * FROM applications WHERE id=?"); $st->execute([$id]);
    $r = $st->fetch(); $r['details'] = json_decode($r['details'],true); json_out($r);
}
if ($a === 'delete_application') {
    $db->prepare("DELETE FROM applications WHERE id=?")->execute([(int)($b['id']??0)]);
    json_out(['ok' => true]);
}
json_out(['error' => 'Unknown action'], 400);
