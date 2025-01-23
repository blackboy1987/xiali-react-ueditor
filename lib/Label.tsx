import React, {CSSProperties, ReactNode} from 'react'

const labelStyle = {
  display: 'block',
  width: '165px',
  color: 'rgba(0, 0, 0, 0.65)',
  marginRight: '20px',
  marginBottom: '10px',
}

const labelName = {
  display: 'inline-block',
  width: '50px',
}


export default ({style, children, name}:{style?:CSSProperties, children:ReactNode, name: string})=>{
  let mergedStyle = {...labelStyle, ...style}
  return (
    <label style={mergedStyle}><span style={labelName}>{name}</span>{children}</label>
  );
}
