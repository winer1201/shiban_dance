<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends BaseController {
<<<<<<< .mine
||||||| .r277
    public function index(){   
        $this -> display('index');
    }
=======
    public function index(){   
        //$this -> display('index');
        $this->redirect("myinfo/index");
    }
>>>>>>> .r281
    public function home(){   
        $this -> display('home');
    }
}
?>