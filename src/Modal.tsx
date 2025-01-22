import Button from './Button'
import Dialog from 'rc-dialog'
import React, {ReactNode} from 'react'
import 'rc-dialog/assets/index.css'


export default ({
                  title = '',
                  visible = false,
                  zIndex = 1050,
                  alignStyle = 'top',
                  beforeClose,
                  onClose,
                  onConfirm,
                  children,
                }: {
  title: string,
  visible: boolean,
  zIndex: number,
  alignStyle: string,
  extendControls: string[],
  debug: boolean,
  beforeClose?: () => void,
  onClose: () => void,
  onConfirm?: () => void,
  children: ReactNode
}) => {
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
      {children}
    </Dialog>
  )
}
