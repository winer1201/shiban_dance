<?php
namespace Home\Controller;
use Think\Controller;
class MyDanceController extends BaseController {
    public function detail(){   
        $this->checkUserInfo();
        $this -> display('dance_details');
    }
    public function create(){   
        $this->checkUserInfo();
        $this -> display('create_dance');
    }
    public function works(){   
        $this->checkUserInfo();
        $this -> display('dance_works');
    }
    public function set(){
    	$this->checkUserInfo();     
        $this -> display('danceset');
    }
    public function join(){   
        $this -> display('join_dance');
    }
    public function member(){
    	$this->checkUserInfo();   
        $this -> display('member');
    }
    /**
     * 我的舞队
     */
    public function dance(){   
        $this->checkUserInfo();
        $this -> display('mydance');
    }
    public function shen(){   
        $this -> display('shen_info');
    }
}
?>