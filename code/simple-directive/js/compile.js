class Compile {
    constructor(vm) {
        this.el = vm.$el;
        this.vm = vm;
        this.compile(this.el);
    }
    // 编译模板，处理文本节点和元素节点
    compile(el) {
        const childNodes = el.childNodes;
        [...childNodes].forEach(node => {
            //处理文本节点
            if (this.isTextNode(node)) {
                this.compileText(node);
            } else if (this.isElementNode) {
                //处理元素节点
                this.compileElement(node)
            }
            //判断node节点，是否有子节点，如果有子节点，要递归调用compile
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }
    // 编译元素节点，处理指令
    compileElement(node) {
        //遍历所有属性节点
        [...node.attributes].forEach(attr => {
            let attrName = attr.name;
            //判断是否是指令
            if (this.isDirective(attrName)) {
                attrName = attrName.substr(2);//去除v-
                const key = attr.value;
                let eventType;
                if (attrName.includes(":")) {
                    eventType = attrName.split(":")[1];
                    attrName = "event"
                }
                this.update(node, key, attrName, eventType)
            }
        })
    }
    update(node, key, attrName, eventType) {
        const updateFn = this[attrName + "Updater"];
        // debugger
        updateFn && updateFn.call(this, node, this.vm[key], key, eventType);//此处必须使用call或apply，因为updateFn的this指向已经不是当前实例了
    }
    //处理v-text
    textUpdater(node, value, key) {
        node.textContent = value;

        //创建watcher对象，当数据改变时更新视图
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue;
        })
    }
    //处理v-model
    modelUpdater(node, value, key) {
        node.value = value

        //创建watcher对象，当数据改变时更新视图
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue;
        })

        //双向绑定
        node.addEventListener("input", () => {
            this.vm[key] = node.value;
        })
    }
    // 编译文本节点，处理差值表达式
    compileText(node) {
        const reg = /\{\{(.+?)\}\}/;
        const value = node.textContent;
        if (reg.test(value)) {
            let key = RegExp.$1.trim();
            node.textContent = value.replace(reg, this.vm[key])

            //创建watcher对象，当数据改变时更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue;
            })
        }
    }
    // 判断元素是否是指令
    isDirective(attrName) {
        return attrName.startsWith("v-");
    }
    // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3;
    }
    // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1;
    }


    //处理v-html
    htmlUpdater(node, value, key) {
        node.innerHTML = value;

        //创建watcher对象，当数据改变时更新视图
        new Watcher(this.vm, key, (newValue) => {
            node.innerHTML = newValue;
        })
    }

    //处理v-on
    eventUpdater(node, value, key, eventType) {
        // debugger
        node.addEventListener(eventType, value);
        new Watcher(this.vm, key, (newValue) => {
            node.removeEventListener(eventType, value);
            value = newValue;
            node.addEventListener(eventType, value);
        })
    }
}