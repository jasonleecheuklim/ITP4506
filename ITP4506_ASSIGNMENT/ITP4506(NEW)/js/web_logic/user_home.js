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

    // 目前页数
    var page_now_go = 0
    var page_now_back = 0
    // 每页显示数量
    var one_page_num = 12

    // 来回航班选择
    var booking_go = ""
    var booking_back = ""

    // 航班列表
    var json = sessionStorage.getItem('json_list') == null ? [] : JSON.parse(sessionStorage.getItem('json_list'))
    // 筛选后的列表
    // var screen_json = {'go':[], 'back': []}
    var screen_json = list_screening()

    // 我受不了了，随机创建列表
    var city = [
        {"code": "HKG", "name": "Hong Kong International, China"},
        {"code": 'PVG', "name": "Pudong International, Shanghai"},
        {"code": 'TPE', "name": "Taoyuan International, Taipei"},
        {"code": 'KIX', "name": "Kansai International, Osaka"}
    ]
    var how_many = 300

    function refresh_data() {
        var json_list = []
        for (let i = 0; i < how_many; i++) {
            var rand = Math.floor(Math.random() * city.length)
            var rand2 = Math.floor(Math.random() * city.length)
            while (rand == rand2) {
                rand2 = Math.floor(Math.random() * city.length)
            }

            var from = city[rand]['code']
            var to = city[rand2]['code']

            var date = new Date()
            
            rand = date.getDate() + Math.floor(Math.random() * 30)
            date.setDate(rand)

            console.log(date.getMonth() + ", " + date.getDate())

            var date_str = date.getFullYear() + "-"
                + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
                + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())

            var price = Math.floor(Math.random() * (50000 - 10000) + 10000)
            var hr = Math.floor(Math.random() * (9 - 2) + 2)

            var id = i < 100 ?
                i < 10 ?
                    "00" + i
                    : "0" + i
                : "" + i

            var js = {
                from: from,
                to: to,
                date: date_str,
                id: id,
                price: price,
                hr: hr
            }

            json_list.push(js)

        }
        return json_list

    }

    if (json.length == 0) {
        json = refresh_data()

        sessionStorage.setItem('json_list', JSON.stringify(json))
    }

    // 更新前端select
    city.forEach(element => {
        var e = "<option value='" + element.code + "'>(" + element.code + ")" + element.name + "</option>"
        $("#from_where").append(e)
        $("#to_where").append(e)
    });

    // 创建预览列表
    var list = ""
    json.forEach(value => {
        var str = "<p>" + value.from + "</p>"
        var str2 = "<p>" + value.to + "</p>"
        if (list.indexOf(str) == -1)
            list += str
        if (list.indexOf(str2) == -1)
            list += str2
    });

    // 监听器群

    // Button hide when One-way is checked
    $("input[name='travel']").click(function () {
        var travel = $("input[name='travel']:checked").val()

        var to_text = $("#to_time")
        if (travel == "one_way") {
            to_text.val("")
            to_text.attr("disabled", "disabled")

        } else {
            to_text.removeAttr("disabled")
        }
    })

    function select_change(select, change) {
        change.children().show()
        change.children("option:contains('" + select.val() + "')").map(function () {
            if ($(this).val() == select.val())
                $(this).hide()
        })
    }

    // select 防原地起飞
    $("#from_where").change(function () {
        select_change($(this), $("#to_where"))
    })
    $("#to_where").change(function () {
        select_change($(this), $("#from_where"))
    })

    // date 防时光倒流
    $("input[type='date']").change(function () {
        // alert($(this).val())
        var date_now = new Date()
        date_now.setDate(date_now.getDate() - 1)
        var date_choose = new Date($(this).val())
        if (date_choose < date_now) {
            alert("Wrong date! Please select a date today or later.")
            var date_str = date_now.getFullYear() + "-"
                + (date_now.getMonth() + 1 < 10 ? "0" + (date_now.getMonth() + 1) : date_now.getMonth() + 1) + "-"
                + (date_now.getDate() < 10 ? "0" + date_now.getDate() : date_now.getDate())
            $(this).val(date_str)
        }
    })

    // 航班列表刷新
    function refresh_list(page_now, list_change, isGo, pre_page, next_page) {
        list_change.children("tr").remove()

        // 正在使用的data
        var get_data_arr = isGo ? screen_json.go : screen_json.back

        // display number
        var y = 0
        for (var i = page_now * one_page_num; i < get_data_arr.length && y < one_page_num + 1; i++) {

            var value = get_data_arr[i]


            str = "<tr id='" + value.id + ((isGo && booking_go == value.id) || (!isGo && booking_back == value.id) ? "'class='select_tr'" : '') + "'>"
                + "<td>IVE-" + value.id + "</td>"
                + "<td>" + value.from + "</td>"
                + "<td>" + value.to + "</td>"
                + "<td>" + value.date + "</td>"
                + "<td>$ " + value.price + "</td>"
                + "<td>" + value.hr + " h 10m</td>"
                + "</tr>"

            if (y < one_page_num)
                list_change.append(str)

            y++
        }

        // 填充空行
        if (y < 12) {
            str = "<tr>"
                + "<td colspan='6'>&nbsp;</td>"
                + "</tr>"
            // for (var i = 0; i < 12 - y; i++) {
            //     list_change.append(str)
            // }
        }

        // 页面控制
        if (page_now == 0)
            pre_page.hide()
        else
            pre_page.show()

        if (y < one_page_num)
            next_page.hide()
        else
            next_page.show()
    }

    function refresh_Go_list() {
        var list = $("#go_data")
        var pre_page = $("#previous_go_page")
        var next_page = $("#next_go_page")

        refresh_list(page_now_go, list, true, pre_page, next_page)
    }

    function refresh_Back_list() {
        var list = $("#back_travel_list")
        var pre_page = $("#previous_back_page")
        var next_page = $("#next_back_page")

        if (GET['travel'] == "one_way")
            $("#back_table").hide()
        else {
            $("#back_table").show()
            refresh_list(page_now_back, list, false, pre_page, next_page)
        }
    }

    // 开局初始化
    refresh_Go_list()
    refresh_Back_list()

    // 筛选列表
    function list_screening() {
        var said = {'go': [], 'back': []}
        json.forEach(value => {
            /**
             * 0 = Go
             * 1 = pass
             * 2 = back
             */
            var ty = 1

            if (
                (!GET['from_where'] || GET['from_where'] == value.from)
                && (!GET['to_where'] || GET['to_where'] == value.to)
                && (!GET['from_time'] || GET['from_time'] == value.date)
            ) {
                ty = 0

            } else {
                // depar date
                var date_now = new Date(GET['from_time'])
                // value date
                var date_choose = new Date(value.date)

                if (
                    (!GET['from_where'] || GET['from_where'] == value.to)
                    && (!GET['to_where'] || GET['to_where'] == value.from)
                    && (!GET['to_time'] || GET['to_time'] == value.date)
                    && (!GET['from_time'] || date_choose >= date_now)
                )
                    ty = 2
            }

            if (ty == 0) {
                said.go.push(value)
            } else if (ty == 2) {
                said.back.push(value)
            }

        });

        return said
        // localStorage.setItem('screen_json', JSON.stringify(screen_json))
    }

    $("#search").click(function () {
        page_now_back = 0
        page_now_go = 0
        list_screening()
        refresh_Go_list()
        refresh_Back_list()
    })

    $("#previous_go_page").click(function () {
        page_now_go--
        refresh_Go_list()
    })
    $("#next_go_page").click(function () {
        page_now_go++
        refresh_Go_list()
    })

    $("#previous_back_page").click(function () {
        page_now_back--
        refresh_Back_list()
    })
    $("#next_back_page").click(function () {
        page_now_back++
        refresh_Back_list()
    })

    $("table")
        .on('click', 'td', function () {
            // 如有其他选中先撇除
            if ($(this).parent().parent().attr("id") == "go_data") {
                // alert(booking_go)
                if (booking_go)
                    $("#go_data").children("#" + booking_go).toggleClass('select_tr')

                booking_go = $(this).parent().attr("id")
                $(this).parent().toggleClass('select_tr')
            } else {
                if (booking_back)
                    $("#back_travel_list").children("#" + booking_back).toggleClass('select_tr')

                booking_back = $(this).parent().attr("id")
                $(this).parent().toggleClass('select_tr')
            }
        })
        .on('mouseenter mouseleave', 'td', function () {
            $(this).parent().toggleClass('tr_hover')
        })

    $('#finish_booking').click(function () {
        // alert(JSON.stringify(json[Number(booking_go)]) + ", " + JSON.stringify(json[Number(booking_back)]))
        // if (GET['travel'] == 'one_way'){

        // }

        // 都选好了？
        if (
            (booking_go)
            && (GET['travel'] == 'one_way' ? true : booking_back)
        ) {
            window.location.href = "seat.html?go=" + booking_go + "&back=" + booking_back
        } else {

            var str = ""
            if (!booking_go)
                str += "DEPARTURE"

            if (GET['travel'] != 'one_way' && !booking_back)
                str += !str ? "RETURN" : " & RETURN"

            alert("Please choose " + str)
        }
    })
})