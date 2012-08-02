<?php

$code_base = array(
    // CSS
    'colors_css' => array(
        'name' => 'colors_css',
        'type' => 'css',
        'fullpath' => '../css/_colors.scss',
    ),
    'country_flag_css' => array(
        'name' => 'colors_css',
        'type' => 'css',
        'fullpath' => '../css/country_flag.css',
    ),
    'SortableTable_css' => array(
        'name' => 'SortableTable_css',
        'type' => 'css',
        'fullpath' => '../css/widgets/SortableTable.css',
        'requires' => array('colors_css')
    ),
    'Selector_css' => array(
        'name' => 'SortableTable_css',
        'type' => 'css',
        'fullpath' => '../css/widgets/Selector.css',
        'requires' => array('colors_css')
    ),
    'SelectBox_css' => array(
        'name' => 'SelectBox_css',
        'type' => 'css',
        'fullpath' => '../css/widgets/SelectBox.css',
        'requires' => array('colors_css')
    ),

    // Mootools
    'mootools_core_1_4_5' => array(
        'name' => 'mootools_core_1_4_5',
        'type' => 'js',
        'fullpath' => '../js/mootools/mootools-core-1.4.5-full-compat.js'
    ),
    'mootools_more_1_4_0_1' => array(
        'name' => 'mootools_more_1_4_0_1',
        'type' => 'js',
        'fullpath' => '../js/mootools/mootools-more-1.4.0.1.js'
    ),
    'mootools_class_extras' => array(
        'name' => 'mootools_class_extras',
        'type' => 'js',
        'fullpath' => '../js/mootools/mootools-class-extras.js'
    ),


    //bootstrap
    'bootstrap-responsive_css' => array(
        'name' => 'colors_css',
        'type' => 'css',
        'fullpath' => '../bootstrap/css/bootstrap-responsive.min.css',
    ),
    'bootstrap_css' => array(
        'name' => 'colors_css',
        'type' => 'css',
        'fullpath' => '../bootstrap/css/bootstrap.min.css',
    ),
    'bootstrap' => array(
        'name' => 'mootools_more_1_4_0_1',
        'type' => 'js',
        'fullpath' => '../bootstrap/js/bootstrap.min.js',
        'requires' => array('bootstrap-responsive_css', 'bootstrap_css')
    ),



    // Widgets
    'table_sortable' => array(
        'name' => 'table_sortable',
        'type' => 'js',
        'fullpath' => '../js/widgets/SortableTable.js',
        'requires' => array('mootools_core_1_4_5', 'mootools_more_1_4_0_1', 'SortableTable_css', 'bootstrap_css')
    ),
    'selector' => array(
        'name' => 'selector',
        'type' => 'js',
        'fullpath' => '../js/widgets/Selector.js',
        'requires' => array('mootools_core_1_4_5', 'mootools_more_1_4_0_1', 'Selector_css')
    ),
    'select_box' => array(
        'name' => 'select_box',
        'type' => 'js',
        'fullpath' => '../js/widgets/SelectBox.js',
        'requires' => array('mootools_core_1_4_5', 'mootools_more_1_4_0_1', 'SelectBox_css')
    )


);




?>