<?php
require_once __DIR__ . '/core.php';
cors();
check_token();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'POST only'], 405);
if (empty($_FILES['file'])) json_out(['error' => 'No file uploaded'], 400);

$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK) json_out(['error' => 'Upload error: ' . $file['error']], 400);
if ($file['size'] > 8 * 1024 * 1024) json_out(['error' => 'Max 8 MB'], 400);
if ($file['size'] === 0) json_out(['error' => 'Empty file'], 400);

$mime  = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$exts  = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
if (!isset($exts[$mime])) json_out(['error' => 'Only JPEG, PNG, WebP, GIF allowed'], 400);

// Basic check: reject files containing PHP tags
$head = file_get_contents($file['tmp_name'], false, null, 0, 512);
if (preg_match('/<\?(?:php)?/i', $head)) json_out(['error' => 'Invalid file'], 400);

if (!is_dir(UPLOAD_DIR) && !mkdir(UPLOAD_DIR, 0755, true))
    json_out(['error' => 'Cannot create uploads directory'], 500);
if (!is_writable(UPLOAD_DIR))
    json_out(['error' => 'uploads/ directory not writable — set permissions to 755 via cPanel'], 500);

$fname = bin2hex(random_bytes(16)) . '.' . $exts[$mime];
if (!move_uploaded_file($file['tmp_name'], UPLOAD_DIR . $fname)) json_out(['error' => 'Save failed'], 500);

$proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
json_out(['url' => $proto . '://' . $_SERVER['HTTP_HOST'] . UPLOAD_BASE . $fname]);
