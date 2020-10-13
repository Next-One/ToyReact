import {isArray, isObject, isString, mountPropsData} from "./utils"

export class Component {
  render() {
    throw new Error('Component should one render method!')
  }

  constructor() {
    this.props = Object.create(null)
    this.children = []
    this._root = null
  }

  setPropsData(propsData) {
    if(!isObject(propsData)) return;
    for(const [k,v] of Object.entries(propsData)){
      this.props[k] = v
    }
  }

  appendChild(component) {
    this.children.push(component)
  }

  get root() {
    if (!this._root) {
      const vnode = this.render()
      console.log(vnode,this.props)
      vnode.setPropsData(this.props)
      this._root = this.render().root
    }
    return this._root
  }
}

class ElementWrapper {
  constructor(tag) {
    this.root = document.createElement(tag)
  }

  setPropsData(propsData) {
    mountPropsData(this.root, propsData)
  }

  appendChild(component) {
    this.root.appendChild(component.root)
  }
}

class TextWrapper {
  constructor(tag) {
    this.root = document.createTextNode(tag)
  }
}

export function createElement(tag, data = null, ...children) {
  let el = null
  if (isString(tag)) {
    el = new ElementWrapper(tag)
  } else {
    el = new tag()
  }
  el.setPropsData(data)
  if (isArray(children) && children.length > 0) {
    const appendChildren = (children) => {
      for (let child of children) {
        if (isString(child)) child = new TextWrapper(child)
        if (isArray(child) && children.length > 0) {
          appendChildren(child)
        } else {
          el.appendChild(child)
        }
      }
    }
    appendChildren(children)
  }
  return el
}


export function render(component, container) {
  console.log(component)
  container.appendChild(component.root)
}
