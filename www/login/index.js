document.querySelector(".loginBtn").onclick=async ()=>{
    parent.swal.showLoading();
    let result=await(
        await fetch(`/api/login?account=${document.querySelector("input.account").value}&password=${document.querySelector("input.password").value}`
        )).text()
    if(result=="Wrong password or account"){
        parent.swal.fire({
            title:"登录失败",
            text:"账号或密码错误，请重试~"
        })
    }else{
        localStorage.id=result
        parent.swal.close()
        document.location.href="/frontpage/"
    }
    
}