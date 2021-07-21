define(function () {
    let name = "math"
    const add = (a, b) => {
        return a + b
    }
    const sub = (a, b) => {
        return a - b
    }
    return {
        name,
        add,
        sub
    }
})