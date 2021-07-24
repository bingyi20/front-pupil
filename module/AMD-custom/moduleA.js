define('moduleA', ['math'], (math) => {
    console.log('I am moduleA.')
    const sayApB = (a, b) => {
        console.log(`${a} + ${b} = ${math.add(a, b)}`)
    }
    const sayAsB = (a, b) => {
        console.log(`${a} - ${b} = ${math.sub(a, b)}`)
    }
    return {
        sayApB,
        sayAsB
    }
})