class Observer {
    constructor(data) {
        this.walk(data);
    }
    walk(data) {
        // 1. 判断data是否是对象
        if (!data || typeof data !== "object") {
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive(obj, key, val) {
        const that = this;
        const dep = new Dep();//负责收集依赖，并发送通知
        this.walk(val);
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                //收集依赖
                Dep.target && dep.addSub(Dep.target)
                return val//此处的val会被闭包缓存住
            },
            set(newValue) {
                if (val === newValue) {
                    return;
                }
                val = newValue//由于val被闭包缓存下来，所以此处不可省略，必须要改变val才行，否则一直会是初始值
                that.walk(newValue);
                //发送通知
                dep.notify();
            }
        })
    }
}