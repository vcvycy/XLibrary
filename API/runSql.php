<script>

var sess=<?php session_start();echo json_encode($_SESSION);?>;
console.log(sess);
</script>

<?php 
  require_once("utils.php"); 
  $data="{}";
  if (isset($_GET["sql"])){
     $dbconf=Utils::$g_config["db"]; 
     $conn=new mysqli($dbconf["host"],$dbconf["user"],$dbconf["pass"],$dbconf["dbname"]); 
     
     $rst=$conn->query($_GET["sql"]);
     $data=json_encode($rst->fetch_all());
  }
?>

<script src="/ykb/front/js/jquery-2.1.4.js"></script>
<textarea id="a" rows=10 cols=100>
  <?php
    if (isset($_GET["sql"]))
          echo $_GET["sql"];        
  ?>
</textarea>
<h1>数据库</h1>
<button onclick="go()">查询</button>
<?php echo $data;?>
<script>
var data=<?php echo $data;?>;
console.log(data);
function go(){
  var c=$("#a").val();
  location.href="runSql.php?sql="+c;
}
</script>
