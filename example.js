import { $, E, makeOverloadable, Overload, operators} from "./main.js";

// console.group("operators codes:")
operators.forEach(({code}) => {console.log(code)})
// console.groupEnd()
// console.log(" ")

class Wallet {
  constructor( money ) {
    this.money = money;
    makeOverloadable(this); // Делаем доступным для перегрузок. Иначе не будет в них участвовать.
  }
}

const w1 = new Wallet(200);
const w2 = new Wallet(100);

// Синтаксис объявления перегрузки
Overload["+"](Wallet, Wallet, ( left, right ) => {
  return left.money + right.money;
});

Overload["-"](Wallet, Wallet, ( left, right) => {
  return left.money - right.money;
})

Overload["+"](Wallet, Number, ( left, right) => { // Когда один из аргументов примитив или массив внутри функции он доступен через arg.value, т.к. вызов возможен только через C(arg)
  return left.money + right.value;
})

Overload["+"](Wallet, String, ( l, r) => { // Когда один из аргументов примитив или массив внутри функции он доступен через arg.value, т.к. вызов возможен только через C(arg)
  return l.money + r.value
})

Overload["<<"](Array, Array, ( l, r) => { // Когда один из аргументов примитив или массив внутри функции он доступен через arg.value, т.к. вызов возможен только через C(arg)
  l.value.push(...r.value);
  return l;
})

Overload["~"](Wallet, ( arg) => {
  return "TILDA";
})


console.log("start test");
console.log("Different syntax")

console.log(
  Overload(~w1),
  E(~w1),
  $(~w1)
)


