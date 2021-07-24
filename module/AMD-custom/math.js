define('math', [], function name() {
    console.log('I am math module.')
    const add = (x, y) => {
        return x + y
    }
    const sub = (x, y) => {
        return x - y
    }
    return {
        add,
        sub
    }
})