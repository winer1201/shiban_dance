<?php
namespace Home\Controller;
use Think\Controller;
class starController extends BaseController {
    public function once(){   
        $this -> display('star_once');
    }
    public function rank(){   
        $this -> display('star_rank');
    }
    public function star(){   
        $this -> display('star');
    }
    public function list(){   
        $this -> display('starlist');
    }
    public function load(){  
    	$this->checkUserInfo(); 
        $this -> display('starload');
    }
    public function vote(){
    	$this->checkUserInfo();   
        $this -> display('star_vote');
    }
    public function art(){   
        $this -> display('star_art');
    }
}
?>