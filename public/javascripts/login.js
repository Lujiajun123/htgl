$(()=>{
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
    let login = (inputEmail, inputPassword) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/users/login",
                data: {
                    inputEmail,
                    inputPassword
                },
                success(data) {
                    resolve(data)
                }
            })
        })
    }
    (async () => {
        let islogin = await autologin();
        // console.log(islogin);
        let fn = {
            true(user) {
                location.href = "main.html?user="+user.payload.data.inputEmail;
            },
            false() {
                console.log("token fail");
            }
        }
        fn[islogin.status](islogin.user);
    })();
    $("#btn").on("click",async ()=>{
        let inputEmail = $("#inputEmail").val();
        let inputPassword = $("#inputPassword").val();
        let data = await login(inputEmail, inputPassword);
        // if (data.status === 'fail') {
        //     alert("账号或密码错误");
        //     window.location.reload();
        // } else if(data.status === 'success'){
        //     console.log(data.token);
        //     localStorage.setItem("token",data.token);
        //     location.href="main.html";
        // }
        let fn = {
            success(){
                localStorage.setItem("token",data.token);
                location.href="main.html?user="+encodeURI(inputEmail);
            },
            fail(){
                alert("账号或密码错误");
                window.location.reload();
            }
        }
        fn[data.status]();
    })
})