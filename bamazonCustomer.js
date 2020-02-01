var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Harkirat02",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connection is good");
  afterConnection();
});

var afterConnection = function () {
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " || " +
        res[i].product_name + "||" +
        res[i].department_name + "||" +
        res[i].price + "||" +
        res[i].stock_quantity + "\n");
    }
    userSelection(res);
  })
}

var userSelection = function (res) {
  inquirer.prompt([{
    type: 'input',
    name: 'choice',
    message: "What would you like to buy?[quit with Q]"

  }]).then(function (answer) {
    var correct = false;
    if (answer.choice.toUpperCase() == "Q") {
      process.exit();
    }
    for (var i = 0; i < res.length; i++) {
      if (res[i].product_name === answer.choice) {
        correct = true;
        var product = answer.choice;
        var id = i;
        inquirer.prompt({
          type: 'input',
          name: 'quantity',
          message: "how much  would you like to buy?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
        }).then(function (answer) {
          if ((res[id].stock_quantity - answer.quantity) > 0) {
            connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - answer.quantity) + "'WHERE product_name='" + product + "'", function (err, res2) {
              console.log("you got it!");
              afterConnection();
            })
          } else {
            console.log("opps we dont have it");
            userSelection(res);
          }
        })
      }
    }
    if (i == res.length && correct == false) {
      console.log("not a valid choice");
      userSelection(res);
    }
  })
}