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
                $("#img").prop("src",`http://localhost:3000/${res}`);
            }
        })
    };
    var user = localStorage.getItem("token");
    (async () => {
        let islogin = await autologin();
        let fn = {
            true(){
                head();
                $("#file").on("change", () => {
                    var data = new FormData();
                    // console.log($("#file")[0].files);
                    data.append("pic", $("#file")[0].files[0]);
                    $.ajax({
                        url: "http://localhost:3000/users/upload",
                        data,
                        type: "post",
                        //ajax2.0可以不用设置请求头，但是jq帮我们自动设置了，这样的话需要我们自己取消掉
                        contentType: false,
                        //取消帮我们格式化数据，是什么就是什么
                        processData: false,
                        success(res) {
                            console.log(res.file);
                            if (res.status == "success") {
                                $("#img").attr("src", `http://localhost:3000/${res.file}`);
                                $("#headpic").attr("src", `http://localhost:3000/${res.file}`);
                                console.log(res);
                                var user = (decodeURI(location.search.slice(1)).split("="))[1];
                                $("#user").text(user);
                                $.post("http://localhost:3000/users/update",{account:user,img:res.file},(res)=>{
                                    console.log(res);
                                })
                            }
                        }
                    })
                    $(this).val(null);
                })
            },
            false(){
                location.href = "login.html";
            }
        };
        fn[islogin.status]();
    })();
    $("#signout").click(()=>{
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