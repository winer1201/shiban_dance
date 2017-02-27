<?php
namespace Home\Controller;
use Think\Controller;
class myinfoController extends BaseController {
    public function info(){   
        $this->checkUserInfo(false);
        $this -> display('myinfo');
    }
    public function add(){   
        $this->checkUserInfo();
        $this -> display('addphone');
    }
    public function set(){   
        $this->checkUserInfo();
        $this -> display('infoset');
    }
    public function input(){  
        $this->checkUserInfo(); 
        $this -> display('input');
    }

    public function uploadhead(){
        $this->checkUserInfo(); 
        $this -> display('uploadheadimg');
    }
    public function index(){
    	$this->checkUserInfo();   
        $this -> display('index');
    }
    public function message(){
    	$this->checkUserInfo();   
        $this -> display('message');
    }
    public function dance_message(){
    	$this->checkUserInfo();   
        $this -> display('dance_message');
    }
    public function system_message(){
    	$this->checkUserInfo();   
        $this -> display('system_message');
    }
}
?>