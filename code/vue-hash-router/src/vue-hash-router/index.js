let _Vue = null;

export default class VueHashRouter {
  constructor(options) {
    this.options = options;
    this.routeMap = {};
    this.data = _Vue.observable({
      current: "/"
    }); //data必须为响应式的
  }

  static install(Vue) {
    //1. 判断当前插件是否已经安装
    if (VueHashRouter.install.installed) {
      return;
    }
    VueHashRouter.install.installed = true;
    //2. 把vue的构造函数记录到全局变量中去，以为在vueRouter的实例方法中需要用到（router-view、router-link组件的创建需要用到vue.component）
    _Vue = Vue;
    //3. 把创建vue时传入的router对象注入到所有的vue实例中去（this.$router这些）
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
          this.$options.router.init();
        }
      }
    });
  }
  init() {
    this.createRouteMap();
    this.initComponent(_Vue);
    this.initEvent();
  }
  createRouteMap() {
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component;
    });
  }
  initComponent(vue) {
    const self = this;
    vue.component("router-link", {
      props: {
        to: String
      },
      methods: {
        clickHandler(e) {
          location.hash = this.to;//此处无需改变current的data，统一由hashchange事件处理
          e.preventDefault();
        }
      },
      render(h) {
        return h(
          "a",
          {
            attrs: {
              href: this.to
            },
            on: {
              click: this.clickHandler
            }
          },
          [this.$slots.default]
        );
      }
    });
    vue.component("router-view", {
      render(h) {
        const component = self.routeMap[self.data.current];
        return h(component)
      }
    })
  }
  initEvent() {
    window.addEventListener("hashchange", () => {
      this.data.current = location.hash.substr(1);
    })
  }
}
