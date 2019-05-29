<?php
// 通过ISBN获取图书信息
   require_once("utils.php"); 
   require_once(DIR_DAO."Books.php");
   try{ 
      $isbn = Utils::getParamWithFilter("isbn","digit"); 
   }catch (Exception $e) { //接口中也找不到，返回错误。
      Utils::exit(-1,$e->getMessage());
   }
   if ($isbn!=null){
      $b = new Books(); 
      try{
         // 先尝试在数据库中查找
         $book_info= $b->getBookInfo($isbn);
         Utils::exit(0,$book_info);
      }catch(Exception $e){ //数据库找不到则用接口查找，并加入数据库中
         try{ 
            $book_info = Utils::getBookInfoByISBN($isbn); 
            $b->addBook($book_info); //加到数据库中
            $book_info = $b->getBookInfo($isbn); // 重新查找数据库，以获取库存信息
            Utils::exit(0,$book_info);
         }catch (Exception $e) { //接口中也找不到，返回错误。
            Utils::exit(-1,$e->getMessage());
         }
      }
   }
   else
      Utils::exit(-1,"参数isbn不存在")
?>