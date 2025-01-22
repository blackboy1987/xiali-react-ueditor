import React, {CSSProperties} from 'react'

const uploadStyle:CSSProperties = {
  height: '26px',
  width: '80px',
  display: 'inline-block',
  boxSizing: 'border-box',
  lineHeight: '25px',
  textAlign: 'center',
  borderRadius: '4px',
  border: '1px solid transparent',
  fontSize: '12px',
  fontWeight: '500',
  color: '#fff',
  backgroundColor: '#108ee9',
  cursor: 'pointer',
  marginLeft: '10px',
}

export default ({onChange}:{onChange?:(e: React.ChangeEvent<HTMLInputElement>)=>void})=>{
  const onInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(onChange){
      onChange(e)
    }
    e.target.value = ''
  }

  return (
    <label style={uploadStyle}>直接上传
      <input type='file' onChange={onInputChange} style={{display: 'none'}} />
    </label>
  )
}
