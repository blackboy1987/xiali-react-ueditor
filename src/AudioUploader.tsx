import Button from './Button'
import Input from './Input'
import React, {CSSProperties, useState} from 'react'
import Tag from './Tag'
import Upload from './Upload'
import Label from "@/components/ueditor/Label";
import Select from "@/components/ueditor/Select";

type StyleProps = {
  paramsConfig: CSSProperties;
  insertTitle: CSSProperties;
  sourceList: CSSProperties;
  configTitle: CSSProperties;
  warnInfo: CSSProperties;
}

const style:StyleProps = {
  paramsConfig: {
    paddingBottom: '10px',
    borderBottom: '1px solid rgb(217, 217, 217)',
    display: 'flex',
    flexWrap: 'wrap',
  },
  insertTitle: {
    fontSize: '14px',
    paddingRight: '10px',
    color: 'rgba(0, 0, 0, 0.65)',
  },
  sourceList: {
    margin: '10px 10px 10px 0',
    border: '1px dashed rgb(217, 217, 217)',
    borderRadius: '4px',
  },
  configTitle: {
    display: 'block',
    fontSize: '14px',
    margin: '10px 0',
    paddingRight: '10px',
    color: 'rgba(0, 0, 0, 0.65)',
  },
  warnInfo: {
    display: 'inline-block',
    width: '100%',
    margin: '5px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#f04134',
  },
}

const linkRegx:RegExp = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9,_-](\?)?)*)*$/i

let timeoutInstance:number=0;


type StateProps = {
  sources:string[];
  currentSource: string;
  width: number;
  height: number;
  controls:string;
  autoplay: string;
  muted:string;
  loop:string;
  poster: string;
  name: string;
  author: string;
  errorMsg: string;
  errorMsgVisible: boolean;
}

const defaultState:StateProps = {
  sources: [],
  currentSource: '',
  width: 400,
  height: 400,
  controls: 'true',
  autoplay: 'false',
  muted: 'false',
  loop: 'false',
  poster: '',
  name: '',
  author: '',
  errorMsg: '',
  errorMsgVisible: false,
};

