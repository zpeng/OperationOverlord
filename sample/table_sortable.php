<?php
//Include the loader class file
include("../include/code_base_config.php");
include("../include/loader.php");
$loader = new ModuleLoader();
$loader->load($code_base, 'table_sortable');
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Sortable Table</title>
    <?=$loader->tags();?>
    <script type="text/javascript" src="table_json.js"></script>
    <script type="text/javascript">
        window.addEvent('domready', function () {
            var myTable = new SortableTable({
                    tableId:'myTable',
                    tableClass:'SortableTable table table-bordered table-striped',
                    targetId:'table_container',
                    overCls:'over',

                    columnSelectClass: 'columnSelector',
                    keywordInputClass: 'keywordSearchInput',
                    pagingSelectorClass: 'pagingSelector'
                },
                TABLE_JSON
            );
        });
    </script>
</head>
<body>

<div id="container">
    <div id="table_container">

    </div>
</div>

</body>
</html>