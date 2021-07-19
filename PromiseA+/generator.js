

function* generator() {
    console.log("迭代器生成")
    let arr = [1, 2, 3]
    for(let i of arr) {
        yield i
    }
    return 111
}


let g = generator()

console.log(g.next())   // {value: 1, done: false}
console.log(g.next())   // {value: 2, done: false}
console.log(g.next())   // {value: 3, done: false}
console.log(g.next())   // {value: undefined, done: true}
