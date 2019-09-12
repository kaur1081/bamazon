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
    console.log("connected!!");
    productForSale()
});

function productForSale() {
    connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw err;
                console.log(res);
                connection.end();
            var viewProductPrompt = productForSale()
                function viewProductPrompt() {
                    inquirer
                        .prompt({
                            name: "product_name",
                            department: "department_name",
                            message: "would you like to view product list?",
                            choices: ["yes", "no", "EXIT"]
                        })
                        .then(function (answer) {

                            // based on their answer, either call the bid or the post functions
                            if (answer.yes === "productForSale") {
                                productForSale();
                            } else(exit) => {
                                console.log("opps we dont have it");
                                lowInventory();
                            }
                        });
                };

                function lowInventory() {
                    console.log("Updating product..\n");
                    var query = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [{
                            stock_quantity: 5
                        }],
                        function (err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + " products updated!\n");
                            // Call deleteProduct AFTER the UPDATE completes
                            lowInventory();
                        }
                      );
                    