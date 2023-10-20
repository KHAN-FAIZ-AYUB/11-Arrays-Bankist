'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // .textContent=0

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);
// console.log(containerMovements.innerHTML);

// ////////////////////////////////////////////////////////////

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

// ///////////////////////////////////////////////////////////

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const intrest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${intrest}€`;
};
// calcDisplaySummary(account1.movements);

// ///////////////////////////////////////////////////////////

const creaUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
creaUserNames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(currentAccount.movements);

  // Display balance
  calcDisplayBalance(currentAccount);

  // Display summarr
  calcDisplaySummary(currentAccount);
};

//  Event Handler

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    //  Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // ADD movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account8=
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/*
/////////////////////////////////////////////////
// Simple Array Methods

let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// SPLICE
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const latters = arr.concat(arr2);
console.log(latters);
console.log([...arr, ...arr2]);

// JOIN
console.log(latters.join(' - '));
*/

///////////////////////////////////////
// The new at Method
/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// getting last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('khan'.at(0));
console.log('faiz'.at(-1));
*/

///////////////////////////////////////
// Looping Arrays: forEach
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('---- FOREACH ----');

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You depostited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});
*/

///////////////////////////////////////
// forEach With Maps and Sets
// Map
/*
const currencies = new Map([
  ['USD', 'United States doller'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
*/

/*
///////////////////////////////////////
// Coding Challenge #1

// TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

const chechDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  // dogsJulia.slice(1,3)
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(dogs);

  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(
        `Dog number ${i + 1} is an adult, and is ${dog} years of old`
      );
    } else {
      console.log(`Dog number ${i + 1} ia still a puppy🐶`);
    }
  });
};

chechDogs([9, 16, 6, 8, 3], [4, 1, 15, 8, 3]);
*/

/*
///////////////////////////////////////
// The map Method


const movements= [200, 450, -400, 3000, -650, -130, 70, 1300]

const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${math.abs(
      mov
    )}`
);
console.log(movementsDescription);
*/

/*
///////////////////////////////////////
// The filter Method
const deposits = account1.movements.filter(function (mov) {
  return mov > 0;
});
console.log(account1.movements);
console.log(deposits);

const withdrawals = account1.movements.filter(mov => mov < 0);
console.log(withdrawals);

//using forOf loop

const depositFor = [];
for (const mov of account1.movements) if (mov > 0) depositFor.push(mov);
console.log(depositFor);

const withdrawalFor = [];
for (const mov of account1.movements) if (mov < 0) withdrawalFor.push(mov);
console.log(withdrawalFor);
*/

/*
///////////////////////////////////////
// The reduce Method

console.log(movements);

// accumulator -> SNOWBALL

// const balance = account1.movements.reduce(function (acc, curr, i, arr) {
//   console.log(`Iteration ${i}: ${acc} `);
//   return acc + curr;
// }, 0);
// console.log(balance);

const balance = movements.reduce((acc, curr) => acc + curr, 0);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// MAXIMUM value

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);
*/

/*
///////////////////////////////////////
// Coding Challenge #2

const calcAverageHumanAge1 = function (ages) {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adultDog = humanAge.filter(age => age >= 18);
  console.log(humanAge);
  console.log(adultDog);

// const average=adultDog.reduce((acc,age)=>acc+age,0)/adultDog.length

  const average=adultDog.reduce((acc,age,i,arr)=>acc+age/arr.length,0)
  return average
};
const avg1=calcAverageHumanAge1([5, 2, 4, 1, 15, 8, 3]);
const avg2=calcAverageHumanAge1([16, 6, 10, 5, 6, 1, 4])
console.log(avg1, avg2)
*/

/*
///////////////////////////////////////
// The Magic of Chaining Methods

const eurToUsd = 1.1;
console.log(movements);

// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);
*/

/*
///////////////////////////////////////
// Coding Challenge #3

const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// adults.length

const age1=calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3])
const age2=calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4])
console.log(age1,age2)
*/

/*
///////////////////////////////////////
// The Find Method

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

// /////////////////////////////////////////////////////

for (const acc of accounts) if
  (acc.owner === 'Jessica Davis');
  console.log(acc);
*/

/*
///////////////////////////////////////
// some and every

console.log(movements);

// EQUALITY
console.log(movements.includes(-130));

// SOME: CONDITION
console.log(movements.some(mov => mov === -130));

const anyDeposite = movements.some(mov => mov > 0);
console.log(anyDeposite);

// EVERY
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Seprate callback
const deposit = mov => mov > 0;
console.log(movements.every(deposit));
console.log(movements.some(deposit));
console.log(movements.filter(deposit));
*/

/*
///////////////////////////////////////
// flat and flatMap

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// ///////////////////////////////////////////
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMOvements = accountMovements.flat();
console.log(allMOvements);
const overAllMovements = allMOvements.reduce((acc, mov) => acc + mov, 0);
console.log(overAllMovements);

// ////////////////////////////////////////////
const overAllBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overAllBalance);
*/

/*
///////////////////////////////////////
// Sorting Arrays

// Strings
const owners = ['faiz', 'faisal', 'fareen'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);

// return < 0 A,B (keep order)
// return > 0 B,A (switch order)

// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements);

// Decending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/

/*
///////////////////////////////////////
// More Ways of Creating and Filling Arrays

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Empty arrays + fill method
const x = new Array(7);
console.log(x);
// console.log(x.map(() => 7)); (This wont work)
x.fill(23, 2, 4);
// x.fill(8, 1, 6);
console.log(x);

arr.fill(11, 4, 6);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__values')];
  console.log(movementsUI2);
});
*/

/*
///////////////////////////////////////
// Array Methods Practice

// 1.

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, cur) => acc + cur, 0);
console.log(bankDepositSum);

// 2.
// const numDeposite1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposite1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposite1000);

// Prefix ++operator
let a = 10;
console.log(++a);
console.log(a);

// 3.
const { deposit, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposit += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposit' : 'withdrawals'] += cur;
      return sums;
    },
    { deposit: 0, withdrawals: 0 }
  );
console.log(deposit, withdrawals);

// 4.
// this is a nice title-> This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exception = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titlleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exception.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titlleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/

///////////////////////////////////////
// Coding Challenge #4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// a.
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// b.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : little
  }`
);
