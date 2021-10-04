let frame = document.querySelector("iframe")

frame.src = document.location.hash.slice(1)
if (!document.location.hash || document.location.hash == "/") {
    document.location.hash = "/frontpage/"
    document.location.reload()
}

let lastHash = document.location.hash

let isBrowserHashChange = false

window.onhashchange = function () {
    isBrowserHashChange = true;
    console.log(document.location.hash, !document.location.hash || document.location.hash == "#/")
    if (!document.location.hash || document.location.hash == "#/") {
        document.location.hash = "/frontpage/"
        document.location.reload()
    }
    if (document.location.hash.slice(1) != frame.src) {
        frame.src = document.location.hash.slice(1)
    }
}

function wait(ms) {
    return new Promise((rs => { setTimeout(rs, ms) }))
}


document.querySelector(".icon").onclick = async function () {
    let permission = true;
    fetch("/api_authed/test",{
        method: "POST",
        body:JSON.stringify({id:localStorage.id})
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error(response.status)
        } else {
            if(frame.contentWindow.location.pathname == "/manage/")frame.src = "/frontpage/"
            else frame.src = "/manage/"
        }
    }).catch(() => {
        frame.src = "/login/"
    });
}

function jump(url){
    frame.src=url
}


!(async function () {
    while (await wait(100)) {
        if (document.location.hash.slice(1) != frame.contentWindow.location.pathname) {
            await wait(100)

            if (!isBrowserHashChange) {
                document.location.hash = frame.contentWindow.location.pathname
            }
            isBrowserHashChange = false
        }
    }
})()