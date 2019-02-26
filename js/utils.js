// 条形码识别
var g_config={
    "APIDir" : "/Library/API"
}
var QuaggaJSConfig={
    inputStream: {              // 输入配置
        size: 800,              // 输入图片width缩放到800px
        singleChannel: false    // 只读取红色通道 
    },
    locator: {                  // 条形码[定位]
        patchSize: "medium",    // 条形码占据图片大小
        halfSample: true        // 是否对图片长宽缩放到1/2,加快执行速度
    },
    decoder: {                  // 条形码[识别]
        readers: [
          "code_128_reader",
          "ean_reader"
        ]                      // 需要被识别的条形码标准 (不同标准可能读取出不同的内容)
        
    },
    locate: true,               // 为true时，locator才有意义
    src: null
};
function RecognizeBarCode(url,cb_fun){
    QuaggaJSConfig.src=url;
    Quagga.decodeSingle(QuaggaJSConfig,cb_fun);
}  
function GetBookInfoByISBN(isbn,cb_fun){
    var url=`${g_config.APIDir}/isbn.php?isbn=${isbn}`;
    $.get(url,function(rst){
        cb_fun(JSON.parse(rst)); 
    });
} 