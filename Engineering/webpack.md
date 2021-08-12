## 常用配置

### 前置知识

#### 五个核心概念

1. **Entry**   webpack 以那个文件为入口起点开始打包分析构建内部依赖图
2. **Output**   webpack打包后的资源bundles输出到哪里去，以及如何命名
3. **Loader**   让webpack能够处理非 `javascript`文件
4. **Plugin**    执行范围更广的任务，打包优化 压缩等
5. **Mode**    开发环境和生产环境（默认开启的功能不同）

#### 安装

```shell
npm i webpack webpack-cli -D
```

#### 打包指令

> 开发环境
>
> - 编译打包js和json文件
> - 将es6的模块化语法转换为浏览器能识别的语法

```
webpack 打包前文件路径 -o 指向打包后文件路径 --mode=development
```

> 生产环境
>
> 比开发环境多一个代码压缩的功能

```
webpack 打包前文件路径 -o 指向打包后文件路径 --mode=production
```

> 或者在配置webpack.config.js后

```
webpack
```

### 基本配置模板

> loader中use的执行顺序
>
> - 从右到左
> - 从下到上

```js
const { resolve } = require('path');

module.exports = {
  // 入口文件
  entry: './src/js/index.js',
  // 输出配置
  output: {
    // 输出文件名
    filename: 'built.js',
    // 输出文件路径配置
    path: resolve(__dirname, 'build/js')
  },
  // loader 配置
  module: {
    // 详细的loader 配置 
    // 不同文件必须配置不同loader 处理
    rules: [
      // 不同文件必须配置不同loader 处理 一类文件一个对象
      {
        // 匹配那些文件
        test: /\.css$/,
        // 使用那些解析器
        use: [

        ]
      }
    ]
  },
  plugins: [
    //详细的plugins的配置
  ],

  // 开发模式
  mode: 'development'
  // 热更新等配置
  devServer:{}
}
```

### JS兼容性处理

#### 安装

```shell
npm install babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime  @babel/plugin-proposal-decorators  @babel/plugin-proposal-class-properties @babel/plugin-proposal-private-methods -D
npm install @babel/runtime @babel/runtime-corejs3 -s
```

#### 增加loader配置

> webpack.config.js

```js
  module: {
    rules: [
       // 新增部分
      {
        test: /\.(jsx|js)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
```

> 配置根目录 .babelrc

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
      ["@babel/plugin-transform-runtime", {"corejs": 3}],
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose": true }],
      ["@babel/plugin-proposal-private-methods", { "loose": true }],
      ["@babel/plugin-proposal-private-property-in-object", {"loose": true}]
  ]
}
```

### 打包html

#### 安装

```shell
npm install html-webpack-plugin -D
```

#### 增加plugin配置

> inject 配置
>
> - true ---默认值，script标签位于html文件的 body 底部
> - body---同 true
> - head---script 标签位于 head 标签内
> - false---不插入生成的 js 文件，只是单纯的生成一个 html 文件

```js
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'), // 该属性赋值后 跟着属性去寻找对应文件  并对其内部的资源打包 并复制
      inject: 'body', // 生成的js脚本插入html script标签位于html文件的 body 底部
      scriptLoading: 'blocking', // js加载方式 选项2 defer 异步
    }),
  ],
```

**[插件配置](https://github.com/jantimon/html-webpack-plugin#options)**

### css相关

#### 打包css

##### 安装

```
npm install  style-loader css-loader  -D
```

##### 增加配置

```js
rules: [
    {
        test: /\.css$/,
        use: [
            'style-loader',
            'css-loader'
        ]
    },
```

#### less

##### 安装

```
npm install less-loader  -D
```

##### 增加配置

```js
    rules: [
      // 省略...
      {
        test: /\.(le|c)ss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
    ]
```

#### css 兼容添加前缀

##### 安装

```
npm install autoprefixer postcss postcss-loader -D
```

##### 增加配置

```js
rules: [
      // 省略...
      {
        test: /\.(le|c)ss$/,
        exclude: /node_modules/,
        use: [
          // 省略...
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ["autoprefixer"],
                ],
              },
            },
          }
        ]
      },
    ]
```

#### 打包后抽离css文件

##### 安装

```
npm install mini-css-extract-plugin -D
```

##### 修改配置

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // 省略...
  module: {
    rules: [
      // 省略...
      {
        test: /\.(le|c)ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          // 省略...
        ]
      },
    ]
  },
  plugins: [
    // 省略...
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
}
```

#### 压缩打包后的css

##### 安装

```
npm install optimize-css-assets-webpack-plugin -D
```

##### 修改配置

```js
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // 省略...
  plugins: [
    // 省略...
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new OptimizeCssPlugin(),
  ],
}
```

