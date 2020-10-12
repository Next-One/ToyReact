import {isArray, isFunction, isObject, isString, isVNode, normalizeVNodes} from "./utils"
import {ChildrenFlags, Fragment, Portal, VNodeFlags} from "./flags"
import {mount} from "./mounted"
import {patch} from "./patch"

export class Component{
  render(){
    throw new Error('Component should one render method!')
  }
}

export function createElement(tag, data = null, children = null) {
  let flags = null
  let childrenFlags = null
  if (isString(tag)) {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT
  } else if (tag === Portal) {
    flags = VNodeFlags.PORTAL
    tag = data && data.target
  } else {
    if (isObject(tag)) {
      flags = tag.functional
        ? VNodeFlags.COMPONENT_FUNCTIONAL
        : VNodeFlags.COMPONENT_STATEFUL_NORMAL
    } else if (isFunction(tag)) {
      flags = tag.prototype && tag.render
        ? VNodeFlags.COMPONENT_STATEFUL_NORMAL
        : VNodeFlags.COMPONENT_FUNCTIONAL
    }
  }
  if(isArray(children)){
    const {length} = children
    if(length === 0){
      childrenFlags = ChildrenFlags.NO_CHILDREN
    }else if(length === 1){
      childrenFlags = ChildrenFlags.SINGLE_VNODE
      children = children[0]
    }else{
      childrenFlags = ChildrenFlags.KEYED_VNODES
      children = normalizeVNodes(children)
    }
  }else if(children == null){
    childrenFlags = ChildrenFlags.NO_CHILDREN
  }else if(children._isVNode){
    childrenFlags = ChildrenFlags.SINGLE_VNODE
  }else{
    childrenFlags = ChildrenFlags.SINGLE_VNODE
    children = createTextVNode(children+'')
  }
  return {
    _isVNode: true,
    children,
    childrenFlags,
    el: null,
    data,
    flags,
    tag
  }
}



export function createTextVNode(text) {
  return {
    _isVNode: true,
    children: text,
    childrenFlags:ChildrenFlags.NO_CHILDREN,
    data: null,
    el: null,
    flags: VNodeFlags.TEXT,
    tag: null
  }
}



export function render(vnode, container) {
  const prevVNode = container.vnode
  if (isVNode(prevVNode)) {
    if (isVNode(vnode)) {
      patch(vnode, prevVNode)
      container.vnode = vnode
    } else {
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  } else if (isVNode(vnode)) {
    mount(vnode, container)
    container.vnode = vnode
  }
}
