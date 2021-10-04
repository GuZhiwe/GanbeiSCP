(async () => {
    parent.swal.showLoading();
    let posts = await (await fetch("/api/all_posts")).json()
    parent.swal.close();
    let html = ""
    for (let i of posts) {
        html += `
        <div class="post" data-id="${i.id}">
            <span class="post-title">${i.title}</span>
            <span class="post-time">${new Date(i.lastModify).toLocaleDateString()}</span>
            <span class="post-user">${i.creator}</span>
        </div>
        `
    }
    document.querySelector('.posts').innerHTML = html
    let postsEle=document.querySelectorAll('.post')
    for(let i of postsEle){
        i.onclick=()=>{
            parent.document.location.hash="/post/?id="+i.dataset.id
        }
    }
})()