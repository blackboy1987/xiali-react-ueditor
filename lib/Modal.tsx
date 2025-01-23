import Button from './Button'
import Dialog from 'rc-dialog'
import React from 'react'
import 'rc-dialog/assets/index.css'
import {ModalProps} from "./type";


export default ({
                  title = '',
                  visible = false,
                  zIndex = 1050,
                  alignStyle = 'top',
                  beforeClose,
                  onClose,
                  onConfirm,
                  component,
                }: ModalProps) => {
  const closeModal = () => {
    if (beforeClose) {
      beforeClose();
    }
    onClose()
  }

  return (
    <Dialog
      title={title}
      onClose={closeModal}
      visible={visible}
      footer={[
        <Button key='close' onClick={closeModal}>取消</Button>,
        <Button key='insert' onClick={() => {
          if (onConfirm) {
            closeModal()
          }
        }}>确认</Button>,
      ]}
      animation='zome'
      maskAnimation='fade'
      zIndex={zIndex}
      style={alignStyle === 'middle' ? {top: '50%', transform: 'translateY(-50%)'} : {}}>
      {component()}
    </Dialog>
  )
}
