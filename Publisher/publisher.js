var event = (function(){
    var _nsList = {},
        _defaultNs = '__default__';

    function useNamespace(ns) {
        if(ns === undefined && _nsList[_defaultNs]) return _nsList[_defaultNs];
        if(_nsList[ns]) return _nsList[ns]

        var method = {
            sub: {},
            preEvent: {}, // key:[[args],[args],...]
            listen: function(key, fn) {
                if(!this.sub[key]) {
                    this.sub[key] = [];
                }
                this.sub[key].push(fn);
                // 如果有已经发生了的事件就立刻执行
                if(this.preEvent[key]) {
                    this.preEvent[key].forEach(function(args, index){
                        fn.apply(fn, args)
                    })
                    this.preEvent[key] = null;
                }
            },
            trigger: function() {
                var args = [];
                for(var i=0,l=arguments.length;i<l;i++){
                    args.push(arguments[i])
                }
                key = args.shift();
                if(!this.sub[key]) {
                    // 预发布事件
                    if(!this.preEvent[key]) this.preEvent[key] = [];
                    this.preEvent[key].push(args)
                } else if(this.sub[key].length > 0){
                    // 正常trigger
                    this.sub[key].forEach(function(fn, index){
                        fn.apply(fn, args);
                    });
                }
            },
            once: function(key, fn) {
                // 如果存在预发布的事件，那么就直接执行，并且不用监听了
                if(this.preEvent[key]) {
                    this.preEvent[key].forEach(function(args, index){
                        fn.apply(fn, args)
                    })
                    this.preEvent[key] = null;
                    return;
                }
                // 为了能够外部调用remove来手动删除
                if(!this.sub[key+'_once']) this.sub[key + '_once'] = [];
                this.sub[key + '_once'].push(fn);
                var that = this;
                var onceFn = function() {
                    that.remove(key, onceFn, that.sub)
                    fn.apply(that, arguments)
                }
                this.listen(key, onceFn, this.sub)
            },
            remove: function(key, fn) {
                if(!this.sub[key] || this.sub[key].length === 0) return;
                if(!fn) this.sub[key] = [];
                else {
                    for(var i=this.sub[key].length;i--;){
                        if(this.sub[key][i] === fn) {
                            this.sub[key].splice(i, 1);
                            return;
                        }
                    }
                    // 检查once的监听列表
                    if(!this.sub[key+'_once'] instanceof Array) return;
                    for(i=0,l=this.sub[key+'_once'].length;i<l;i++){
                        if(this.sub[key+'_once'][i] === fn) {
                            this.sub[key].splice(i, 1);
                            return;
                        }
                    }
                }
            },

        }
        if(ns === undefined) return _nsList[_defaultNs] = method;
        return _nsList[ns] = method;
    }
    return {
        defaultNs: useNamespace(),
        listen: function(key, fn) {
            this.defaultNs.listen(key, fn)
        },
        once: function(key, fn) {
            this.defaultNs.once(key, fn)
        },
        remove: function(key, fn) {
            this.defaultNs.remove(key, fn)
        },
        trigger: function(key, args) {
            this.defaultNs.trigger.apply(this.defaultNs, arguments)
        },
        useNamespace: useNamespace,
    }
}())

// 预发布
event.trigger('test', 10,213)
// 监听
var test;
event.listen('test', test = function(num,num2){
    console.log('testnum:',num,num2);
})
event.listen('test', function(msg){console.log(msg)})
event.once('test', function(msg){console.log('once', msg)})
// 触发三个事件
event.trigger('test', 11,0)
// 删除事件1
event.remove('test', test)
// 触发事件2
event.trigger('test', 222, 222)