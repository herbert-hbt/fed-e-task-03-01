# 步骤

1. yarn init -y
2. yarn add parcel-bundler 
3. 配置package.json

``` 
"scripts":{
    "dev":"parcel index.html",
    "build":"parcel build index.html"
}
```
4. yarn add snabbdom@0.7.4
5. 参照样例写