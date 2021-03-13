const name = 'wwl';

class People {
    constructor() {
        this.name = name
    }
}

console.log('assign',Object.assign({},{ name:'extend' }))

console.log('Map',new Map())

async function test(){
    await Promise.resolve();
}

export default People;

