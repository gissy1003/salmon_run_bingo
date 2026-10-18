#!/usr/bin/php
<?php
// template/ を本番用の静的サイトとして docs/ に書き出す
//   *.php            → PHP を実行した結果を拡張子なしで保存 (index.html.php → index.html)
//   それ以外          → そのままコピー
//   開発専用ファイル  → 除外 (下記 isExcluded 参照)

$target_dir = './template';
if (isset($argv) and count($argv) > 1) {
    $target_dir = rtrim($argv[1], '/');
}
$output_dir = './docs';

echo "target:" . $target_dir . "  output:" . $output_dir . "\n";
echo "==========" . "\n";

makeDir($output_dir);

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($target_dir, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

foreach ($iterator as $fileinfo) {
    $file = str_replace('\\', '/', $fileinfo->getPathname());
    $relative = substr($file, strlen($target_dir));
    $output_file = $output_dir . $relative;

    if (isExcluded($relative, $fileinfo->isDir())) {
        continue;
    }

    if ($fileinfo->isDir()) {
        makeDir($output_file);
    } else if ($fileinfo->getExtension() == 'php') {
        convertHtml($file, $output_file);
    } else {
        echo "copy:    " . $relative . "\n";
        copy($file, $output_file);
    }
}


function isExcluded($relative, $is_dir) {
    $excluded_parts = ['/parts/', '/src/', '/.create/', '/_'];
    foreach ($excluded_parts as $part) {
        if (strpos($relative . ($is_dir ? '/' : ''), $part) !== false) return true;
    }
    $excluded_files = ['/index.php', '/settings.php'];
    if (in_array($relative, $excluded_files, true)) return true;

    $excluded_suffixes = ['.dev.js', '.dev.css', '.map', '.scss'];
    foreach ($excluded_suffixes as $suffix) {
        if (str_ends_with($relative, $suffix)) return true;
    }
    return false;
}


function convertHtml($target, $output_file) {
    $output_file = preg_replace('/\.php\z/', '', $output_file);
    echo "convert: " . $target . " -> " . $output_file . "\n";

    ob_start();
    $is_prod = true;
    include($target);
    $contents = ob_get_clean();
    file_put_contents($output_file, preg_replace('/\A\n/', '', $contents));
}


function makeDir($dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
        echo "mkdir:   " . $dir . "\n";
    }
}
