(async () => {
    parent.swal.showLoading();
    let posts = await (await fetch("/api/all_posts")).json()
    parent.swal.close();
    let html = ""
    for (let i of posts) {
        html += `
        <div class="post" data-id="${i.id}">
            <span class="post-title">${i.title}<i style="font-size:12px;">(${i.id})</i></span>
            <span class="post-time">${new Date(i.lastModify).toLocaleDateString()}</span>
            <span class="post-user">${i.creator}</span>
        </div>
        `
    }
    html += `
        <div class="new-post">
            <span class="post-title">+</span>
           新建投稿
        </div>`
    document.querySelector('.posts').innerHTML = html
    let postsEle=document.querySelectorAll('.post')
    for(let i of postsEle){
        i.onclick=()=>{
            parent.document.location.hash="/editor/?id="+i.dataset.id
        }
    }
    document.querySelector(".new-post").onclick = async function () {
        parent.swal.showLoading();
        let newpost = await (await fetch("/api_authed/add_post", {
            body: JSON.stringify(
                {
                    id: localStorage.id,
                    content: "",
                    title: "New Post"
                }),
            method: "POST",
        })).text()
        parent.swal.close();
        document.location.href="/editor/?id="+newpost
    }
})()