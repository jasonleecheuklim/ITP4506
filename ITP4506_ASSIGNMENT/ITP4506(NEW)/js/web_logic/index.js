$(document).ready(function () {

    var json = [
        {user: 'a001', pass: 'a001', type: 'user/seat'},
        {user: 'a002', pass: 'a002', type: 'home/admin'},
        {user: 'root', pass: 'root', type: 'home/operator'}
    ]

    $("#login_form").submit(function () {
        var username = $("#user_name").val();
        var pass = $("#user_pass").val();

        // 用户名错误
        var str = "User name does not exist!"
        var succ = ""
        json.forEach(value => {
            if (value.user == username) {

                if (value.pass == pass) { // 登录成功
                    succ = value.type;
                    str = "Welcome to IVE Airline! ";
                    return false;

                } else {  // 密码错误
                    str = "Wrong password!";
                    return false;
                }
            }
        });

        alert(str)

        // 页面跳转
        if (succ) {
            $("#login_form").attr("action", "" + succ + ".html");
        }
    })
})