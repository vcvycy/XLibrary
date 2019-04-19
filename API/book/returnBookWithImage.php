<?php 
require_once("../utils.php");
require_once(DIR_DAO."Books.php");
// 捐赠一本书 (如果书不在数据库中，则从豆瓣抓数据放入数据库)
// 
function main(){ 
    // 参数读取
    try{
        \StuSess\isLoginOrThrowException(); 
        $sid = \StuSess\getKey("sid"); 
        $isbn = Utils::getParamWithFilter("isbn","digit");
        $b =new Books();
        $book_borrow_id = $b->getBorrowIDNotReturn($sid,$isbn); 
        $save_path_without_suffix = sprintf("%suploads/return_book_images/return_book_image_%d",DIR_API,$book_borrow_id);//上传路径 
        $path = Utils::saveUploadedFile("image",$save_path_without_suffix,"jpg|jpeg|bmp|gif|png",5);  
        $b->returnBook($sid,$isbn);
        Utils::exit(0,"还书成功");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>