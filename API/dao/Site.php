<?php
// 约定：所有数据都经过过滤后，才会进去dao层
/****** 接口 ******* 
 * 藏书库
 */
require_once(DIR_DAO."Base.php");
Class Site extends Base{
    private $m_conn;            //数据库连接对象 
    //(*)构造函数会自动连接数据库
    public function __construct(){
        $this->m_conn = self::getInstance();
    }
    // -------------  地点增删改查  -----------------------------
    // (*) 添加地点
    public function addSite($name,$description){ 
        $this->createSQLAndRun("INSERT INTO site (name,description) 
                                    VALUES ('%s','%s')",
                                    $name,
                                    $description
                                ); 
        if ($this->lastAffectedRows()!=1){
            throw new Exception("添加失败，原因未知");
        }
    }

    // (*) 删除地点
    public function deleteSite($id){ 
        $this->createSQLAndRun("delete from site where id='%s'",$id);
        if ($this->lastAffectedRows()!=1){
            throw new Exception("删除失败，可能是因为该藏书点还存在藏书");
        }
    }
    // (*) 修改地点
    public function updateSite($id,$name,$description){
        $ret = $this->createSQLAndRun(
            "update site set name = '%s' , description='%s' where id = '%s'",
            $name,
            $description,
            $id
        );  
        if ($this->lastAffectedRows()!=1){
            throw new Exception("失败，可能是因为数据没有改动或者ID不存在");
        }
    } 
    // (*) 查询所有地点
    public function getSites(){
        $ret = $this->createSQLAndRunAssoc("select * from site");
        return $ret; 
    }


    // ------------ 仓库藏书增删改查 ----------------------
    // 初始化，如果不存在，则新建。
    private function initSiteStock($site_id,$book_id){ 
        $count = $this->createSQLAndRun("select count(*) from site_stock 
                                        where site_id='%s' and book_id='%s'",
                                        $site_id,$book_id    
                                    );
        if (intval($count[0][0])==0){
            $this->createSQLAndRun("INSERT INTO site_stock (site_id,book_id,stock) 
                                        VALUES ('%s','%s',0)",
                                        $site_id,
                                        $book_id
                                    );  
            if ($this->lastAffectedRows()!=1) 
                throw new Exception("出错，可能是因为藏书点ID$site_id 不存在,或图书ID$book_id 不存在");
        }
    }

    // 设置某本书库存
    private function setStock($site_id,$book_id,$stock){
        $this->initSiteStock($site_id,$book_id);
        $ret = $this->createSQLAndRun(
            "update site_stock set stock = '%s' where site_id='%s' and book_id='%s'",
            $stock,
            $site_id,
            $book_id
        ); 
    }
    // 获取某本书在某个仓库的库存
    private function getStock($site_id,$book_id){ 
        $this->initSiteStock($site_id,$book_id);
        $ret = $this->createSQLAndRun("select stock from site_stock 
                                        where book_id='%s' and site_id='%s'",
                                        $book_id,$site_id
                                    ); 
        return intval($ret[0][0]);
    }
    // 某个藏书添加/减少一本书
    public function incStock($site_id,$book_id){
        $cur_stock= $this->getStock($site_id,$book_id);
        $this->setStock($site_id,$book_id,$cur_stock+1);
    }
    public function decStock($site_id,$book_id){
        $cur_stock= $this->getStock($site_id,$book_id);
        if ($cur_stock==0)
            throw new Exception("此仓库中，图书${book_id}库存为0，无法再减去一本");
        $this->setStock($site_id,$book_id,$cur_stock-1);

    }
    // 获取某本书在各仓库的库存，为0则不返回。(考虑到为0的清空可能不存在对应项)
    public function getStockInAllSites($book_id){ 
        $ret = $this->createSQLAndRunAssoc("select site.*,site_stock.stock from site_stock ,site
                                        where site_stock.site_id=site.id and book_id='%s' and site_stock.stock>0",
                                        $book_id    
                                    );
        return $ret;
    }
};  
?>
