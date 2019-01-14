jQuery(($) => {
    let autologin = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "post",
                headers: { token: localStorage.getItem("token") },
                beforeSend: function(xhr){
                    xhr.setRequestHeader("client_type","DESKTOP_WEB");
                },
                url: "http://localhost:3000/users/autologin",
                success(data) {
                    resolve(data)
                }
            })
        })
    };
    let load = () => {
        return new Promise((resolve, reject) => {
            $.getJSON("http://localhost:3000/main", (res) => {
                resolve(res);
            })
        })
    };
    let head = () => {
        var user = (decodeURI(location.search.slice(1)).split("="))[1];
        $("#user").text(user);
        $.ajax({
            type: "post",
            url: "http://localhost:3000/users/headpic",
            data: { account: user },
            success(res) {
                console.log(res);
                $("#headpic").prop("src",`http://localhost:3000/${res}`);
            }
        })
    };
    (async () => {
        let islogin = await autologin();
        let fn = {
            true: async () => {
                let res = await load();
                render(res);
                head();
            },
            false() {
                location.href = "login.html";
            }
        }
        fn[islogin.status]();
    })();
    var opt = "_id";
    $("#myselect").change(() => {
        opt = $("#myselect").val();
    });
    //find
    $("#find-btn").click(async () => {
        let res = await (() => {
            return new Promise((resolve, reject) => {
                let data = {};
                if ($("#demoReload").val().trim().length > 0) {
                    data[opt] = $("#demoReload").val().trim();
                } else {
                    data = null;
                }
                $.getJSON("http://localhost:3000/main", data, (res) => {
                    resolve(res);
                })
            })
        })();
        render(res);
    })
    //delete
    $("#delbtn").click(() => {
        let obj = {};
        for (let i = 0; i < $(".check:checked").length; i++) {
            obj[i] = $($(".check:checked")[i]).closest("tr").find(".item_name").html();
        }
        let str = "";
        for (let key in obj) {
            str += obj[key] + ", ";
        }
        new Confirm({
            title: "确认删除",
            titleColor: "deeppink",
            content: `你确定删除以下数据吗?<br/>${str}`,
            draggable: true,
            overlay: 0.9,
            overlaybgc1: "deeppink",
            overlaybgc2: "purple",
            confirm: deletedata,
            cancel: function () { }
        });
        function deletedata() {
            (async () => {
                let obj = {};
                for (let i = 0; i < $(".check:checked").length; i++) {
                    obj[i] = $($(".check:checked")[i]).closest("tr").find(".item_id").html();
                }
                // console.log(obj);
                let res = await (() => {
                    return new Promise((resolve, reject) => {
                        $.post("http://localhost:3000/main/", obj, (res) => {
                            resolve(res);
                        })
                    })
                })();
                alert(`已删除${res.count}条数据`);
                render(res.data);
            })();
        }
    })

    // render
    function render(res) {
        $("#tbody").html(res.map((item) => {
            return `<tr class="item_tr">
                <td><input type="checkbox" class="check"></td>
                <td class="item_id">${item._id ? item._id : ""}</td>
                <td class="item_name">${item.name ? item.name : ""}</td>
                <td class="item_type">${item.type ? item.type : ""}</td>
                <td class="item_brand">${item.brand ? item.brand : ""}</td>
                <td class="item_price">${item.price ? "$" + item.price.toFixed(2) : ""}</td>
                <td><div class="change">更改</div></td>
            </tr>
            <tr class="change_tr" style="display:none">
                <td></td>
                <td style="color:#fff;" class="change_id">${item._id ? item._id : ""}</td>
                <td style="color:#fff;" class="change_name"></td>
                <td><select name="modules" lay-verify="required" class="category change_type" id="addtype">
                        <option value="避孕套">避孕套</option>
                        <option value="跳蛋">跳蛋</option>
                        <option value="情趣内衣">情趣内衣</option>
                        <option value="皮鞭">皮鞭</option>
                        <option value="chocker">chocker</option>
                    </select>
                </td>
                <td><input type="text" class="change_brand"/></td>
                <td><input type="text" class="change_price"/></td>
                <td><div class="confirm">确认</div></td>
            </tr>`
        }).join(""));
        // select
        var $allcheck = $("#allcheck").prop("checked", false);
        var $check = $(".check").prop("checked", false);
        var $trs = $check.closest("tr");
        $check.on("click", function () {
            $(this).closest("tr").toggleClass('selected');
            // $(this).find(":checkbox").prop("checked",$(this).hasClass('selected'));
            var $checkedLen = $(".check:checked").length;
            var $checkboxLen = $trs.length;
            if ($checkedLen == $checkboxLen) {
                $allcheck.prop("checked", true);
            } else {
                $allcheck.prop("checked", false);
            }
        })
        $allcheck.on("click", function () {
            $check.prop("checked", this.checked);
            this.checked ? $trs.addClass('selected') : $trs.removeClass('selected');
        })
        // update
        $(".change").on("click", function () {
            console.log(this);
            $("#tbody").find(".change_tr").not($(this).closest("tr").next()).hide();
            $("#tbody").find(".change").not($(this)).html("更改");
            // $(this).closest("tr")
            $(this).closest("tr").next().find(".change_name").html($(this).closest("tr").find(".item_name").html());
            $(this).closest("tr").next().find(".change_price").val($(this).closest("tr").find(".item_price").html().slice(1));
            $(this).closest("tr").next().find(".change_type").val($(this).closest("tr").find(".item_type").html());
            $(this).closest("tr").next().find(".change_brand").val($(this).closest("tr").find(".item_brand").html());
            var cur = $(this).text();
            if (cur) {
                $(this).text(cur === '更改' ? '取消' : '更改');
            }
            $(this).closest("tr").next().fadeToggle();
        })
        $(".confirm").on("click",function () {
            // if ($(this).closest("tr").find(".change_name").val().trim() == "") {
            //     alert("不能为空");
            // } 
             if ($(this).closest("tr").find(".change_brand").val().trim() == "") {
                alert("不能为空");
            } else if ($(this).closest("tr").find(".change_type").val().trim() == "") {
                alert("不能为空");
            } else if (isNaN($(this).closest("tr").find(".change_price").val().trim()) ||
                $(this).closest("tr").find(".change_price").val().trim() == null ||
                $(this).closest("tr").find(".change_price").val().trim() == "") {
                alert("请输入正确价格");
            }
            else {
                $.post("http://localhost:3000/main/change", {
                    _id: $(this).closest("tr").find(".change_id").html(),
                    // name: $(this).closest("tr").find(".change_name").val().trim(),
                    brand: $(this).closest("tr").find(".change_brand").val().trim(),
                    price: $(this).closest("tr").find(".change_price").val().trim(),
                    type: $(this).closest("tr").find(".change_type").val().trim()
                }, (res) => {
                    if (res == "exist") {
                        alert("该商品名已存在");
                    } else {
                        alert(`
                        修改成功,
                        商品名 ：${res.data[0].name},
                        品牌 ：${res.data[0].brand},
                        商品价格 ：${res.data[0].price},
                        商品类型 ：${res.data[0].type},
                        id : ${res.data[0]._id}`);
                        $(this).closest("tr").prev().find(".item_name").html(res.data[0].name);
                        $(this).closest("tr").prev().find(".item_brand").html(res.data[0].brand);
                        $(this).closest("tr").prev().find(".item_type").html(res.data[0].type);
                        $(this).closest("tr").prev().find(".item_price").html("$" + res.data[0].price.toFixed(2));
                        $(this).closest("tr").fadeOut();
                        $(this).closest("tr").find(".change_name").val("");
                        $(this).closest("tr").find(".change_price").val("");
                        $(this).closest("tr").find(".change_brand").val("");
                        $(this).closest("tr").prev().find(".change").text("更改");
                    }
                })
            }
        })
    }
    $("#signout").click(() => {
        localStorage.removeItem("token");
        location.href = "login.html";
    });
    $("#upload").click(()=>{
        location.href = "upload.html?user="+(decodeURI(location.search.slice(1)).split("="))[1];
    })
    $("#addbtn").click(()=>{
        location.href = "add.html?user="+(decodeURI(location.search.slice(1)).split("="))[1];
    })
    $("#main").click(()=>{
        location.href = "main.html?user="+(decodeURI(location.search.slice(1)).split("="))[1];
    })
})