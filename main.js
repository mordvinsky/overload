/** Магическое число, которое дает уникальный результат при всех операциях */
export const MAGIC_A = -42;
/** Магическое число, которое дает уникальный результат при всех операциях */
export const MAGIC_B = 13;

/** Доступные для перегрузки операторы. +u и -u это унарные плюс и минус*/
export const operators = [
  {
    key: "+",
    code: MAGIC_A+MAGIC_B,
  },
  {
    key: "-",
    code: MAGIC_A-MAGIC_B
  },
  {
    key: "*",
    code: MAGIC_A*MAGIC_B
  },
  {
    key: "/",
    code: MAGIC_A/MAGIC_B
  },
  {
    key: "**",
    code: MAGIC_A**MAGIC_B
  },
  {
    key: "&",
    code: MAGIC_A&MAGIC_B
  },
  {
    key: "|",
    code: MAGIC_A|MAGIC_B
  },
  {
    key: "^",
    code: MAGIC_A^MAGIC_B
  },
  {
    key: "%",
    code: MAGIC_A%MAGIC_B
  },
  {
    key: "~",
    code: ~MAGIC_A
  },
  {
    key: "<<",
    code: MAGIC_A<<MAGIC_B
  },
  {
    key: ">>",
    code: MAGIC_A>>MAGIC_B
  },
  {
    key: ">>>",
    code: MAGIC_A>>>MAGIC_B
  },
  {
    key: "+u",
    code: +MAGIC_A
  },
  {
    key: "-u",
    code: -MAGIC_A
  }
];

// ИНИЦИАЛИЗАЦИЯ
export const Overload = () => {};
Overload.storage = {};
Overload.resolve = ( code ) => {
  const {key} = operators.find(entry => entry.code === code);
  const result = Overload.resolve[key]();
  Overload.leftArg = null;
  Overload.rightArg = null;
  return result
};

// Динамическое создание методов перегрузок вида Overload["+"] и вспомогательных методов разрешения перегрузок
operators.forEach(({key}) => {
  Overload[key] = function( leftProto, rightProto, overloadingFn ) {
    Overload.storage[key].push({
      leftProto,
      rightProto,
      overloadingFn
    });
  };
  Overload.resolve[key] = () => {
    const match = Overload.storage[key].find(rule => {
      console.log(rule)
      if ( !( Overload.leftArg instanceof rule.leftProto ) ) return false;
      if ( !( Overload.rightArg instanceof rule.rightProto ) ) return false;
      return true;
    });
    if ( !match || !match.overloadingFn ) return console.error("| OVERLOAD RESOLVE FAILED | Can't find overloading function");
    return match.overloadingFn(Overload.leftArg, Overload.rightArg);
  };
  Overload.storage[key] = [];
});

/** Делаем объект доступным для перегрузок*/
export function makeOverloadable( instance ) {
  instance.valueOf = exoticValueOf(instance);
  return instance;
}

function exoticValueOf(instance) {
  return function (  ) {
    console.log(instance);
    if ( !Overload.leftArg ) {
      Overload.leftArg = instance;
      return MAGIC_A;
    }
    if ( !Overload.rightArg ) {
      Overload.rightArg = instance;
      return MAGIC_B;
    }
    console.error("| OVERLOADING VALUE OF | CRITICAL ERROR: BUFFER IS ALREADY OCCUPIED");
    return NaN;
  }
}

/** Функция-обертка для перегрузки. В неё помещается выражение: E(obj + obj)*/
export function E( exp ) {
  return Overload.resolve(exp);
}

/** Функция-обертка, преобразует примитивное значение в overloadable объект */
export function C( value ) {
  const context = {
    value,
    __proto__: value.__proto__
  }
  return makeOverloadable(context);
}
