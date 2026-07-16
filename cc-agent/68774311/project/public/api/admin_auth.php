<?php
// Redirect all calls to the unified auth.php
$_GET['action'] = $_GET['action'] ?? (isset($_GET['action']) ? $_GET['action'] : str_replace('_status', '', $_GET['action'] ?? 'status'));
// Map old action names to new ones
$map = ['setup_status' => 'status', 'create_admin' => 'setup'];
if (isset($_GET['action']) && isset($map[$_GET['action']])) {
    $_GET['action'] = $map[$_GET['action']];
}
require_once __DIR__ . '/auth.php';
