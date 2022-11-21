$(document).ready(function () {
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

    var json = JSON.parse(sessionStorage.getItem('json_list'))

    // 视情况隐藏back
    if (!GET['back']) {
        $("#back_detail").hide()
        $("#Returning_Flight").hide()
    }

    // 显示资料
    go = json[Number(GET['go'])]

    $('#go_day').html(go.date)
    $('#go_from_to').html(go.from + " to " + go.to)
    $('#go_hour').html(go.hr + "h 10m")
    $('#go_flight_id').html("IVE " + go.id)
    $('#go_price').html("Total HKD " + go.price)

    // $("#go_detail p").append(JSON.stringify(json[Number(GET['go'])]))
    // $("#back_detail p").append(JSON.stringify(json[Number(GET['back'])]))
    back = json[Number(GET['back'])]

    $('#back_day').html(back.date)
    $('#back_from_to').html(back.from + " to " + back.to)
    $('#back_hour').html(back.hr + "h 10m")
    $('#back_flight_id').html("IVE " + back.id)
    $('#back_price').html("Total HKD " + back.price)
})