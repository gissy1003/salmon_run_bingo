<?php
// 何度 include されても良いように define() + defined() で定義する
$settings = [
    'TITLE'       => 'Splatoon3 ブキビンゴ',
    'TITLE_EN'    => 'Splatoon3 Weapon Bingo',
    'TITLE_SHORT' => 'ブキビンゴ',
    'ID'          => 'buki-bingo',
    'DESCRIPTION' => 'A tool to play Bingo with Splatoon 3 weapons.',
    'URL'         => 'https://gissy1003.github.io/salmon_run_bingo/',
    'ORIGINAL_AUTHOR' => 'takenocotoon', // 元作者 (フッターのクレジット表記)
    'THEME_COLOR' => '#FE6345',
    'BASE_FOLDER' => './',
    'VERSION'     => '2.0.5',
    'INDENT'      => '    ',
];
foreach ($settings as $name => $value) {
    if (!defined($name)) define($name, $value);
}

$date = date("ymdHis");
if (isset($is_prod)) {
    $cssPaths = ['./css/style.min.css', './remixicon/remixicon.css'];
    $modulePaths = ['./js/main.min.js'];
    $scriptPaths = [];
    $version = VERSION;
} else {
    $cssPaths = ['./css/style.dev.css', './remixicon/remixicon.css'];
    $modulePaths = ['./js/main.dev.js'];
    $scriptPaths = [];
    $version = VERSION . 'dev' . $date;
}
