


let sim = document.createElement("div")
sim.style.opacity = "0"
sim.style.position = "absolute"
sim.style.left = "0px"
sim.style.fontSize = "13.3333px"
// sim.style.fontFamily=""
sim.style.top = "0px"
sim.style.pointerEvents = "none"
document.body.appendChild(sim)
let cursorLine;
let editor = document.querySelector(".editor")
let title=document.querySelector(".post-title")
setInterval(() => {
    let val = editor.value
    let lines = val.split('\n')
    let sel = editor.selectionStart
    let now = 0;

    for (cursorLine = 0; now < sel; cursorLine++)
        now += lines[cursorLine].length + 1;

    let height = (60 + sim.clientHeight - editor.scrollTop)

    if (cursorLine == 0 || height > (editor.clientTop + editor.clientHeight + 30))
        document.querySelector(".selectedLine").style.display = "none";
    else document.querySelector(".selectedLine").style.display = ""
    sim.innerText = val.slice(0, sel)
    document.querySelector(".selectedLine").style.top = height + "px"
}, 10)

function updatePreview() {
    document.querySelector(".preview").innerHTML =
        articleLang.lang2html(document.querySelector(".editor").value)
}

document.querySelector(".editor").addEventListener("keyup", updatePreview)


function currentLineAddFlag(flagsymbol, flags = ["#", "----", "##", "#meta","#gray"], space = " ") {
    let nowStart = editor.selectionStart, nowEnd = editor.selectionEnd
    let val = editor.value
    let lines = val.split('\n')
    let curLine = lines[cursorLine - 1]
    let flag = curLine.split(' ')[0];
    console.log(curLine, flag)
    if (flag == flagsymbol) curLine = curLine.split(" ").slice(1).join(" ");
    else if (flags.includes(flag)) {
        curLine = curLine.split(" ").slice(1).join(" ")
        curLine = flagsymbol + space + curLine
    } else {
        curLine = flagsymbol + space + curLine
    }
    while (curLine.startsWith(" ")) curLine = curLine.slice(1)
    lines[cursorLine - 1] = curLine
    editor.value = lines.join("\n")
    editor.selectionStart = nowStart - (val.length - editor.value.length)
    editor.selectionEnd = nowEnd - (val.length - editor.value.length)
    updatePreview()
}


document.querySelector(".btns .gray").onclick = () => { currentLineAddFlag("#gray") }
document.querySelector(".btns .metadata").onclick = () => { currentLineAddFlag("#meta") }
document.querySelector(".btns .title").onclick = () => { currentLineAddFlag("#") }
document.querySelector(".btns .subtitle").onclick = () => { currentLineAddFlag("##") }
document.querySelector(".btns .splitline").onclick = () => { currentLineAddFlag("----\n", [], "") }
document.querySelector(".btns .bold").onclick = () => {
    let val = editor.value

    //当前字符
    let nowChar = editor.value[editor.selectionStart]
    if (!nowChar) return;

    //后续恢复选择区域用
    let nowStart = editor.selectionStart, nowEnd = editor.selectionEnd

    //判断字符类型是否相同
    function isSame(char, char2) {
        function charType(char) {
            if (!char) return "non-ascii|not-empty|not-symbol|not-number"
            let ct = "";
            if (char.charCodeAt(0) > 255) ct += "non-ascii|";
            else ct += "ascii|"

            if (/\s/.test(char)) ct += "empty|";
            else ct += "not-empty|"

            if (",./;'\\@#$%^&*()_+-=[]~!".split("").includes(char)) ct += "is-symbol|"
            else ct += "not-symbol|"

            if ("1234567890".split("").includes(char)) ct += "is-number"
            else ct += "not-number"

            return ct;
        }
        return charType(char) == charType(char2)
    }
    //智能加粗选区范围：start - end
    let start = editor.selectionStart, end = editor.selectionStart;

    //往前往后拓展直到第一个不同类型的字符
    for (start; isSame(nowChar, val[start]) && start >= 0; start--); start++;
    for (end; isSame(nowChar, val[end]) && end < val.length; end++); end--;

    //加粗
    let after = `${val.slice(0, start)}**${val.slice(start, end + 1)}**${val.slice(end + 1)}`;
    editor.value = after;

    //复原选区
    editor.selectionStart = nowStart - (after.length - editor.value.length)
    editor.selectionEnd = nowEnd - (after.length - editor.value.length)
    updatePreview()
}

let pid=/id=(\S+)/.exec(document.location.search)[1]

document.querySelector(".btns .upload").onclick = async () => {
    parent.swal.showLoading();
    let result = (await fetch("/api_authed/edit_post", {
        body: JSON.stringify({
            id: localStorage.id, content: editor.value
            , title: title.value, pid
        }),
        method: "POST",
    })).status
    parent.swal.close()
}

document.querySelector(".btns .back").onclick  =
()=>{document.location.href=document.referrer}

(async () => {
    parent.swal.showLoading();
    let result = await (
        await fetch(`/api/post?id=` + pid
        )).json()

    editor.value = result.content;
    title.value = result.title
    updatePreview()
    parent.swal.close()
})()

