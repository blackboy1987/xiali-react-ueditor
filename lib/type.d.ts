import {ReactNode} from "react";

export type PluginsWithCustomRender={
  name: string;
  mode: string;
  onClose?: () => void;
  title?: string;
  menuText?: string;
  zIndex: number;
  beforeClose:()=>void;
  onConfirm:()=>void;
  render:(visible?:boolean,onClose?:()=>void)=>ReactNode;
  alignStyle?: string;
}
type ReactUeditorProps = {
  value: string;
  ueditorPath: string;
  plugins: any[],
  onChange: (html: string) => void,
  uploadImage?: (e: any) => Promise<string|string[]>,
  getRef: (ueditor: any) => void,
  multipleImagesUpload?: boolean,
  onReady: () => void,
  pasteImageStart?: (count: number) => void,
  handlePasteImage?: (src: string) => Promise<string>,
  pasteImageDone?: () => void,
  extendControls?: string[],
  debug: boolean,
  config: any;
  uploadVideo?: (e: any) => Promise<any>;
  progress?: number;
  uploadAudio?: (e: any) => Promise<any>;
}
type StateProps = {
  videoSource: string,
  audioSource: string,
  extendControls: any[],
  videoHtml: string,
  audioHtml: string,
  pluginsWithCustomRender: PluginsWithCustomRender[],
  content: string;
  isContentChangedByWillReceiveProps: boolean;
  pasteImageAmount: number;
  linkHtml: string;
}
export type ModalProps = {
  name?: string;
  menuText?: string;
  title: string,
  visible: boolean,
  beforeClose?: () => void,
  onClose: () => void,
  onConfirm?: () => void,
  zIndex?: number,
  alignStyle?: string,
  extendControls?: string[],
  component:()=>ReactNode;
}
