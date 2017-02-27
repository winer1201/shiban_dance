<?php
namespace Home\Controller;
use Think\Controller;
class errorController extends BaseController {
    public function about(){   
        $this -> display('error');
    }
}
?>