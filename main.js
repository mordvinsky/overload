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
    key: "~",
    code: ~MAGIC_A,
    unary: true
  },
  {
    key: "+u",
    code: +MAGIC_A,
    unary: true
  },
  {
    key: "-u",
    code: -MAGIC_A,
    unary: true
  },
];

// ИНИЦИАЛИЗАЦИЯ
export const OverloadObserver = {};
OverloadObserver.storage = {};
OverloadObserver.resolve = ( code ) => {
  const {key} = operators.find(entry => entry.code === code);
  const result = OverloadObserver.resolve[key]();
  OverloadObserver.leftArg = null;
  OverloadObserver.rightArg = null;
  return result
};

// Динамическое создание методов перегрузок вида Overload["+"] и вспомогательных методов разрешения перегрузок
operators.forEach(({key, unary}) => {
  if (unary) {
    Overload[key] = function( leftProto, overloadingFn ) {
      OverloadObserver.storage[key].push({
        leftProto,
        overloadingFn
      });
    };
  } else {
    Overload[key] = function( leftProto, rightProto, overloadingFn ) {
      OverloadObserver.storage[key].push({
        leftProto,
        rightProto,
        overloadingFn
      });
    };
  }

  OverloadObserver.resolve[key] = () => {
    const match = OverloadObserver.storage[key].find(rule => {
      if ( !( OverloadObserver.leftArg instanceof rule.leftProto ) ) return false;
      if ( !unary && !( OverloadObserver.rightArg instanceof rule.rightProto ) ) return false;
      return true;
    });
    if ( !match || !match.overloadingFn ) return console.error("| OVERLOAD RESOLVE FAILED | Can't find overloading function");
    return match.overloadingFn(OverloadObserver.leftArg, OverloadObserver.rightArg);
  };
  OverloadObserver.storage[key] = [];
});

/** Делаем объект доступным для перегрузок*/
export function makeOverloadable( instance ) {
  instance.valueOf = exoticValueOf(instance);
  return instance;
}

function exoticValueOf(instance) {
  return function (  ) {
    if ( !OverloadObserver.leftArg ) {
      OverloadObserver.leftArg = instance;
      return MAGIC_A;
    }
    if ( !OverloadObserver.rightArg ) {
      OverloadObserver.rightArg = instance;
      return MAGIC_B;
    }
    console.error("| OVERLOADING VALUE OF | CRITICAL ERROR: BUFFER IS ALREADY OCCUPIED");
    return NaN;
  }
}

/** Функция-обертка для перегрузки. В неё помещается выражение: E(obj + obj)*/
export function E( e ) {
  return OverloadObserver.resolve(e);
}

export function Overload(e) {
  return OverloadObserver.resolve(e);
}

/** Функция-обертка, преобразует примитивное значение в overloadable объект */
export function $( e ) {
  if (OverloadObserver.leftArg && OverloadObserver.rightArg) return OverloadObserver.resolve(e)
  return createOverloadablePrimitive(e);
}

function createOverloadablePrimitive(value) {
  const context = {
    value,
    __proto__: value.__proto__
  }
  return makeOverloadable(context);
}
