$(document).ready(function () {
    GET = new Array()

    // 获取get
    // function get_get() {
    //     value = window.location.href.split("?")
    //     if (value[1]) {
    //         GETs = value[1].split("&")

    //         GETs.forEach(element => {
    //             k_v = element.split("=")
    //             GET[k_v[0]] = k_v[1]
    //         });
    //     }
    // }

    // get_get()

    GET['go'] = sessionStorage.getItem("booking_go")
    GET['back'] = sessionStorage.getItem("booking_back")

    var json = JSON.parse(sessionStorage.getItem('json_list'))

    // 视情况隐藏back
    if (!GET['back']) {
        $("[id=back_detail]").hide()
        $("[id=Returning_Flight]").hide()
    }

    // 显示资料
    go = json[Number(GET['go'])]

    var date = new Date()
    $("[id=order_date]").html(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())

    $('[id=go_day]').html(go.date)
    $('[id=go_from_to]').html(go.from + " to " + go.to)
    $('#go_hour').html(go.hr + "h 10m")
    $('[id=go_flight_id]').html("IVE " + go.id)
    $('#go_price').html("Business Class: HKD " + go.price)
    $('#first_class_go_price').html("First Class: HKD " + (go.price * 2))

    // $("#go_detail p").append(JSON.stringify(json[Number(GET['go'])]))
    // $("#back_detail p").append(JSON.stringify(json[Number(GET['back'])]))
    back = json[Number(GET['back'])]

    $("[id=back_day]").html(back.date)
    // $('#back_day').html(back.date)
    $('[id=back_from_to]').html(back.from + " to " + back.to)
    $('[id=back_hour]').html(back.hr + "h 10m")
    $('[id=back_flight_id]').html("IVE " + back.id)
    $('[id=back_price]').html("Business Class: HKD " + back.price)
    $('#first_class_back_price').html("First Class: HKD " + (back.price * 2))
})