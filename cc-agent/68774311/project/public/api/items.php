<?php
require_once __DIR__ . '/core.php';
cors();
check_token();

$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$res    = $_GET['resource'] ?? '';
$id     = isset($_GET['id']) ? (int)$_GET['id'] : 0;

$COLS = [
    'home_products'     => ['name','description','icon','tag','grad','sizes','image','sort_order'],
    'testimonials'      => ['name','role','text','rating','sort_order'],
    'faqs'              => ['question','answer','sort_order'],
    'home_applications' => ['title','icon','description','sort_order'],
    'milestones'        => ['year','title','description','sort_order'],
];

if (!isset($COLS[$res])) json_out(['error' => 'Unknown resource'], 400);
$cols = $COLS[$res];

if ($method === 'GET') {
    json_out($db->query("SELECT * FROM {$res} ORDER BY sort_order,id")->fetchAll());
}
if ($method === 'POST') {
    $b = body(); $vals = [];
    foreach ($cols as $c) $vals[] = $b[$c] ?? ($c === 'sort_order' ? 0 : '');
    $ph = implode(',', array_fill(0, count($cols), '?'));
    $db->prepare("INSERT INTO {$res} (".implode(',', $cols).") VALUES ({$ph})")->execute($vals);
    $st = $db->prepare("SELECT * FROM {$res} WHERE id=?"); $st->execute([$db->lastInsertId()]); json_out($st->fetch(), 201);
}
if ($method === 'PUT') {
    if (!$id) json_out(['error' => 'Missing id'], 400);
    $b = body(); $sets = []; $vals = [];
    foreach ($cols as $c) if (array_key_exists($c, $b)) { $sets[] = "{$c}=?"; $vals[] = $b[$c]; }
    if (!$sets) json_out(['error' => 'Nothing to update'], 400);
    $vals[] = $id;
    $db->prepare("UPDATE {$res} SET ".implode(',', $sets)." WHERE id=?")->execute($vals);
    $st = $db->prepare("SELECT * FROM {$res} WHERE id=?"); $st->execute([$id]); json_out($st->fetch());
}
if ($method === 'DELETE') {
    if (!$id) json_out(['error' => 'Missing id'], 400);
    $db->prepare("DELETE FROM {$res} WHERE id=?")->execute([$id]);
    json_out(['ok' => true]);
}
json_out(['error' => 'Method not allowed'], 405);
