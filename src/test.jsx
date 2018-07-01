import {observable, action } from 'mobx'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {observer, PropTypes as observablePropTypes } from 'mobx-react'

class Store {
  @observable cache = {
    queue: []
  }

  @action.bound refresh () {
    this.cache.queue.push(1)
    console.log(this.cache.queue.length)
  }
}

const store = new Store();

@observer
class Bar extends Component {
  static propTypes = {
    queue: observablePropTypes.observableArray//PropTypes.array
  }

  render () {
    const queue = this.props.queue;
    return <span>{queue.length}</span>
  }
}

@observer
class Foo extends Component {
  static = {
    cache: observablePropTypes.observableObject//PropTypes.object
  }

  render () {
    const cache = this.props.cache

    return <div>
    <button onClick={this.props.refresh}>刷新</button>
    <Bar queue={cache.queue} /></div>
  }
}

ReactDOM.render(<Foo cache={store.cache}  refresh={store.refresh}/>,
  document.querySelector('#root'));