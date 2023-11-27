

// Import crypto module for generating coupons
const crypto = require('crypto');

// Define a class for user data
class User {
  constructor(phoneNum, availableAmount = 0) {
    this.phoneNum = phoneNum; // User's phone number
    this.availableAmount = availableAmount; // Current balance in the user's wallet
  }

  toString() {
    return `User: ${this.phoneNum}, Available Amount: ${this.availableAmount}`;
  }
}

// Define a class for transaction data
class Transaction {
  constructor(from, to, amount) {
    this.from = from; // The sender's phone number
    this.to = to; // The recipient's phone number
    this.amount = amount; // The amount to be transferred
  }

  toString() {
    return `Transaction: From ${this.from} to ${this.to}, Amount: ${this.amount}`;
  }
}

// Define a global variable for storing users
let users = {};

// Define a global variable for storing transactions
let transactions = [];

// Define a function for logging in a user
function logIn(phoneNum) {
  // Check if the user exists
  if (users[phoneNum]) {
    // Welcome the existing user
    console.log(`Welcome back, ${phoneNum}!`);
  } else {
    // Create a new user
    users[phoneNum] = new User(phoneNum);
    // Ask the user to add an initial amount
    console.log(`Welcome, ${phoneNum}! Please enter an initial amount to add to your wallet:`);
    // Get the input from the user
    let amount = Number(prompt());
    // Validate the input
    if (isNaN(amount) || amount <= 0) {
      // Reject the invalid input
      console.log(`Invalid amount. Please try again.`);
      // Return null to indicate failure
      return null;
    } else {
      // Add the amount to the user's wallet
      users[phoneNum].availableAmount += amount;
      // Confirm the successful operation
      console.log(`You have added ${amount} to your wallet. Your current balance is ${users[phoneNum].availableAmount}.`);
    }
  }
  // Return the user object to indicate success
  return users[phoneNum];
}

// Define a function for transferring an amount
function transferAmount(user, amount, recipient) {
  // Check if the user has sufficient balance
  if (user.availableAmount < amount) {
    // Reject the transfer
    console.log(`You do not have enough balance to transfer ${amount}. Your current balance is ${user.availableAmount}.`);
    // Return false to indicate failure
    return false;
  } else {
    // Check if the recipient exists
    if (users[recipient]) {
      // Deduct the amount from the user's wallet
      user.availableAmount -= amount;
      // Credit the amount to the recipient's wallet
      users[recipient].availableAmount += amount;
      // Create a new transaction
      let transaction = new Transaction(user.phoneNum, recipient, amount);
      // Add the transaction to the global list
      transactions.push(transaction);
      // Confirm the successful transfer
      console.log(`You have transferred ${amount} to ${recipient}. Your current balance is ${user.availableAmount}.`);
      // Return the transaction object to indicate success
      return transaction;
    } else {
      // Reject the transfer
      console.log(`The recipient ${recipient} does not exist. Please enter a valid phone number.`);
      // Return false to indicate failure
      return false;
    }
  }
}

// Define a function for handling cashback
function cashbackHandling(transaction) {
  // Check if the amount is a multiple of 500
  if (transaction.amount % 500 == 0) {
    // Generate a random coupon or a message
    let coupon = crypto.randomBytes(4).toString('hex');
    let message = 'Better luck next time!';
    let result = Math.random() < 0.5 ? coupon : message;
    // Show the result to the user
    console.log(`You have received a special offer: ${result}.`);
  } else {
    // Calculate the cashback percentage based on the amount
    let percentage = transaction.amount < 1000 ? 0.05 : 0.02;
    // Calculate the cashback amount
    let cashback = transaction.amount * percentage;
    // Credit the cashback to the user's wallet
    users[transaction.from].availableAmount += cashback;
    // Show the cashback details to the user
    console.log(`You have received a cashback of ${cashback}. Your current balance is ${users[transaction.from].availableAmount}.`);
  }
}

// Define a function for displaying information
function displayInformation(user) {
  // Show the available amount of the user
  console.log(`Your current balance is ${user.availableAmount}.`);
  // Show the transaction list of the user
  console.log(`Your transaction history is:`);
  for (let transaction of transactions) {
    if (transaction.from == user.phoneNum || transaction.to == user.phoneNum) {
      console.log(transaction.toString());
    }
  }
}

// Define a function for simulating user input
function prompt() {
  // Return a random number between 1 and 2000
  return Math.floor(Math.random() * 2000) + 1;