import React, {CSSProperties, ReactNode} from 'react'

const selectStyle:CSSProperties = {
  height: '22px',
  width: '80px',
  fontSize: '14px',
  color: 'rgba(0,0,0,.65)',
  backgroundColor: '#fff',
  border: '1px solid #d9d9d9',
  borderRadius: '4px',
  marginLeft: '10px',
}

export default ({style,children,defaultValue,onChange}:{style?:CSSProperties,children:ReactNode,defaultValue: string | number | readonly string[] | undefined,onChange:(e:any)=>void})=>{
  let mergedStyle:CSSProperties = {...selectStyle, ...style}
  return (
    <select style={mergedStyle} defaultValue={defaultValue} onChange={onChange}>{children}</select>
  );
}
