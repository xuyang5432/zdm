/**
 * 对IE10以下浏览器支持H5 placeholder属性的插件
 * placeholderColor:占位字体颜色
 * unPlaceholderColor：非占位字体颜色
 */
(function (global, placeholderColor, unPlaceholderColor) {
    if (window.attachEvent) {//判断是否支持IE浏览器
        //颜色处理
        global.placeholderColor = placeholderColor == undefined ? "#949494" : placeholderColor;
        global.unPlaceholderColor = unPlaceholderColor == undefined ? "#3C3F41" : unPlaceholderColor;
        //注册加载事件
        window.attachEvent("onload", function () {
            var inputs = document.getElementsByTagName("input");
            //判断文本框空白字符
            var reg = /^\s*$/;
            for (var i = 0; i < inputs.length; i++) {
                var input = inputs[i];
                var type = input.type.toLowerCase();
                //获取属性 placeholder的值
                var placeholder = input.getAttribute("placeholder");
                if (type == "text" && placeholder) {
                    input.value = placeholder;
                    input.style.color = global.placeholderColor;//默认字体颜色为灰色
                    (function (txt) {
                        //获取焦点事件处理
                        input.onfocus = function () {
                            var val = this.value;
                            if (txt === val) {//相等则清空
                                this.value = "";
                            }
                        };
                        //失去焦点事件处理
                        input.onblur = function () {
                            var val = this.value;
                            if (reg.test(val)) {//为空白符号
                                this.value = txt;//用placeholder取代
                                input.style.color = global.placeholderColor;
                            }
                        };
                        //内容输入事件处理
                        input.onkeyup = function () {
                            var val = this.value;
                            if (txt === val) {//相等则清空
                                if (input.style.color != global.placeholderColor)
                                    input.style.color = global.placeholderColor;
                            } else {
                                if (input.style.color != global.unPlaceholderColor)
                                    input.style.color = global.unPlaceholderColor;//暗黑色
                            }
                        }
                    })(placeholder);
                }
            }
        });
    }
}(typeof window !== "undefined" ? window : this));