#### css module解决命名冲突

```js
    rules: [
      // 省略...
      {
        test: /\.(le|c)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                compileType: 'module',
                localIdentName: "[local]__[hash:base64:5]",
              },
            },
          },
          'less-loader'
        ]
      },
    ]
```

### 静态资源

#### js文件

##### 安装

```
npm install copy-webpack-plugin -D
```

##### 配置

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootDir = process.cwd();

module.exports = {
  // 省略...
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '*.js',
          context: path.resolve(rootDir, "public/js"),
          to: path.resolve(rootDir, 'dist/js'),
        },
      ],
    })
  ],
}
```



#### 图片 字体

```js
rules: [
    {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        type: 'asset',
    },
]
```



### 实时更新预览

#### 安装

```
npm install webpack-dev-server -D
```

#### 增加devServer配置

```js
  devServer: {
    port: '3001',
    hot: true,
    stats: 'error-only', // 终端打印 error
    compress: true, //开启gzip压缩
    proxy: {
      '/api': {
        target: '',
        pathRewrite: {
          '/api': '',
        },
      },
    },
  },
```

#### 配置package.json

> script 增加

```json
"dev": "webpack serve  --open",
```

### 错误精确定位

#### 增加配置

```js
// 开发环境 最佳：eval-cheap-module-source-map
// 生产环境 最佳：hidden-source-map 
devtool: 'eval-cheap-module-source-map',
```

### 环境拆分

#### 新建各个环境对应webpack

1. 删除`webpack.config.js`
2. 新建一个目录  存放 开发 、测试、预发、生产几个环境的配置

```js
  + ├── build
  + |    ├── webpack.base.js
  + |    ├── webpack.dev.js
  + |    ├── webpack.pre.js
  + |    ├── webpack.pro.js
```

#### webpack.base.js

> 还是有配置是相同的 所以抽离出一个base.js

- 存放各个环境都要用到的配置
- 抽离出由于环境不同的配置

#### 其他配置文件引用base配置

##### 安装

```
npm install webpack-merge -D
```

##### 使用

```js
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {该环境的配置})
```

#### 修改package.json的命令

:chestnut:

```json
  "scripts": {
    "dev": "webpack serve --config build/webpack.dev.js --open",
    "build:pro": "npx webpack --config build/webpack.pro.js",
  }
```

### 清理上次构建产物

#### 安装

```
npm install clean-webpack-plugin -D
```

#### 增加plugin配置

```js
plugins:[
  new CleanWebpackPlugin()
]
```

### 优化

#### 缓存

> webpack.dev.js 开发环境

```js
cache: {
    type: 'memory'
},
```

> webpack.pro.js

```js
cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
},
```

> 放弃缓存
>
> 增加version属性

```js
cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    },
    version: 'new_version'
},
```

#### 代码拆分

> mode为production时候默认开启如下配置

```js
optimization: {
    splitChunks: {
      chunks: 'all',
    }
}
```

#### 多线程打包

##### 安装

```
npm install thread-loader -D
```

##### 配置

> loader中添加该loader

```js
rules: [
  {
    test: /\.(jsx|js)$/,
    use: ['thread-loader', 'babel-loader'],
    exclude: /node_modules/,
  },
  {
    test: /\.(le|c)ss$/,
    exclude: /node_modules/,
    use: [
      MiniCssExtractPlugin.loader,
      'thread-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            compileType: 'module',
            localIdentName: "[local]__[hash:base64:5]",
          },
        },
      },
      'less-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              ["autoprefixer"],
            ],
          },
        },
      }
    ],
  },
]
```

#### dll动态库引入

##### 创建配置文件 webpack.xx.js

```js
/*
使用dll 技术 对某些库进行单独打包
当你运行webpack时  默认查找webpack.config.js配置文件
运行webpack.dll.js文件 ---》 webpack--config webpack dll.js

*/
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    //最终打包生成的
    //  name:[打包进去的库]
    jquery: ['jquery']
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash]' //打包的库向外暴露出去的内容叫什么名字
  },
  plugins: [
    // 打包生成一个manifest.json  --->提供和打包文件的映射
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: resolve(__dirname, 'dll/manifest.json')
    })
  ],
  mode: 'production'
};
```

##### 打包

> 对库进行单独打包

```shell
webpack--config webpack.xxx.js 命令
```

##### 引入使用

###### 安装

```
npm install  add-asset-html-webpack-plugin -D
```

> plugins配置修改

```json
    // 告诉webpack 那些库不需要打包 
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // 将某个文件打包输出去 并在html中自动引入进去
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve('./dll/jquery.js')
    })
```

