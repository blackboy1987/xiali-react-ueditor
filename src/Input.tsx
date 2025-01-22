import React, {CSSProperties, HTMLInputTypeAttribute} from 'react'

const inputStyle:CSSProperties = {
  height: '18px',
  width: '72px',
  boxSizing: 'content-box',
  fontSize: '12px',
  lineHeight: '18px',
  color: 'rgba(0,0,0,.65)',
  backgroundColor: '#fff',
  border: '1px solid #d9d9d9',
  borderRadius: '4px',
  padding: '1px 3px',
  margin: '0 10px',
}

export default ({type, value, onChange, style}:{type:HTMLInputTypeAttribute, value: string|number, onChange:(e: any)=>void, style?:CSSProperties})=>{
  let mergedStyle:CSSProperties = {...inputStyle, ...style}
  return <input style={mergedStyle} type={type} value={value} onChange={onChange} />
}
