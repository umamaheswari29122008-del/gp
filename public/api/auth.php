<?php
require_once __DIR__ . '/core.php';
cors();

$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($action === 'status') {
    json_out(['needs_setup' => (int)$db->query("SELECT COUNT(*) FROM admins")->fetchColumn() === 0]);
}

if ($action === 'setup' && $method === 'POST') {
    if ((int)$db->query("SELECT COUNT(*) FROM admins")->fetchColumn() > 0)
        json_out(['error' => 'Admin already exists — please login instead.'], 403);
    $b = body();
    $username = trim($b['username'] ?? '');
    $password = $b['password'] ?? '';
    if (strlen($username) < 3 || !preg_match('/^[a-zA-Z0-9_]+$/', $username))
        json_out(['error' => 'Username must be 3+ chars, letters/numbers/underscore only'], 400);
    if (strlen($password) < 8)
        json_out(['error' => 'Password must be at least 8 characters'], 400);
    $db->prepare("INSERT INTO admins (username,password_hash) VALUES (?,?)")
        ->execute([$username, password_hash($password, PASSWORD_BCRYPT, ['cost'=>12])]);
    json_out(['token' => make_token((int)$db->lastInsertId()), 'username' => $username]);
}

if ($action === 'login' && $method === 'POST') {
    $b = body();
    $username = trim($b['username'] ?? '');
    $password = $b['password'] ?? '';
    $st = $db->prepare("SELECT * FROM admins WHERE username = ?");
    $st->execute([$username]);
    $admin = $st->fetch();
    if ($admin && $admin['locked_until'] && strtotime($admin['locked_until']) > time()) {
        $mins = ceil((strtotime($admin['locked_until']) - time()) / 60);
        json_out(['error' => "Too many failed attempts. Try again in {$mins} minute(s)."], 429);
    }
    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        if ($admin) {
            $attempts = (int)$admin['failed_attempts'] + 1;
            $lockSql   = $attempts >= 5 ? "datetime('now','+15 minutes')" : 'NULL';
            $db->prepare("UPDATE admins SET failed_attempts=?, locked_until={$lockSql} WHERE id=?")
               ->execute([$attempts, $admin['id']]);
        }
        usleep(random_int(100000, 300000));
        json_out(['error' => 'Wrong username or password'], 401);
    }
    $db->prepare("UPDATE admins SET failed_attempts=0, locked_until=NULL WHERE id=?")->execute([$admin['id']]);
    json_out(['token' => make_token((int)$admin['id']), 'username' => $admin['username']]);
}

if ($action === 'validate') {
    $token = trim($_SERVER['HTTP_X_AUTH_TOKEN'] ?? '');
    if (!$token) json_out(['ok' => false]);
    $db->exec("DELETE FROM tokens WHERE expires_at < datetime('now')");
    $st = $db->prepare("SELECT admin_id FROM tokens WHERE token = ?");
    $st->execute([$token]);
    json_out(['ok' => (bool)$st->fetch()]);
}

if ($action === 'logout' && $method === 'POST') {
    $token = trim($_SERVER['HTTP_X_AUTH_TOKEN'] ?? '');
    if ($token) $db->prepare("DELETE FROM tokens WHERE token = ?")->execute([$token]);
    json_out(['ok' => true]);
}

if ($action === 'change_password' && $method === 'POST') {
    check_token();
    $b = body();
    $old = $b['old_password'] ?? '';
    $new = $b['new_password'] ?? '';
    if (strlen($new) < 8) json_out(['error' => 'New password must be at least 8 characters'], 400);
    $token = trim($_SERVER['HTTP_X_AUTH_TOKEN'] ?? '');
    $st = $db->prepare("SELECT a.* FROM admins a JOIN tokens t ON t.admin_id=a.id WHERE t.token=?");
    $st->execute([$token]);
    $admin = $st->fetch();
    if (!$admin || !password_verify($old, $admin['password_hash']))
        json_out(['error' => 'Current password is incorrect'], 401);
    $db->prepare("UPDATE admins SET password_hash=? WHERE id=?")
       ->execute([password_hash($new, PASSWORD_BCRYPT, ['cost'=>12]), $admin['id']]);
    json_out(['ok' => true]);
}

json_out(['error' => 'Unknown action'], 400);
