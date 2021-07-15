module.exports = {
  title: "OriX的前端点点滴滴", // 标题
  tagline: "要想有所成就，必须保持耐心，延迟满足", // 标题下面的字
  url: "https://blog.ori8.cn", // 当前页面的url
  baseUrl: "/", // 这里看自己需要添加，如果添加为/win/  访问主页就是 
  onBrokenLinks: "throw", // 只有部署的时候生效
  onBrokenMarkdownLinks: "warn", // 只有部署的时候生效
  favicon: "img/favicon.ico", // 网页标签上面的小logo
  organizationName: "OriX0", // 这里是你github的名字
  projectName: "orix_blog", // 这个是你要部署到的github的项目名字
  themeConfig: {
    // 主题的配置
    navbar: {
      // 头部
      title: "OriX", // h1位置的标题
      logo: {
        alt: "logo",
        src: "img/logo.svg",
      },
      items: [
        // tabs
        {
          to: "docs/React_orix", // 路由
          activeBasePath: "docs", // 路径
          label: "文档",
          position: "right",
        },
        //{ to: "blog", label: "随笔", position: "left" },
        // {to: 'blog', label: '博客', position: 'left'},  看需求可以添加多个tabs
        {
          href: "https://github.com/OriX0", // 自己的github主页
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      // 下面的介绍，看需求
      style: "dark",
      links: [
        {
          title: "学习",
          items: [
            {
              label: "React",
              to: "docs/React_orix",
            },
          ],
        },
        {
          title: "吃我安利",
          items: [
            {
              label: "现代Javascript",
              href: "https://zh.javascript.info/",
            },
            {
              label: "卡颂react",
              href: "https://react.iamkasong.com/",
            },
            {
              label: "飘零的仓库",
              href: "https://github.com/LiangJunrong/document-library/tree/master/",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/OriX0",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OriX.<p><a href="http://beian.miit.gov.cn/" > 浙ICP备19044624号-1</a></p>`, // 版权信息
    },
  },
  presets: [
    // 插件
    [
      "@docusaurus/preset-classic", // 一开始安装的主题
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"), // 这个是点击来之后边上侧边栏的配置
          // Please change this to your repo.
          editUrl:
            "https://github.com/OriX0/orix_blog", // 项目url
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/OriX0/orix_blog",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"), // 主题使用的css
        },
      },
    ],
  ],
};
