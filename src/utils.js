export const isString = val => typeof val === "string"
export const isObject = val => val != null && typeof val === "object"
export const isFunction = val => typeof val === "function"
export const isArray = Array.isArray
export const isVNode = val => val && val._isVNode === true
export function resolveClassToClassName(className, classList = []) {
  if(isString(className)) {
    classList.push(className)
  }else if(isArray(className)){
    for(const cls of className){
      resolveClassToClassName(cls, classList)
    }
  } else if(isObject(className)){
    for(const [k,v] of Object.entries(className)){
      if(v){
        classList.push(k)
      }
    }
  }
  return classList
}
export const domPropsRE = /[A-Z]|^(?:value|checked|selected|muted)$/

export function normalizeVNodes(children) {
  const newChildren = []
  for(let i=0;i<children.length; i++){
    const child = children[i]
    if(!child.key){
      child.key = '|'+i
    }
    newChildren.push(child)
  }
  return newChildren
}


export function mountPropsData(el, data) {
  if(!isObject(data)) return
  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case 'style': {
        for (const [k, v] of Object.entries(value)) {
          el.style[k] = v
        }
        break
      }
      case 'class': {
        el.className = resolveClassToClassName(value).join(' ')
        break
      }
      default: {
        if (key[0] === 'o' && key[1] === 'n') {
          el.addEventListener(key.slice(2), value)
        } else if (domPropsRE.test(key)) {
          el[key] = value
        } else {
          el.setAttribute(key, value)
        }
      }
    }
  }
}

