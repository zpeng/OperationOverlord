<?php
//Include the loader class file
include("../include/code_base_config.php");
include("../include/loader.php");
$loader = new ModuleLoader();
$loader->load($code_base, 'select_box');
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Select Box</title>
    <?=$loader->tags();?>
    <link rel="stylesheet" href="../css/country_flag.css"/>
    <script type="text/javascript" src="selector_json.js"></script>
    <script type="text/javascript">
        window.addEvent('domready', function () {
            var mySelectBox = new SelectBox({
                    targetId:'selector_container', // where to place the selector
                    selectorId:'mySelectDiv',
                    selectorName:'country'
                },
                SELECTOR_JSON
            );
        });
    </script>
</head>
<body>

<div id="container">
    <div id="selector_container">
    </div>
</div>

</body>
</html>