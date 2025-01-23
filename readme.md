# xiali-react-ueditor

使用 react 框架对 ueditor 进行封装和扩展

根据[react-ueditor](https://github.com/ifanrx/react-ueditor)进行调整


### ✨ 特性

- 支持更灵活的图片和音视频资源上传
- 支持同个页面存在多个编辑器实例
- 支持对复制进来的图片进行操作
- 允许扩展工具栏，支持在扩展中使用已有的 react 组件
- 全部采用tsx的语法进行重写



### 📦 下载

```
# 使用 npm 安装
npm install xiali-react-ueditor --save

# 使用 yarn 安装
yarn add xiali-react-ueditor
```


### 🔨 使用

```
import ReactUeditor from 'xiali'

<ReactUeditor
  ueditorPath={`${window.YOUR_PATH}/ueditor`}"
/>
```

### 🔌 插件

> extendControls 已不推荐使用，请直接使用 plugins，指定插件。

插件分为两种，一种是内置的插件，一种是自定义的插件。现支持内置插件如下：

1. insertCode  插入代码块
2. uploadImage  上传图片
3. uploadVideo  上传视频
4. uploadAudio  上传音频
5. insertLink  添加链接

内置插件，直接传入插件的名称即可。自定义插件则是传入一个 Function，类型定义（使用 typescript 只为了说明类型）为：

```typescript
interface IPlugin {
  (ueditor: UEditor): IPluginConfig
}

interface IPluginConfig {
  cssRules: String
  menuText: String
  onIconClick?: () => void
  render: (visible: Boolean, closeModal: () => void) => React.ReactElement<any>
  title?: String
}
```

UEditor 为 UEditor 实例。详细内容，请参考[官方文档](https://fex-team.github.io/ueditor/)

#### 插件使用示例

1. 内置插件

    ```javascript
    <ReactUeditor
      ...
      plugins={[
        'insertCode',
        'uploadImage',
        'uploadVideo',
        'uploadAudio',
        'insertLink',
      ]}
      ...
    />
    ```

2. 自定义插件

    ```javascript
    const uploadImagePlugin = ueditor => {
      return {
        menuText: '图片上传',
        cssRules: 'background-position: -726px -77px;',
        render: (visible, closeModal) => {
          const handleSelectImage = (url) => {
            ueditor.focus()
            ueditor.execCommand('inserthtml', `<img src="${url}" />`)
            closeModal()
          }
          return <Modal visible={visible} onSelectImage={handleSelectImage} />
        }
      }
    }

    <ReactUeditor
      ...
      plugins={[uploadImagePlugin]}
      ...
    />
    ```

## 🤝 贡献

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" >
        <a href="https://github.com/blackboy1987">
          <img src="https://avatars.githubusercontent.com/u/6405701" width="75px" height="75px"><br/>
          <sub>blackboy1987</sub>
        </a>
      </td>
    </tr>
  </tbody>
</table>

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

如果你希望为这个项目贡献代码，需要了解以下情况：

- 在根目录下执行 `yarn start` 会启动开发服务器，此时会在浏览器中展示 ReactUeditor 的真实效果，在 ReactUeditor/ 下的修改都会进行热更新

- example.js, index.html, dist/ 都只是为了展示 ReactUeditor 的真实效果，主要代码在 ReactUeditor/ 中

- 需要修改 ueditor 源码时，直接修改 ueditor 目录下的文件，修改完执行：`cd ueditor` 和 `yarn grunt` 命令，此时会重新生成 ueditor 构建成功的文件到 vendor/ueditor
