import { C, E, makeOverloadable, operators, Overload } from "./main.js";

operators.forEach(({code}) => {console.log(code)})

class Wallet {
  constructor( money ) {
    this.money = money;
    makeOverloadable(this); // Делаем доступным для перегрузок. Иначе не будет в них участвовать.
  }
}

const w1 = new Wallet(200);
const w2 = new Wallet(100);

// Синтаксис объявления перегрузки
Overload["+"](Wallet, Wallet, (left, right ) => {
  return left.money + right.money;
});

Overload["-"](Wallet, Wallet, (left, right) => {
  return left.money - right.money;
})

Overload["+"](Wallet, Number, (left, right) => { // Когда один из аргументов примитив или массив внутри функции он доступен через arg.value, т.к. вызов возможен только через C(arg)
  return left.money + right.value;
})

Overload["+"](Wallet, String, (l, r) => { // Когда один из аргументов примитив или массив внутри функции он доступен через arg.value, т.к. вызов возможен только через C(arg)
  return l.money + r.value
})

Overload["<<"](Array, Array, (l, r) => { // Когда один из аргументов примитив или массив внутри функции он доступен через arg.value, т.к. вызов возможен только через C(arg)
  l.value.push(...r.value);
  return l;
})

Overload["~"](Wallet, (arg) => {
  console.log("TILDA OPERATOR");
  return arg;
})


console.log("start test");

console.log(
  E(w1 + w2) // Е функция обертка, от Evaluate. Возвращает результат перегрузки. 300
);

console.log(
  E(w1 - w2) // 100
);

console.log(
  E(w1 + C(1000)) // 1200. Примитивы заворачиваются в C(). Внутри перегрузок значения примитива доступны через arg.value
);

console.log(
  E(w1 + C("he")) //  Примитивы заворачиваются в C(). Внутри перегрузок значения примитива доступны через arg.value
)

console.log(
  E(C([1,2,3]) << C([4,5,6])) //  Массивы тоже заворачиваются в C(), чтобы не изменять нативные Array.prototype.valueOf. Массив доступен внутри функции перегрузки через arg.value
)

console.log(
  E(~w1)
)
