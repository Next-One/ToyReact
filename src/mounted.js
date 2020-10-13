import {domPropsRE, isObject, isString, resolveClassToClassName} from "./utils"
import {createTextVNode} from "./toy-react"
import {ChildrenFlags, VNodeFlags} from "./flags"

export function mount(vnode, container, isSVG) {
  console.log(vnode, 'vnode--------')
  const {flags} = vnode
  if (flags & VNodeFlags.ELEMENT) {
    mountElement(vnode, container, isSVG)
  } else if (flags & VNodeFlags.COMPONENT) {
    mountComponent(vnode, container, isSVG)
  } else if (flags & VNodeFlags.FRAGMENT) {
    mountFragment(vnode, container, isSVG)
  } else if (flags & VNodeFlags.PORTAL) {
    mountPortal(vnode, container, isSVG)
  } else if (flags & VNodeFlags.TEXT) {
    mountText(vnode, container)
  }
}

function mountElement(vnode, container, isSVG) {
  const {tag, data, children, childrenFlags, flags} = vnode
  isSVG = isSVG || flags & VNodeFlags.ELEMENT_SVG
  const el = isSVG
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(tag)
  if (isObject(data)) mountData(el, data)
  mountChildren(children, childrenFlags, el, isSVG)
  vnode.el = el
  container.appendChild(el)
}

function mountChildren(children, childrenFlags, container, isSVG) {
  if (childrenFlags === ChildrenFlags.NO_CHILDREN) return
  if (childrenFlags & ChildrenFlags.SINGLE_VNODE) {
    mount(children, container, isSVG)
  } else if (childrenFlags & ChildrenFlags.MULTIPLE) {
    for (const child of children) {
      mount(child, container, isSVG)
    }
  }
}

function mountData(el, data) {
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


function mountComponent(vnode, container, isSVG) {
  if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
    mountStatefulComponent(vnode, container, isSVG)
  } else {
    mountFunctionalComponent(vnode, container, isSVG)
  }
}

function mountStatefulComponent(vnode, container, isSVG) {
  const instance = new vnode.tag()
  instance.$vnode = instance.render()
  mount(instance.$vnode, container, isSVG)
  instance.$el = vnode.el = instance.$vnode.el
}

function mountFunctionalComponent(vnode, container, isSVG) {
  const $vnode = vnode.tag()
  mount($vnode, container, isSVG)
  vnode.$el = $vnode.el
}


function mountFragment(vnode, container, isSVG) {
  const {children, childrenFlags} = vnode
  switch (childrenFlags) {
    case ChildrenFlags.SINGLE_VNODE: {
      mount(children, container, isSVG)
      break
    }
    case ChildrenFlags.MULTIPLE: {
      children.forEach(child => mount(child, container, isSVG))
      break
    }
    default: {
      const placeholder = createTextVNode('')
      mountText(placeholder, container)
    }
  }
}

function mountPortal(vnode, container, isSVG) {
  const {tag, children, childrenFlags} = vnode
  let target = isString(tag) ? document.querySelector(tag) : tag
  if (!target) target = container
  if (childrenFlags & ChildrenFlags.SINGLE_VNODE) {
    mount(children, target, isSVG)
  } else if (childrenFlags & ChildrenFlags.MULTIPLE) {
    children.forEach(child => mount(child, target, isSVG))
  }
  const placeholder = createTextVNode('')
  mountText(vnode, container)
  vnode.el = placeholder.el
}

function mountText(vnode, container) {
  const el = document.createTextNode(vnode.children)
  container.appendChild(el)
  vnode.el = el
}
