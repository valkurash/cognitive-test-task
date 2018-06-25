import api from 'services/api'

/*
 * api.createUser(data, callback) -> {} результатом является только код ответа (201/400/...)
 * api.getUserCurrent(callback) -> { id: 1, first_name: 'FName', last_name: 'LName', organization_id: 3, scopes: ['management', 'orders'] }
 * api.getOrders(callback) -> { items: [...], items_count: 10 }
 * api.getOrganizationInfo(id, callback) -> { information... }
 * api.pathOrganization(id, data, callback) -> // обновляет информацию об организации
 *
 * результат работы методов передается в callback(error, data) в стандартном для nodejs стиле
 * т.е. в случае ошибки error будет содержать информацию об ошибке, иначе error === null
 * в случае успеха, данные будут переданны вторым параметром: (calback(null, payload))
 * Примерные форматы ответов описаны после `->`
 */


/* task
 *
 * Необходимо реализовать следующий сценарий
 *
 * 0) Запрашиваем информацию о текущем пользователе
 * 1.0) Если есть информация о пользователе
 * 1.0.0) Сохраняем информацию о пользователе
 * 1.0.1) Запрашиваем информацию об организации (считаем, что у пользователя всегда есть организация) и сохраняем ее
 * 1.0.2) Если userInfo.scopes.indexOf('orders') !== -1, запрашиваем список заявок (getOrders)
 * 1.1) Если нету информации о пользователе
 * 1.1.0) Создаем пользователя с помощью createUser. data значения не имеет, в данном случае можно послать любую информацию
 * 1.1.1) В случае успеха, считаем, что сервер выдал сессию и нам надо вернуться к шагу 0)
 * 1.1.2) В случае ошибки, console.log('Не в силах')
 *
 */

/**
 * PS.
 * - Нет никаких ограничений
 * - Серверную часть и api реализовывать не требуется, считаем, что код реализации нам не подконтролен
 * - Никакого UI не требуется
 * - Код запускать не будем, только обсудим написанный код
 * - Можно предложить и написать несколько вариантов
 *
 * - Желательно попробовать написать реализацию для redux-sagas
 */

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
    return {
      organizationInfo,
      orders
    };
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
        let createUser = yield promisify(api.createUser)({
          id: '4'
        });
        yield* getUserInfo({
          id: 2,
          first_name: 'FName'
        });
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
