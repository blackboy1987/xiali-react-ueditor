import React, { Component } from 'react';
import Link from './Link';
import Modal from './Modal';
import VideoUploader from './VideoUploader';
import AudioUploader from './AudioUploader';
import * as utils from './utils';

const MODE = {
  INTERNAL_MODAL: 'internal-modal',
  MODAL: 'modal',
  NORMAL: 'normal',
};

function isModalMode(mode: string): boolean {
  return mode === MODE.INTERNAL_MODAL || mode === MODE.MODAL;
}

const simpleInsertCodeIcon = 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB9klEQVRYR+2Wy23CQBCGZxwUASdKgA7IIdIukhF0QCoI6YAS6CB0EDpIOgjCEbs3nApCB+EEKFI80ToYgR/7IEhIEb4hvPN/8/jHi3DmB8+sDxeA/1GBdosNiTAMhHhxnamTVMDnfAEAo0CI0ckBOs1mbRKGy6LArdZtswSl+VdEDSmlAtk9prPqRW0FfMb66OGjt1o3iiB8zgcAMAiEqKfFo0p5QQSDQMpxUQKFAFvxJ4roQRfA52yCgOFUCAVy8NjEyAWwOaiUVImjauWTCO6KBtAUKwNgOrCfos95DxGepzNh08rcah4cdBFXID5nY0CsBTPRM01/UewdgKu4EmxztiTAoa398jRigGPEdfbTVSOthUkfTdOeDrrdfv20/UytSCeMKhAQ3HvrzY1u4WQs1mIhEk7y7GeCiN1TKc8J8R3Vj+9qWXmZvNW6awOR2C+KqPsm5cQkmFlQ1corAeHVatOJZ8AVIu4jwmgqZO0v4irZnQtcIFzslwBuq7bLPKn0wR6whYjtZ9jxurLvtzmzwUwQrvYryjwBzF2hOojYfgC9YCabpv6bxLWf4yII39J+NuLG+8BvkPJgOpND9TJjrH7t4Yet/VS1vNVmpLO205XsWPvpWuUGoD6/AJ1jtp/zjcg0YKf636kCpxLdj3MBOHsFfgBLLaBN8r49lAAAAABJRU5ErkJggg==';
const uploadAudioIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACBUlEQVRYR+1VwXHbMBC8qyBxBXI6cCqwUkEOFUSuIHYFliuwUoGVCrAdWOlA6UCuIOpgPashNRQIOtJkHH2ID2eIA25vD7vndublZ85vI4CRgZGBkxmIiI9mdm9mMzNbAHgYknJEzM3sA4C7oZiTAEREmNmTuwvEi5lNSH4GsK4liIiFu38nuQRwU4s5CkBTtRILwAvJWzPbuvszyS8AVhFxZWbXAH50E0XE0t2/kbwBsCxBVAFExKW7TxRMUhfPVTVJXT4HsI2IaQHg1t0fFQNAAPcrpbQhqVZc/BWAaHb3XASq6pkqbf+XAPQ/pQQz+9qy0omdufsTyQRAMfvVYyClpCSXLc1N5FpVF9QeMKA9tcrd/5D8CUCPdLc6/3vsDAGwnPP0rUFVY6BhYUVyAuBT0QYVsC7vfQ8AuzbknA/ubpjtFfYeANTCq5yzpNp9iJLq9n8wIKpXOWdJtguA5dvQZpUB9dDdd1pXEMnfRz5CyfW+1HyrrJoX9ADUZEhyY2YykkEZds79KmnuyPOiLGTIiNQ/GZCWTGkhTyep78OAEck/Zo1f7CXbUUtPgtUW1KTX6Fg2KpPR5fL1AyseONfODhnZtKz+aAAdQ1GVYkFDaOPuMqzBYdRITxZeTX4ygNbVmtkgujWONXKrqxliVqu8PXDUNHzLEf91bwQwMjAycHYGXgGLbI8w70amwwAAAABJRU5ErkJggg==';

interface PluginConfig {
  menuText: string;
  cssRules?: string;
  mode?: string;
  onIconClick?: () => void;
  render?: () => JSX.Element;
  onConfirm?: () => void;
  onClose?: () => void;
  beforeClose?: () => boolean | void;
  zIndex?: number;
  alignStyle?: React.CSSProperties;
  component?: JSX.Element;
}

