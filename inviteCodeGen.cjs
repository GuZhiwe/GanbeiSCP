var jwt = require('jsonwebtoken');
let input = require("input")
!(async function () {
    let qq = await input.text('QQ Number');
    console.log(jwt.sign({ invite: 'yes', qq },
        'your key here', { expiresIn: '1d' }))
})()