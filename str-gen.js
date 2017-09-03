function* idMaker(letter) {
    var index = 0;
    while (true)
        yield `${letter}_${++index}`;
}

function make(letter) {
    var gen = idMaker(letter);
    return function() {
        return gen.next().value;
    }
}

var foo = make('A')
var bar = make('B')

console.log(foo()) // -> A_1 
console.log(bar()) // -> B_1 
console.log(foo()) // -> A_2 
console.log(foo()) // -> A_3 
console.log(bar()) // -> B_2