interface Props {
  value?: string;
  ueditorPath: string;
  plugins?: Array<string | ((ueditor: any) => PluginConfig)>;
  onChange?: (content: string) => void;
  uploadImage?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<string | string[]>;
  getRef?: (ueditor: any) => void;
  multipleImagesUpload?: boolean;
  onReady?: () => void;
  pasteImageStart?: (amount: number) => void;
  handlePasteImage?: (src: string) => Promise<string>;
  pasteImageDone?: () => void;
  extendControls?: PluginConfig[];
  debug?: boolean;
  uploadVideo?: (file: File) => Promise<{ url: string; html: string }>;
  uploadAudio?: (file: File) => Promise<{ url: string; html: string }>;
  progress?: (progress: number) => void;
}

interface State {
  videoSource: string;
  audioSource: string;
  extendControls: PluginConfig[];
  videoHtml: string;
  audioHtml: string;
  linkHtml: string;
  pluginsWithCustomRender: { name: string; config: PluginConfig }[];
  [key: string]: boolean | string | PluginConfig[];
}

class ReactUeditor extends Component<Props, State> {
  content: string;
  ueditor: any;
  isContentChangedByWillReceiveProps: boolean;
  tempfileInput: HTMLInputElement | null;
  containerID: string;
  fileInputID: string;
  pasteImageAmount: number;

  constructor(props: Props) {
    super(props);
    this.content = props.value || '';
    this.ueditor = null;
    this.isContentChangedByWillReceiveProps = false;
    this.tempfileInput = null;
    this.containerID = 'reactueditor' + Math.random().toString(36).substr(2);
    this.fileInputID = 'fileinput' + Math.random().toString(36).substr(2);
    this.pasteImageAmount = 0;
    this.state = {
      videoSource: '',
      audioSource: '',
      extendControls: this.props.extendControls ? this.props.extendControls : [],
      videoHtml: '',
      audioHtml: '',
      linkHtml: '',
      pluginsWithCustomRender: [],
    };
  }

  componentDidMount() {
    const { ueditorPath } = this.props;
    if (!window.UE && !window.UE_LOADING_PROMISE) {
      window.UE_LOADING_PROMISE = this.createScript(ueditorPath + '/ueditor.config.js').then(() => {
        return this.props.debug
          ? this.createScript(ueditorPath + '/ueditor.all.js')
          : this.createScript(ueditorPath + '/ueditor.all.min.js');
      });
    }
    window.UE_LOADING_PROMISE.then(() => {
      this.tempfileInput = document.getElementById(this.fileInputID);
      this.initEditor();
    });
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if ('value' in nextProps && nextProps.value !== prevState.value) {
      return {
        ...prevState,
        value: nextProps.value,
      };
    }
    return null;
  }

  componentWillUnmount() {
    if (this.ueditor) {
      this.ueditor.destroy();
    }
  }

  createScript = (url: string) => {
    const scriptTags = window.document.querySelectorAll('script');
    const len = scriptTags.length;
    for (let i = 0; i < len; i++) {
      const src = scriptTags[i].src;
      if (src && src === window.location.origin + url) {
        scriptTags[i].parentElement.removeChild(scriptTags[i]);
      }
    }

    const node = document.createElement('script');
    node.src = url;
    return new Promise((resolve, reject) => {
      node.onload = resolve;
      document.body.appendChild(node);
    });
  };

  registerInternalPlugin(pluginName: string) {
    switch (pluginName) {
      case 'uploadImage':
        return this.registerImageUpload();
      case 'insertCode':
        return this.registerSimpleInsertCode();
      case 'uploadVideo':
        return this.registerUploadVideo();
      case 'uploadAudio':
        return this.registerUploadAudio();
      case 'insertLink':
        return this.registerLink();
      default:
        break;
    }
  }

  registerPlugin(plugin: (ueditor: any) => PluginConfig) {
    const name = Math.random().toString(36).slice(2);
    window.UE.registerUI(name, (ueditor, uiName) => {
      let config = plugin(ueditor);
      if (!config.mode) {
        config.mode = MODE.MODAL;
      }
      const btn = new window.UE.ui.Button({
        name: uiName,
        title: config.menuText,
        cssRules: config.cssRules || '',
        onclick: isModalMode(config.mode)
          ? () => {
            this.setState({ [this.getVisibleName(name)]: true });
            config.onIconClick && config.onIconClick();
          }
          : config.onIconClick,
      });
      if (config.render) {
        this.setState((prevState) => ({
          pluginsWithCustomRender: [
            ...prevState.pluginsWithCustomRender,
            { name, ...config },
          ],
        }));
      }
      return btn;
    }, undefined, this.containerID);
  }

