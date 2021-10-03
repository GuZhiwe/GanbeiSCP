function $(selector, first) {
    let result = document.querySelectorAll(selector);
    if (first) return result[0];
    return result;
}

(async () => {
    let result = await (
        await fetch(`/api/post?id=` + /id=(\S+)/.exec(document.location.search)[1]
        )).json()
    $("body", 1).innerHTML = articleLang.lang2html(result.content)
    articleLang.addStyle()
})()