window.onload = function () {
    $('.btn').click(function () {
        domReady(abc);
        $('.chat').append('<div class="test">HelloWorld</div>');
        $('.test').append('<div class="age">World</div>');
    });

    function abc() {
        console.log("dom改变了");
    }
};


let domReady = function (callback, article, options, times) {
    article = article || document.body;
    options = options || {'childList': true, 'attributes': true, 'characterData': true, 'subtree': true};
    times = !times;
    let execute = function () {
        callback();
        if (times) {
            // 清除历史监听记录
            observer.takeRecords();
            // 断开连接
            observer.disconnect();
        }
    };
    let observer = new MutationObserver(execute);
    observer.observe(article, options);
};