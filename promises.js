import api from 'services/api'

let promisify = fn => (...args) =>
    new Promise((resolve, reject) =>
        fn(...args, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        })
    );


function* getUserInfo(userInfo) {
    try {
        let organizationInfo, orders;
        organizationInfo = yield promisify(api.getOrganizationInfo)(userInfo.id);
        if (userInfo.scopes.indexOf('orders') !== -1) {
            orders = yield promisify(api.getOrders)();
        }
        return { organizationInfo, orders };
    } catch (e) {
        console.log(e);
    }
}

function* processUser() {
    try {

        let userInfo = yield promisify(api.getUserCurrent)();

        if (userInfo) {
            yield* getUserInfo(userInfo);
        } else {
            try {
                let createUser = yield promisify(api.createUser)({ id: '4' });
                yield* getUserInfo({ id: 2, first_name: 'FName' });
            } catch (e) {
                console.log('Не в силах');
            }
        }

        return userInfo;
    } catch (e) {
        console.log(e);
    }
}


// additioanl functions
function execute(generator, yieldValue) {

    let next = generator.next(yieldValue);

    if (!next.done) {
        next.value.then(
            result => execute(generator, result),
            err => generator.throw(err)
        );
    } else {
        console.log(next.value);
    }
}



execute(processUser());