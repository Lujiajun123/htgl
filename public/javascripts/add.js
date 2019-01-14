$(() => {
    let autologin = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "post",
                headers: { token: localStorage.getItem("token") },
                url: "http://localhost:3000/users/autologin",
                success(data) {
                    resolve(data)
                }
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
            true(){
                head();
                $("#addbtn").click(() => {
                    if ($("#addname").val().trim() == "" || $("#addbrand").val().trim() == "" || $("#addprice").val().trim() == "") {
                        alert("不能为空");
                    } else if (isNaN($("#addprice").val().trim())) {
                        alert("请输入正确价格");
                    }
                    else {
                        $.post("http://localhost:3000/add", {
                            name: $("#addname").val().trim(),
                            brand: $("#addbrand").val().trim(),
                            price: $("#addprice").val().trim(),
                            type: $("#addtype").val().trim()
                        }, (res) => {
                            if (res == "exist") {
                                console.log("该商品已存在");
                            } else {
                                alert(`
                        添加成功,
                        商品名 ：${res.ops[0].name},
                        品牌 ：${res.ops[0].brand},
                        商品价格 ：${res.ops[0].price.toFixed(2)},
                        商品类型 ：${res.ops[0].type},
                        id : ${res.ops[0]._id}`);
                                // window.location.reload();
                                $("#addname").val("");
                                $("#addbrand").val("");
                                $("#addprice").val("");
                            }
                        })
                    }
                })
            },
            false(){
                location.href = "login.html";
            }
        }
        fn[islogin.status]();
    })();
    $("#signout").click(()=>{
        localStorage.removeItem("token");
        location.href = "login.html";
    });
    $("#upload").click(()=>{
        location.href = "upload.html?user="+(decodeURI(location.search.slice(1)).split("="))[1];
    })
    // $("#addbtn").click(()=>{
    //     location.href = "add.html?user="+(decodeURI(location.search.slice(1)).split("="))[1];
    // })
    $("#main").click(()=>{
        location.href = "main.html?user="+(decodeURI(location.search.slice(1)).split("="))[1];
    })
})