import Input from './Input'
import React, {useState} from 'react'

const inputStyle = {
  width: '300px',
}
const spanStyle = {
  fontSize: '14px',
  color: 'rgba(0, 0, 0, 0.65)',
  display: 'inline-block',
  width: '80px',
}
const formItmeStyle = {
  marginBottom: '10px',
}

export default ({text='', link='', title='', newTab=false,onChange}:{text?:string, link?:string, title?:string, newTab:boolean, showTips:boolean,onChange:(href:string)=>void})=>{
  const [text1, setText1] = useState(text||'');
  const [link1, setLink1] = useState(link||'');
  const [title1, setTitle1] = useState(title||'');
  const [newTab1, setNewTab1] = useState(newTab||false);
  const [showTips1, setShowTips1] = useState(false);

  /**
   * 判断协议
   * @param link
   */
  const hasProtocol = (link:string):any => {
    return !!(link.match(/^http:|https:/) || link.match(/^\/\//));

  }

  /**
   * 解析插入的编辑器里面的数据
   */
  const generateHtml = (data:{text:string,link: string,title:string,newTab:boolean}):string => {
    let html = ''
    if (data.link) {
      if (!hasProtocol(data.link)) {
        data.link = 'https://' + data.link
      }
      html += `<a href="${data.link}" target=${data.newTab ? '_blank' : '_self'} title="${data.title}">${data.text || data.link}</a>`
    }
    return html
  }


  const changeConfig = (e:React.ChangeEvent<HTMLInputElement>, type:'text'|'link'|'title'|'newTab') => {
    let value = e.target.value
    let data = {
      text:text1,
      link:link1,
      title:title1,
      newTab:newTab1,
    }
    let boolType = ['newTab']
    if (boolType.indexOf(type) !== -1) {
      setNewTab1(e.target.checked);
      data = {
        ...data,
        newTab:e.target.checked,
      }
    }else {
      if (type === 'link') {
        if (!hasProtocol(value)) {
          setShowTips1(true)
        } else {
          setShowTips1(false)
        }
        setLink1(value)
      }else if (type === 'newTab') {
        setNewTab1(!newTab1);
      }else if (type === 'text') {
        setText1(value);
      }else if (type === 'title') {
        setTitle1(value);
      }
      data = {
        ...data,
        [`${type}`]:value,
      };
    }
    if(onChange){
      onChange(generateHtml(data))
    }
  }
  return (
    <form>
      <div style={formItmeStyle}>
        <span style={spanStyle}>文本内容：</span>
        <Input type='text' style={inputStyle} value={text1} onChange={e => changeConfig(e, 'text')} />
      </div>
      <div style={formItmeStyle}>
        <span style={spanStyle}>链接地址：</span>
        <Input type='text' style={inputStyle} value={link1} onChange={e => changeConfig(e, 'link')} />
      </div>
      <div style={formItmeStyle}>
        <span style={spanStyle}>标题：</span>
        <Input type='text' style={inputStyle} value={title1} onChange={e => changeConfig(e, 'title')} />
      </div>
      <div style={formItmeStyle}>
        <span style={{color: 'rgba(0, 0, 0, 0.65)', fontSize: '14px'}}>是否在新窗口打开：</span>
        <input type='checkbox' checked={newTab1} onChange={e => changeConfig(e, 'newTab')} />
      </div>
      {showTips1 && <p style={{fontSize: '14px', color: 'red'}}>您输入的超链接中不包含http等协议名称，默认将为您添加http://前缀</p>}
    </form>
  );
}

