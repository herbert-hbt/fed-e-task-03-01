# 整体流程总结

* new Vue()时
* 将option的data代理到vue上
* 将data中数据转为响应式对象 -> new Observer()
    - 将属性用getter/setter递归重写，
        - 在getter中，必要时收集观察者watcher -> Dep.addSub()
            - addSub：将watcher存储到实例属性中去，需要传入update方法
        - 在setter中，
            - 观察对象通知观察者更新视图 -> Dep.notify()
                - notify：遍历实例属性，调用watcher的update方法
            - 当值由简单类型改为复杂类型，重新将其转为响应式对象
    - 创建观察对象new Dep()
        - 创建观察对象时：初始化实例属性
* 执行模板编译 -> new Compiler() -> 从挂载的根节点开始递归遍历所有节点，针对不同类型节点分别处理
    - 差值表达式
        - 使用正则匹配替换
        - 创建watcher实例，传入更新回调 -> new Watcher()
            - 通过获取某属性值的形式，触发getter方法，将watcher添入该属性的被观察对象中去
    - 指令
        - v-text
            - 填入属性值
            - 通过获取某属性值的形式，触发getter方法，将watcher添入该属性的被观察对象中去
        - v-model
            - 填入属性值
            - 通过获取某属性值的形式，触发getter方法，将watcher添入该属性的被观察对象中去
            - 监听改变函数，事项双向绑定

# 作业思路

## v-html

* 添加html处理函数

``` 
//处理v-html
htmlUpdater(node, value, key) {
    node.innerHTML = value;

    //创建watcher对象，当数据改变时更新视图
    new Watcher(this.vm, key, (newValue) => {
        node.innerHTML = newValue;
    })
}
```

## v-on

1. 将methods代理到vue上
2. 将methods转为响应式数据

``` 
this._proxyData(this.$methods);
new Observer(this.$methods);
```

3. 将所有v-on的指令的attrName转为"event"，并构造相应需要监听的事件名

``` 
let eventType;
if (attrName.includes(":")) {
    eventType = attrName.split(":")[1];
    attrName = "event"
}
this.update(node, key, attrName, eventType)
```

4. 定义eventUpdater函数

``` 
//处理v-on
eventUpdater(node, value, key, eventType) {
    node.addEventListener(eventType, value);
    new Watcher(this.vm, key, (newValue) => {
        node.removeEventListener(eventType, value);
        value = newValue;
        node.addEventListener(eventType, value);
    })
}
```