  registerImageUpload = () => this.registerPlugin(() => ({
    menuText: '图片上传',
    cssRules: 'background-position: -726px -77px;',
    mode: MODE.NORMAL,
    onIconClick: () => {
      this.tempfileInput.click();
    },
  }));

  registerSimpleInsertCode = () => this.registerPlugin((ueditor) => ({
    menuText: '插入代码',
    cssRules: 'background: url(' + simpleInsertCodeIcon + ') !important; background-size: 20px 20px !important;',
    mode: MODE.NORMAL,
    onIconClick: () => {
      ueditor.focus();
      ueditor.execCommand('insertcode');
    },
  }));

  registerUploadVideo = () => {
    const { uploadVideo, progress } = this.props;
    return this.registerPlugin((ueditor) => ({
      menuText: '上传视频',
      cssRules: 'background-position: -320px -20px;',
      mode: MODE.INTERNAL_MODAL,
      render: () => <VideoUploader upload={uploadVideo} progress={progress} onChange={this.videoChange} />,
      onConfirm: () => {
        if (!this.state.videoHtml) {
          utils.toast('请先添加视频');
          return true;
        }
        ueditor.execCommand('insertparagraph');
        ueditor.execCommand('inserthtml', this.state.videoHtml, true);
        ueditor.execCommand('insertparagraph');
        ueditor.execCommand('insertparagraph');
      },
    }));
  };

  registerUploadAudio = () => {
    const { uploadAudio, progress } = this.props;
    return this.registerPlugin((ueditor) => ({
      menuText: '上传音频',
      cssRules: 'background: url(' + uploadAudioIcon + ') !important; background-size: 20px 20px !important;',
      mode: MODE.INTERNAL_MODAL,
      render: () => <AudioUploader upload={uploadAudio} progress={progress} onChange={this.audioChange} />,
      onConfirm: () => {
        if (!this.state.audioHtml) {
          utils.toast('请先添加音频');
          return true;
        }
        ueditor.execCommand('insertparagraph');
        ueditor.execCommand('inserthtml', this.state.audioHtml, true);
        ueditor.execCommand('insertparagraph');
        ueditor.execCommand('insertparagraph');
      },
    }));
  };

  registerLink = () => this.registerPlugin((ueditor) => ({
    menuText: '超链接',
    cssRules: 'background-position: -504px 0px;',
    mode: MODE.INTERNAL_MODAL,
    render: () => <Link onChange={this.linkChange} />,
    onConfirm: () => {
      ueditor && ueditor.execCommand('inserthtml', this.state.linkHtml, true);
    },
  }));

  videoChange = (videoHtml: string) => {
    this.setState({ videoHtml });
  };

  audioChange = (audioHtml: string) => {
    this.setState({ audioHtml });
  };

  linkChange = (linkHtml: string) => {
    this.setState({ linkHtml });
  };

  uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { uploadImage } = this.props;
    if (uploadImage) {
      const promise = uploadImage(e);
      if (promise && typeof promise.then === 'function') {
        promise.then((imageUrl) => {
          if (Array.isArray(imageUrl)) {
            imageUrl.forEach((url) => {
              this.insertImage(url);
            });
          } else {
            this.insertImage(imageUrl);
          }
        });
      }
    }
    this.tempfileInput.value = '';
  };

  insertImage = (imageUrl: string) => {
    if (this.ueditor) {
      this.ueditor.focus();
      this.ueditor.execCommand('inserthtml', '<img src="' + imageUrl + '" />');
    }
  };

  handlePasteImage = () => {
    const { pasteImageStart, handlePasteImage, pasteImageDone } = this.props;
    if (!handlePasteImage) return;

    const html = this.ueditor.getContent();
    const images = utils.extractImageSource(html);

    if (Object.prototype.toString.call(images) !== '[object Array]') return;

    this.pasteImageAmount += images.length;
    pasteImageStart && pasteImageStart(this.pasteImageAmount);
    images.forEach((src) => {
      const promise = handlePasteImage(src);
      if (promise && typeof promise.then === 'function') {
        promise.then((newSrc) => {
          --this.pasteImageAmount;
          if (this.pasteImageAmount === 0) {
            pasteImageDone && pasteImageDone();
          }
          const newHtml = utils.replaceImageSource(this.ueditor.getContent(), src, newSrc);
          this.ueditor.setContent(newHtml);
        });
      }
    });
  };

  getVisibleName = (name: string) => {
    return name + 'VisibleModal';
  };

  getRegisterUIName = (name: string) => {
    return `${name}-${this.containerID}`;
  };

  initEditor = () => {
    const { config, plugins, onChange, value, getRef, onReady } = this.props;

    if (plugins && Array.isArray(plugins)) {
      plugins.forEach((plugin) => {
        if (typeof plugin === 'string') {
          this.registerInternalPlugin(plugin);
        } else {
          this.registerPlugin(plugin);
        }
      });
    }

    this.state.extendControls.forEach((control) => {
      window.UE.registerUI(this.getRegisterUIName(control.name), (editor, uiName) => {
        const btn = new window.UE.ui.Button({
          name: uiName,
          title: control.menuText,
          cssRules: control.cssRules ? control.cssRules : '',
          onclick: () => {
            this.setState({ [this.getVisibleName(control.name)]: true });
          },
        });
        return btn;
      }, undefined, this.containerID);
    });

    this.ueditor = config ? window.UE.getEditor(this.containerID, config) : window.UE.getEditor(this.containerID);
    this.ueditor._react_ref = this;

    getRef && getRef(this.ueditor);
    this.ueditor.ready(() => {
      this.ueditor.addListener('contentChange', () => {
        if (this.isContentChangedByWillReceiveProps) {
          this.isContentChangedByWillReceiveProps = false;
        } else {
          this.content = this.ueditor.getContent();
          onChange && onChange(this.content);
        }
      });

      this.ueditor.addListener('afterpaste', () => {
        this.handlePasteImage();
      });

      if (this.isContentChangedByWillReceiveProps) {
        this.isContentChangedByWillReceiveProps = false;
        this.ueditor.setContent(this.content);
      } else {
        this.ueditor.setContent(value);
      }

      onReady && onReady();
    });
  };

  render() {
    const { extendControls } = this.state;
    const { multipleImagesUpload } = this.props;

    return (
      <div>
        <script id={this.containerID} name={this.containerID} type="text/plain" />
        <input
          type="file"
          id={this.fileInputID}
          onChange={this.uploadImage}
          style={{ visibility: 'hidden', width: 0, height: 0, margin: 0, padding: 0, fontSize: 0 }}
          multiple={multipleImagesUpload}
        />
        {this.state.pluginsWithCustomRender.map((plugin) => {
          const visible = !!this.state[this.getVisibleName(plugin.name)];
          const onClose = () => {
            if (isModalMode(plugin.mode)) {
              this.setState({ [this.getVisibleName(plugin.name)]: false });
            }
            plugin.onClose && typeof plugin.onClose === 'function' && plugin.onClose();
          };
          if (plugin.mode === MODE.INTERNAL_MODAL) {
            return (
              <Modal
                key={plugin.name}
                title={plugin.title || plugin.menuText}
                zIndex={plugin.zIndex}
                alignStyle={plugin.alignStyle}
                visible={visible}
                beforeClose={plugin.beforeClose}
                onClose={onClose}
                onConfirm={plugin.onConfirm}
                component={plugin.render()}
              />
            );
          } else if (plugin.mode === MODE.MODAL) {
            return (
              <div key={plugin.name}>
                {plugin.render(visible, onClose)}
              </div>
            );
          } else if (plugin.mode === MODE.NORMAL) {
            return (
              <div key={plugin.name}>
                {plugin.render()}
              </div>
            );
          }
          return null;
        })}
        {extendControls.map((control) => (
          <Modal
            key={control.name + this.containerID}
            name={control.name}
            menuText={control.menuText}
            title={control.title}
            zIndex={control.zIndex}
            alignStyle={control.alignStyle}
            visible={this.state[this.getVisibleName(control.name)] ? this.state[this.getVisibleName(control.name)] : false}
            beforeClose={control.beforeClose}
            onClose={() => {
              this.setState({ [this.getVisibleName(control.name)]: false });
            }}
            onConfirm={control.onConfirm}
            component={control.component}
          />
        ))}
      </div>
    );
  }
}

export default ReactUeditor;
