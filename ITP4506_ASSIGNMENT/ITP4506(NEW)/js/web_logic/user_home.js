$(document).ready(function () {

    // 目前页数
    var page_now_go = 0
    var page_now_back = 0
    // 每页显示数量
    var one_page_num = 12

    // 航班列表
    var json = []

    // 我受不了了，随机创建列表
    var city = ["HKG", 'TYO', 'TPE', 'SEL', 'LHR']
    var how_many = 30

    for (let i = 0; i < how_many; i++) {
        var rand = Math.floor(Math.random() * city.length)
        var rand2 = Math.floor(Math.random() * city.length)
        while (rand == rand2) {
            rand2 = Math.floor(Math.random() * city.length)
        }

        var from = city[rand]
        var to = city[rand2]

        var date = new Date()
        rand = date.getDate() + Math.floor(Math.random() * 360)
        date.setDate(rand)

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

        json.push(js)
    }

    // 更新前端select
    city.forEach(element => {
        $("#from_where").append("<option>" + element + "</option>")
        $("#to_where").append("<option>" + element + "</option>")
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

    function select_change(select, change){
        change.children().show()
        change.children("option:contains('" + select.val() + "')").map(function(){
            if($(this).text() == select.val())
                $(this).hide()
        })
    }

    // select 防原地起飞
    $("#from_where").change(function(){
        select_change($(this), $("#to_where"))
    })
    $("#to_where").change(function(){
        select_change($(this), $("#from_where"))
    })

    // date 防时光倒流
    $("input[type='date']").change(function () {
        // alert($(this).val())
        var date_now = new Date()
        var date_choose = new Date($(this).val())
        if (date_now > date_choose) {
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

        // display number
        var y = 0
        for (var i = page_now * one_page_num; i < json.length && y < one_page_num + 1; i++) {
            var value = json[i]

            /**
             * 0 = Go
             * 1 = pass
             * 2 = back
             */
            var ty = 1

            if (isGo) {
                if (
                    (!$("#from_where").val() || $("#from_where").val() == value.from)
                    && (!$("#to_where").val() || $("#to_where").val() == value.to)
                    && (!$("#from_time").val() || $("#from_time").val() == value.date)
                )
                    ty = 0

            } else {
                // depar date
                var date_now = new Date($("#from_time").val())
                // value date
                var date_choose = new Date(value.date)

                if (
                    (!$("#from_where").val() || $("#from_where").val() == value.to)
                    && (!$("#to_where").val() || $("#to_where").val() == value.from)
                    && (!$("#to_time").val() || $("#to_time").val() == value.date)
                    && (!$("#from_time").val() || date_choose >= date_now)
                )
                    ty = 2
            }

            // str = "<p>"
            //     + "\tid: " + value.id
            //     + "\tFrom: " + value.from
            //     + "\tTo: " + value.to
            //     + "\tdate: " + value.date
            //     + "\tprice: " + value.price
            //     + "\thr: " + value.hr
            //     + "</p>"

            str = "<tr>"
                    + "<td>" + value.id + "</td>"
                    + "<td>" + value.from + "</td>"
                    + "<td>" + value.to + "</td>"
                    + "<td>" + value.date + "</td>"
                    + "<td>$ " + value.price + "</td>"
                    + "<td>" + value.hr + " h</td>"
                    + "</tr>"

            if (ty == 0 || ty == 2) {
                if (y < one_page_num)
                    list_change.append(str)
                y++
            }
        }

        // 填充空行
        if(y < 12){
            str = "<tr>"
                    + "<td colspan='6'>&nbsp;</td>"
                    + "</tr>"
            for (var i = 0; i < 12 - y; i++) {
                list_change.append(str)
            }
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

        if ($("input[name='travel']:checked").val() == "one_way")
            $("#back_table").hide()
        else{
            $("#back_table").show()
            refresh_list(page_now_back, list, false, pre_page, next_page)
        }
    }

    // 开局初始化
    refresh_Go_list()

    $("#search").click(function () {
        page_now_back = 0
        page_now_go = 0
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
})