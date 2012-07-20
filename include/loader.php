<?php
include("../yui/phploader/loader.php");

class ModuleLoader
{
    protected $YAHOO_util_Loader;
    protected $code_base_name;
    protected $module_name;

    public function load($code_base_name, $module_name)
    {
        $this->YAHOO_util_Loader = new YAHOO_util_Loader("3.0.0", "my_loader_config_" . rand(), $code_base_name, true);
        $this->YAHOO_util_Loader->load($module_name);
        $this->YAHOO_util_Loader->combine = true;
    }

    public function tags(){
        return  $this->YAHOO_util_Loader->tags();
    }
}


?>