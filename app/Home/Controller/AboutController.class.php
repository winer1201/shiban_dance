<?php
namespace Home\Controller;
use Think\Controller;
class aboutController extends BaseController {
    public function about(){   
        $this -> display('about_us');
    }
}
?>