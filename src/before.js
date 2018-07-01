// ==============ES5的类和集成==================

function Animal () {}
function Dog () {}

Object.defineProperties(Animal.prototype, {
  name: {
    value () {
      return 'Animal'
    },
  },
  say: {
    value() {
      return `I'm ${this.name()}`
    }
  }
})

// dog instanceof Animal => true



Dog.prototype = Object.create(Animal.prototype, {
  constructor: {
    value: Dog,
    enumerable: false
  },
  name: {
    value () {
      return 'Dog'
    },
  },
})

document.write(new Dog instanceof Animal);
var dog = new Dog;
console.log(dog.say());
console.log(Dog.prototype.constructor);


// ==============ES6的类和集成==================
class Animal {
  type = 'buru';
  name () {
    return 'Animal'
  }

  say () {
    return 'Im ' + this.name() + ' -type-' + this.type
  }
}


class Dog extends Animal {
  name () {
    return 'Dog'
  }
}


console.log(new Dog().say())




// =================装饰器decorete=================
// 修饰类方法
function log (target) {
  const desc = Object.getOwnPropertyDescriptors(target.prototype)
  console.log('desc:', desc)
  // 对属性遍历
  for (var key of Object.keys(desc)) {
    if (key === 'constructor') continue
    // 只处理方法属性
    let func = desc[key].value
    if (typeof func === 'function') {
      Object.defineProperty(target.prototype, key, {

        value(...args){
          console.log(key + ' call before')
          let ret = func.apply(this, args)
          console.log(key + ' call after')
          return ret
        }
      })

    }
  }
}
// 修饰类成员属性
/***
* 不允许修改当前修饰的属性
* target: 被修饰目标对象
* key: 目标属性名
* descriptor: 属性描述
*/
function readonly (target, key, descriptor) {
  descriptor.writable = false
}
// 验证参数
function validate(target, key, descriptor) {
  const func = descriptor.value
  // 重写函数value
  descriptor.value = function (...args){
    for ( let arg of args) {
      if (typeof arg !== 'number') {
        throw new Error('参数必须是数字')
      }
    }

    return func.apply(this, args)
  }
}

@log
class Numberic {
  @readonly PI = 3.1415926;

  @validate
  add (...nums) {
    return nums.reduce((p, n) => (p + n), 0)
  }
}

// console.log(new Numberic().add(1, 2));// 测试log
// console.log(new Numberic().PI = 2)    // 测试readonly
console.log(new Numberic().add(1, 3));// 测试validate







