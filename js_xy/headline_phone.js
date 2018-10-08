!(function (win, $) {
    var InterValObj; //timer变量，控制时间 
    var count = 60; //间隔函数，1秒执行 
    var curCount = 60; //当前剩余秒数 
    var code = ""; //验证码 
    var codeLength = 4; //验证码长度 
    var myreg = /^(0|86|17951)?(13[0-9]|15[0-9]|16[0-9]|17[0678]|18[0-9]|19[0-9]|14[579])[0-9]{8}$/;

    //获取参数
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var arr = window.location.search.substr(1).match(reg);
        if (arr != null) {
            return decodeURIComponent(arr[2])
        };
        return null;
    };

    //获取验证码后倒计时
    function SetRemainTimes() {
        if (curCount == 0) {
            window.clearInterval(InterValObj); //停止计时器 
            $(".code").removeAttr("disabled"); //启用按钮 
            $(".code").val("重新发送验证码");
            code = ""; //清除验证码。如果不清除，过时间后，输入收到的验证码依然有效   
        } else {
            curCount--;
            $(".code").val("请在" + curCount + "秒内输入");
        }
    }

    //点击获取验证码
    $(".code").click(function () {
        var tel = $("#tel").val();
        curCount = count;
        if (tel != "" && myreg.test(tel)) {
            //设置button效果，开始计时 
            $(".code").attr("disabled", "true");
            $(".code").val("请在" + curCount + "秒内输入");
            InterValObj = window.setInterval(SetRemainTimes, 1000);
        }
        var url = "http://ltgapi.ktkt.com/user/v1/websigninidentifycode";
        var debug = GetQueryString('debug'); //软件版本
        if (debug == 'true') {
            url = 'http://192.168.0.58:8083/user/v1/websigninidentifycode';
        };
        //判断手机号是否为空
        if (tel == "" || tel == null) {
            layer.msg('请输入手机号');
        } else {
            // 手机号不为空情况下判断手机号格式是否正确					
            if (myreg.test(tel)) {
                var aj = $.ajax({
                    url: url,
                    data: {
                        phone: tel,
                        mchid: "asd",
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function (data) {
                        if (data.Info == "ok") {
                            layer.msg('发送成功');
                        } else {
                            layer.msg('发送失败');
                        }
                    },
                })
            } else {
                layer.msg('输入手机号有误，请重新输入');
            }
        }
    });
    //点击确认提交				
    document.querySelector(".submit").onclick = function () {
        var tel = $("#tel").val();
        var debug = GetQueryString('debug'); //软件版本
        var softfrom = GetQueryString('softfrom'); //用户来源
        var url1 = "http://ltgapi.ktkt.com/user/v1/webcollectphone";
        if (debug == 'true') {
            url1 = 'http://192.168.0.58:8083/user/v1/webcollectphone';
        };

        if (tel == "" || tel == null) {
            layer.msg('请输入手机号');
        } else if (tel != "" && tel != null && $("#input2").val() == "") {
            layer.msg('请输入验证码');
        } else {
            // 发送请求
            var aj = $.ajax({
                url: url1,
                data: {
                    phone: tel,
                    code: $('#input2').val(),
                    mchid: "asd",
                    name: "longtougu",
                    source: softfrom
                },
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    if (data.Info == "ok" && data.Collected == "true") {
                        window.location.href = "hlOldUser.html";
                    } else if (data.Info == "ok" && data.Collected == "false") {
                        window._agl && window._agl.push(['track', ['success', {
                            t: 3
                        }]]);
                        window.location.href = "hlNewUser.html";
                    } else {
                        layer.msg('网络错误');
                    }
                },
                error: function () {
                    layer.msg('验证码错误');
                }
            })
        }
    }

})(window, jQuery);