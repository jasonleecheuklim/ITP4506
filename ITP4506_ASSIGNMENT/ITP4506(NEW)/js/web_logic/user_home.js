$(document).ready(function(){
    // 添加只需要修改这个json
    var json = [
        {from: "HKG", to: "TYO", date: '2022-10-10', id: '001', price: '10000', hr: '2' },
        {from: 'TYO', to: 'HKG', date: '2022-10-14', id: '002', price: '10000', hr: '2' },
        {from: 'TPE', to: 'HKG', date: '2022-10-12', id: '003', price: '10000', hr: '8' },
        {from: 'HKG', to: 'TPE', date: '2022-10-13', id: '004', price: '10000', hr: '8' },
        {from: 'TYO', to: 'TPE', date: '2022-10-13', id: '005', price: '10000', hr: '3' },
        {from: 'TPE', to: 'TYO', date: '2022-11-01', id: '006', price: '10000', hr: '3' },
        {from: 'SEL', to: 'HKG', date: '2022-10-10', id: '007', price: '10000', hr: '4' },
        {from: 'HKG', to: 'SEL', date: '2022-10-11', id: '008', price: '10000', hr: '4' },
        {from: 'SEL', to: 'TYO', date: '2022-10-10', id: '009', price: '10000', hr: '5' },
        {from: 'TYO', to: 'SEL', date: '2022-11-01', id: '010', price: '10000', hr: '5' }
    ]

    // 创建列表
    var list = ""
    json.forEach(value => {
        var str = "<p>" + value.from + "</p>"
        var str2 = "<p>" + value.to + "</p>"
        if(list.indexOf(str) == -1)
            list += str
        if(list.indexOf(str2) == -1)
            list += str2
    });

    $("input[name='travel']").click(function(){
        var travel = $("input[name='travel']:checked").val()

        var to_text = $("#to_time")
        if(travel == "one_way"){
            to_text.val("")
            to_text.attr("disabled", "disabled")

        }else{
            to_text.removeAttr("disabled")
        }
    })

    var editing = ""
    $("input[type='text']")
        .click(function(){
            editing = $(this).attr("id") + "_list"

            $("#" + editing).html(list)
            $("#" + editing + " p").hide()
            $("#" + editing + " p:contains('" + $(this).val() + "')").show()
        })
        .keyup(function(){
            $("#" + editing + " p").hide()
            $("#" + editing + " p:contains('" + $(this).val() + "')").show()

        })
        .blur(function(){
            $("#" + editing + " p").remove()
            editing = ""
        })

    $("input[type='date']").change(function(){
        // alert($(this).val())
        var date_now = new Date()
        var date_choose = new Date($(this).val())
        if(date_now > date_choose){
            alert("Wrong date! Please select a date today or later.")
            var date_str = date_now.getFullYear() + "-" 
                            + (date_now.getMonth()+1 < 10? "0" + date_now.getMonth()+1: date_now.getMonth()+1) + "-" 
                            + (date_now.getDate() < 10? "0" + date_now.getDate(): date_now.getDate())
            $(this).val(date_str)
        }
    })

    // 航班列表刷新
    function refresh_list(){
        var go_list = $("#go_traval_list")
        var back_list = $("#back_traval_list")

        go_list.children("p").remove()
        back_list.children("p").remove()

        json.forEach(value => {
            /**
             * 0 = Go
             * 1 = pass
             * 2 = back
             */
            var ty = 0

            if(
                ($("#from_where").val() && $("#from_where").val() != value.from)
                ||($("#to_where").val() && $("#to_where").val() != value.to)
                ||($("#from_time").val() && $("#from_time").val() != value.date)
            )
                ty = 1
            
            var date_now = new Date($("#from_time").val())
            var date_choose = new Date(value.date)

            if(
                (ty == 1 && $("input[name='travel']:checked").val() != "one_way")
                && !(
                    ($("#from_where").val() && $("#from_where").val() != value.to)
                    ||($("#to_where").val() && $("#to_where").val() != value.from)
                    ||($("#to_time").val() && $("#to_time").val() != value.date)
                    ||(date_choose < date_now)
                )
            )
                ty = 2
            
            str = "<p>"
                        + "\tid: " + value.id
                        + "\tFrom: " + value.from
                        + "\tTo: " + value.to
                        + "\tdate: " + value.date
                        + "\tprice: " + value.price
                        + "\thr: " + value.hr
                    + "</p>"

            switch (ty) {
                case 0:
                    go_list.append(str)
                    break;
            
                case 2:
                    back_list.append(str)
                    break;
            }
        });
    }

    $("#search").click(refresh_list)
})