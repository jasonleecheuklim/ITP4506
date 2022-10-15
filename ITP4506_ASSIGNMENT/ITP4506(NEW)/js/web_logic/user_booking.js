$(document).ready(function(){
    GET = new Array()

    // 获取get
    function get_get() {
        value = window.location.href.split("?")
        if (value[1]) {
            GETs = value[1].split("&")

            GETs.forEach(element => {
                k_v = element.split("=")
                GET[k_v[0]] = k_v[1]
            });
        }
    }

    get_get()

    var json = JSON.parse(Cookies.get('json_list'))

    // 视情况隐藏back
    if(!GET['back']){
        $("#back_detail").hide()
    }

    // 显示资料
    $("#go_detail p").append(JSON.stringify(json[Number(GET['go'])]))
    $("#back_detail p").append(JSON.stringify(json[Number(GET['back'])]))
})