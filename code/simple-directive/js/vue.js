class Vue {
    constructor(options) {
        //1. 通过属性保存传入参数的数据项
        this.$options = options || {};
        this.$data = options.data || {};
        this.$methods = options.methods || {};
        this.$el = typeof options.el === "string" ? document.querySelector(options.el) : options.el
        //2. 把data中的成员转为getter、setter，并注入到vue实例中去
        this._proxyData(this.$data);
        //5. 把methods中的成员转为getter、setter，并注入到vue实例中去，并将其转为响应式对象
        this._proxyData(this.$methods);
        new Observer(this.$methods);
        //3. 调用observable对象，监听数据变化
        new Observer(this.$data);
        //4. 调用compiler对象，解析指令和插值表达式
        new Compile(this);

        
    }
    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (data[key] === newValue) {
                        return;
                    }
                    data[key] = newValue
                }
            })
        })
    }
}