export default ({onChange,upload,progress}:{onChange:(html: string)=>void,upload:(e:any)=>Promise<any>,progress: number})=>{
  const [data, setData] = useState<StateProps>(defaultState);

  const updateCurrentSource = e => {
    setData({
      ...data,
      currentSource: e.target.value
    })
  }
  const showErrorMsg = (msg: string) => {
    setData({
      ...data,
      errorMsg: msg,
      errorMsgVisible: true,
    })
    clearTimeout(timeoutInstance)
    timeoutInstance = setTimeout(() => {
      setData({
        ...data,
        errorMsg: '',
        errorMsgVisible: false,
      })
    }, 4000)
  }
  const getFileType = (fileUrl:string):any => {
    let type = fileUrl.match(/\.(\w+)$/, 'i')
    return type ? type[1].toLowerCase() : 'mp3'
  }

  const generateHtml = (data:StateProps): string => {
    let dataExtra = JSON.stringify({'poster': data.poster, 'name': data.name, 'author': data.author})
    let len = data.sources.length
    if (len > 0) {
      let html = ''
      let attr = ''
      attr += !data.controls ? '' : ' controls="true" '
      attr += !data.autoplay ? '' : ' autoplay="true" '
      attr += !data.loop ? '' : ' loop="true" '

      if (len === 1) {
        html = `<audio src="${data.sources[0]}" ${attr} data-extra='${dataExtra}'>你的浏览器不支持 audio 标签</audio>`
      } else {
        html = `<audio ${attr} data-extra='${dataExtra}'>`
        data.sources.forEach(source => {
          html += `<source src=${source} type="audio/${getFileType(source)}">`
        })
        html += '你的浏览器不支持 audio 标签</audio>'
      }

      return html + '<p></p>'
    }
    return "<p></p>";
  }
  const addSource = () => {
    let newsources = data.sources.concat([data.currentSource])
    if (data.currentSource === '') {
      showErrorMsg('链接不能为空')
    } else if (!linkRegx.test(data.currentSource)) {
      showErrorMsg('非法的链接')
    } else if (data.sources.indexOf(data.currentSource) !== -1) {
      showErrorMsg('链接已存在')
    } else {
      setData({
        ...data,
        sources: newsources,
        currentSource: '',
      })

      if(onChange){
        onChange(generateHtml({
          ...data,
          sources: newsources,
          currentSource: '',
        }))
      }
    }
  }

  const removeSource = (index: number) => {
    let sourcesCopy = data.sources.concat([])
    sourcesCopy.splice(index, 1);
    setData({
      ...data,
      sources: sourcesCopy,
    })
    if(onChange){
      onChange(generateHtml({
        ...data,
        sources: sourcesCopy,
      }))
    }
  }
  const uploadFile = (e: any) => {
    if (!upload) return
    upload(e).then(url => {
      setData({
        ...data,
        currentSource: url,
      })
    }).catch((e:any) => {
      showErrorMsg(e.message);
    })
  };

  const changeConfig = (e:any, type: string) => {
    let value = e.target.value
    let boolType = ['controls', 'autoplay', 'muted', 'loop']
    if (type === 'width' || type === 'height') {
      if (isNaN(parseInt(value))) {
        value = parseInt(value)
      }
    } else if (boolType.indexOf(type) !== -1) {
      value = !!value
    }
    setData({
      ...data,
      [`${type}`]:value
    })
    if(onChange){
      onChange(generateHtml({
        ...data,
        [`${type}`]:value
      }))
    }
  }

  const renderSourceList = () => {
    if (data.sources.length > 0) {
      return data.sources.map((source, index) => {
        return <Tag value={source} key={source} index={index} onRemove={removeSource}/>
      })
    } else {
      return <span style={style.warnInfo}>至少添加一个链接</span>
    }
  }

  const renderAudioConfig = () => {
    return (
      <form style={style.paramsConfig}>
        <Label name='controls'>
          <Select defaultValue={data.controls} onChange={e => { changeConfig(e, 'controls') }}>
            <option value='true'>true</option>
            <option value='false'>false</option>
          </Select>
        </Label>
        <Label name='autoplay'>
          <Select defaultValue={data.autoplay} onChange={e => { changeConfig(e, 'autoplay') }}>
            <option value='true'>true</option>
            <option value='false'>false</option>
          </Select>
        </Label>
        <Label name='loop'>
          <Select defaultValue={data.loop} onChange={e => { changeConfig(e, 'loop') }}>
            <option value='true'>true</option>
            <option value='false'>false</option>
          </Select>
        </Label>
        <Label name='poster'>
          <Input type='text' value={data.poster} onChange={e => { changeConfig(e, 'poster') }} />
        </Label>
        <Label name='name'>
          <Input type='text' value={data.name} onChange={e => { changeConfig(e, 'name') }} />
        </Label>
        <Label name='author'>
          <Input type='text' value={data.author} onChange={e => { changeConfig(e, 'author') }} />
        </Label>
      </form>
    )
  };

  return (
    <div>
      <div>
        <span style={style.insertTitle}>插入链接</span>
        <Input style={{width: '300px'}} type='text' value={data.currentSource} onChange={updateCurrentSource} />
        <Button onClick={addSource}>添加</Button>
        <Upload onChange={uploadFile} />
      </div>
      <div>
          <span style={{...style.warnInfo, display: progress && progress !== -1 ? 'block' : 'none'}}>
            {progress}%
          </span>
        <span style={{...style.warnInfo, display: data.errorMsgVisible ? 'block' : 'none'}}>{data.errorMsg}</span>
      </div>
      <div style={style.sourceList}>
        {renderSourceList()}
      </div>
      <span style={style.configTitle}>参数配置</span>
      {renderAudioConfig()}
      <div style={{textAlign: 'center', padding: '20px 10px 0 10px'}}>
        {
          <audio src={data.currentSource} controls style={{width: '400px'}}>
            你的浏览器不支持 audio 标签
          </audio>
        }
      </div>
    </div>
  );
}
