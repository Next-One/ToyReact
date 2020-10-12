import {createElement,render,Component} from './toy-react'

class MyComponent extends Component{
  render(){
    return <div>
      <span>11111</span>
      {
        this.children
      }
    </div>
  }
}

render(<MyComponent id="box" class="c1 c2" onClick="handleClick">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</MyComponent>, document.body)

