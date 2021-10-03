import Koa from "koa";
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import * as koaStatic from "koa-static"
import * as bcrypt from "bcrypt"
import * as koabody from "koa-body"
import * as jwt from "jsonwebtoken"

const __dirname = dirname(fileURLToPath(import.meta.url));
const adapter = new JSONFile(__dirname + "/db.json")
const db = new Low(adapter)
await db.read()
db.data ||= {
    posts: [], users: []
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function atob(base64) {
    return Buffer.from(base64, "base64").toString()
}


let app = new Koa()


app.use(koaStatic.default(__dirname + "/www"))
app.use(koabody.default({}))
let id_user = {}

app.use((ctx) => {
    try {
        ctx.request.json = JSON.parse(ctx.request.body);
    } catch (e) { ctx.request.json = {} }
    if (ctx.path == "/api/login") {
        let user = {};
        for (let i = 0; i < db.data.users.length; i++) {
            let account = db.data.users[i];
            if (account.account == ctx.query.account
                && bcrypt.compareSync(ctx.query.password, account.password)) {

                let id = makeid(36);
                for (let ids in id_user) {
                    if (id_user[ids] == i) delete id_user[ids]
                }
                id_user[id] = i
                ctx.body = id;
                return;
            }
        }
        ctx.body = "Wrong password or account"
    }
    if (ctx.path == "/api/reg") {
        try{
            let result=jwt.default.verify(ctx.request.json.code,'your key here')
            if(result.invite=="yes"){
                console.log(ctx.request.json)
                db.data.users.push({
                    account: ctx.request.json.account,
                    password: bcrypt.hashSync(ctx.request.json.password,10),
                    qq:result.qq
                })
                db.write()
                ctx.body="succeed"
                return;
            }
        }catch(e){}
        ctx.body="failed"
        return;
    }

    if (ctx.path == "/api/post") {
        if (db.data.posts[ctx.query.id]) {
            ctx.body = {
                content: db.data.posts[ctx.query.id].content,
                title: db.data.posts[ctx.query.id].title
            };
        }
    }
    if (ctx.path == "/api/all_posts") {
        let tmp = [];
        for (let i = 0; i < db.data.posts.length; i++) {
            let e = db.data.posts[i]
            tmp.push({
                title: e.title,
                creator: e.creator,
                id: i,
                lastModify: e.lastModify
            })
        }
        ctx.body = JSON.stringify(tmp)
    }
    if (ctx.path.startsWith("/api_authed/")) {
        
        let qid = ctx.query.id || ctx.request.json.id
        let userid = id_user[qid], user = db.data.users[userid];
        if (user) {
            ctx.res.statusCode = 200
            switch (ctx.path) {
                case "/api_authed/add_post": {
                    ctx.body = db.data.posts.length
                    db.data.posts.push({
                        content: ctx.request.json.content,
                        lastModify: new Date().getTime(),
                        creator: user.account,
                        title: ctx.request.json.title,
                        history: [
                            {
                                time: new Date().getTime(),
                                action: "create",
                                user: user.account,
                                content: ctx.request.json.content,
                                title: ctx.request.json.title,
                            }]
                    })

                    db.write()
                    break;
                }
                case "/api_authed/edit_post": {
                    db.data.posts[ctx.request.json.pid].content =
                        ctx.request.json.content
                    db.data.posts[ctx.request.json.pid].lastModify = new Date().getTime()
                    db.data.posts[ctx.request.json.pid].title=ctx.request.json.title
                    db.data.posts[ctx.request.json.pid].history.push(
                        {
                            time: new Date().getTime(),
                            action: "edit",
                            user: user.account,
                            title: ctx.request.json.title,
                            content: ctx.request.json.content
                        })
                    db.write()
                    ctx.res.statusCode = 200
                    break;
                }
            }
        } else {
            ctx.res.statusCode = 401
        }
    }
})


app.listen(80);