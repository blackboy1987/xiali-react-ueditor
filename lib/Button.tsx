import React, {CSSProperties} from 'react'

const buttonStyle:CSSProperties = {
  height: '24px',
  fontWeight: '500',
  cursor: 'pointer',
  padding: '0 15px',
  fontSize: '12px',
  color: 'rgba(0,0,0,.65)',
  border: '1px solid #d9d9d9',
  marginLeft: '10px',
}

export default ({style, children, onClick,key}:{style?:CSSProperties, children?:string, onClick:(e:any)=>void,key?: string})=>{
  let mergedStyle:CSSProperties = {...buttonStyle, ...style}
  return <button key={key} style={mergedStyle} onClick={onClick} type='button'>{children}</button>
}
