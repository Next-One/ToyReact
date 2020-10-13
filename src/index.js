import {createElement,render,Component} from './toy-react2'

class MyComponent extends Component{
  render(){
    return <div>
      <h1>3333</h1>
      {this.children}
    </div>
  }
}



render(<MyComponent  id="box" class="c1 c2">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</MyComponent>, document.body)

