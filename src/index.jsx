import {observable, action, computed } from 'mobx'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {observer, PropTypes as observablePropTypes } from 'mobx-react'

class Store {
  @observable todos = []
  @observable filterBy = false

  @computed get showList () {
    console.log('show::', this.todos.filter(i => i.finished == this.filterBy))
    return this.todos.filter(i => i.finished == this.filterBy)
  }
  @computed get totals () {
    return this.todos.length
  }
  @action.bound filterStatus (s) {
    this.filterBy = s
  }
  @action.bound createTodo (todo, cb) {
    this.todos.unshift(new Todo(todo))
    cb && cb()
  }

  @action.bound removeTodo (todo) {
    this.todos.remove(todo)
  }
  // http://myjson.com/  造数据   本地起服务  live-server
  @action getInitTodos () {
    fetch('https://api.myjson.com/bins/afrmi'
    ).then(response => response.json()).then(action('success', (res) => {
      res && res.map(t => this.createTodo(t))
    }), action('fail', (err)=>{
      console.error(err)
    }))
  }
}

class Todo {
  @observable id = Math.random()
  @observable title = ''
  @observable finished = false

  constructor ({title, id, finished }){
    this.title = title
    this.id = id || Math.random()
    this.finished = finished || false
  }

  @action.bound toggle () {
    this.finished = !this.finished
  }
}

const store = new Store()

@observer
class TodoItem extends Component {
  static propType = {
    todo: PropTypes.shape({
      id: PropTypes.number.isrequied,
      title: PropTypes.string.isrequied,
      finished: PropTypes.bool.isrequied
    }).isrequied
  }

  handleClick = (t) => {
    this.props.todo.toggle()
  }

  render () {
    const todo = this.props.todo
    return <span >
    <input type="checkbox" checked={todo.finished} onClick={this.handleClick}/>
    <strong className={['title', todo.finished && ' finished'].join(' ')}>{todo.title} </strong>
    </span>
  }
}

@observer
class ListHeader extends Component {
  static propType = {
  }

  state = {
    inputValue: ''
  }
  handerChange = (e) => {
    console.log('input change', e)
    this.setState({
      inputValue: e.target.value
    })
  }

  handerSubmit = (e) => {
    e.preventDefault()
    this.props.store.createTodo({title: this.state.inputValue}, () => {
      this.setState({
        inputValue: ''
      })
    })

  }

  render () {
    return <header>
    <form onSubmit={this.handerSubmit}>
      <input placeholder="what need to be finished?" className="input"
      value={this.state.inputValue} onChange={this.handerChange}/>
    </form>
    </header>
  }
}

@observer
class ListFooter extends Component {
  static propType = {
    store: PropTypes.shape(observablePropTypes.observableObject).isrequied
  }

  render () {
    const store = this.props.store
    const totals = store.totals
    return <footer>
      <p>totals todo items: {totals}  </p>
      <p>{store.filterBy ? 'finished' :'unfinished'} todo items: {store.showList.length}  </p>
      <p>filterBy:
      <button className={!store.filterBy ? 'active' : ''} onClick={() => store.filterStatus(false)}>unfinished</button>
      <button className={store.filterBy ? 'active' : ''} onClick={() => store.filterStatus(true)}>finished</button>
      </p>
    </footer>
  }
}


@observer
class TodoList extends Component {
  static propType = {
    store: PropTypes.shape({
      totos: PropTypes.shape(observablePropTypes.observableArray).isrequied
    }).isrequied
  }
  componentWillMount () {
    this.props.store.getInitTodos()
  }
  render () {
    const store = this.props.store
    const showList = store.showList
    return <div>
      <ListHeader store={store}/>
      <ul  className="todo-list">{
        showList.length ? showList.map(item => <li key={item.id} className="todo-item" >
          <TodoItem todo={item}  />
          <button className="delete" onClick={e => store.removeTodo(item)}>X</button>
      </li>) : <li>nothing </li>}</ul>
      <ListFooter store={store}/>
    </div>
  }
}



ReactDOM.render(
  <TodoList store={store}/>,
  document.querySelector('#root')
)



