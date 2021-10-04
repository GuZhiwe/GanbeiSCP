var articleLang = {
    format(str){
        return str.replace(/</g,"【").replace(/>/g,"】")
    },
    styleStr:`
    .meta{
        width:100%;
        text-align: center;
        font-size: 15px;
        font-weight: 800;
        color:rgb(112, 112, 112);
        font-style: italic;
        margin-bottom: 15px;
    }
    
    .title{
        font-size: 23px;
        font-weight: 900;
        color:rgb(0, 46, 114);
    }
    
    .subtitle{
        font-size: 20px;
        font-weight: 800;
        color:rgb(0, 15, 37);
    }
    
    .splitline{
        background: rgba(31, 31, 31, 0.226);
        height: 1px;
        margin:10px 0px;
    }

    .gray{
        color:rgb(112, 112, 112);
    }

    .content{
        overflow: scroll;
    }
    .content a{
        pointer-events: none;
    }

    .warn{
        color:red;
        width:100%;
        text-align: center;
        font-size: 15px;
        font-weight: 800;
    }
    `,
    addStyle(){
        let dom=document.createElement("style")
        dom.innerText=this.styleStr
        document.body.appendChild(dom)
    },
    lang2html(str) {
        let lines = str.split("\n");
        let result = ``;
        for (let i of lines) {
            i = i.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
            let splited = i.split(" ");
            let data = splited.slice(1).join(" "), formatted = this.format(data)
            switch (splited[0]) {
                case "#meta": {
                    result += `<div class="meta">${formatted}</div>`
                    break;
                }
                case "#gray": {
                    result += `<div class="gray">${formatted}</div>`
                    break;
                }
                case "#warn": {
                    result += `<div class="warn">${formatted}</div>`
                    break;
                }
                case "#": {
                    result += `<div class="title">${formatted}</div>`
                    break;
                }
                case "##": {
                    result += `<div class="subtitle">${formatted}</div>`
                    break;
                }
                case "----": {
                    result += `<div class="splitline"></div>`
                    break;
                }
                default: {
                    result += `<div class="content">${i}</div>`
                    break;
                }
            }
        }
        return result;
    }
}

articleLang.addStyle()