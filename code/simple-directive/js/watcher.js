class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        //data中的属性名称
        this.key = key;
        //回调函数负责更新视图
        this.cb = cb;

        //把watcher对象记录到Dep类的静态属性target
        Dep.target = this;
        this.oldValue = vm[key];//通过获取属性值：vm[key]，达到调用getter添加依赖的功能
        Dep.target = null;//添加后需要置空，防止再次访问是重复添加watcher
    }
    //数据发生变化时，更新视图
    update() {
        const newValue = this.vm[this.key];
        if (newValue === this.oldValue) {
            return;
        }
        this.oldValue = newValue;//此处不可少，否则是每次与初始值的比较
        this.cb(newValue);
    }
}
