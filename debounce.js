function debounce(method, ms) {
    let timeoutId, isFirstCall = true;

    function debounceWrapper(...args) {
        debounceWrapper.clear();

        if (isFirstCall) {
            method.apply(this, args);
            isFirstCall = false;
        } else {
            timeoutId = setTimeout(() => {
                timeoutId = null;
                method.apply(this, args);
            }, ms);
        }

    }

    debounceWrapper.clear = function() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    return debounceWrapper;
}


var foo = debounce(function(msg) {
    console.log(msg);
}, 5000)

foo('test 1')
setTimeout(() => foo('test 2'), 0)
setTimeout(() => foo('test 3'), 3000)
setTimeout(() => foo('test 4'), 7500)
setTimeout(() => foo('test 5'), 14000)