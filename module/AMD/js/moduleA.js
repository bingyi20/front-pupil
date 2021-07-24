define(['math'], (math) => {
    let name = 'moduleA'
    const sayA_B = (a, b) => {
        console.log(`a + b = ${math.add(a, b)}`)
        console.log(`a - b = ${math.sub(a, b)}`)
    }
    return {
        name,
        sayA_B
    }
})