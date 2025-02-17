export function extractImageSource(html: string): string[] {
  let imgReg = /<img.*?(?:>|\/>)/gi
  let srcReg = /src=['"]?([^'"]*)['"]?/i
  let arr = html.match(imgReg)
  let imgSrc = []
  if (!arr) return [html]

  for (let i = 0; i < arr.length; i++) {
    // @ts-ignore
    let src = arr[i].match(srcReg)[1]
    if(src){
      imgSrc.push(src)
    }
  }
  return imgSrc
}

export function replaceImageSource(html:string, origin:string, target:string): string {
  return html.replace(/<img.*?src="(.*?)".*?\/?>/ig, function(img, src) {
    return src === origin ? img.replace(src, target) : img
  })
}

export const toast = (text:string, duration?:number):void => {
  if (!text || !text.length) return
  let root = document.body
  let toastDom = document.createElement('div')
  toastDom.setAttribute('id', 'toast')
  toastDom.setAttribute(
    'style',
    `display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0);`
  )
  let textDom = document.createElement('div')
  textDom.setAttribute(
    'style',
    `background: rgba(0, 0, 0, 0.2);
    padding: 5px 10px;
    border-radius: 4px;
    color: #fff;
    font-size: 13px;`
  )

  textDom.innerHTML = text
  toastDom.append(textDom)
  root.append(toastDom)

  setTimeout(function() {
    let toast = document.getElementById('toast')
    if(toast){
      toast.remove()
    }
  }, duration||1000)
}
