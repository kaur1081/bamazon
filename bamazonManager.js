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
    loadMenu();
});

function loadMenu() {
    //loadMenu.function
    connection.query("SELECT * FROM products ", function (err, res) {
        if (err) throw err;
        console.table(res);
        productForSale(res);
    })
}

function productForSale(menu) {
    inquirer.prompt({
            type: "list",
            name: "choice",
            message: "would you like to view product list?",
            choices: ["view products for sale", "low inventory", "add inventory", "add a new product", "quit"]
        })
        .then(function (value) {
            switch (value.choice) {
                case "view products for sale":
                    loadMenu();
                    break;

                case "low inventory":
                    loadLowInventory();
                    break;

                case "add inventory":
                    addInventory();
                    break;
                default:
                    console.log("all done!");
                    process.exit(0);
                    break;

            }
        });
}

function loadLowInventory() {
    console.log(" product..\n");
    var query = connection.query("SELECT * FROM products WHERE  stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        console.table(res);

        loadMenu();
    });
}

function addInventory(inventory) {
    console.table(inventory);
    inquirer.prompt([{
        type: "input",
        name: "choice",
        message: "would you like to add more item to the inventory?",
        validate: function (value) {
            return !isNaN(value);
        }

    }]);

    .then(function (value) {
        var choiceId = parseInt(value.choice);
        var product = checkInventory(choiceId, inventory);
        if (product) {
            productQuantity(product);
        } else {
            console.log("this is not an item in the list")
            loadMenu();
        }
    });
}

function productQuantity(product) {
    inquirer.prompt([{
            type: "input",
            name: "quantity",
            message: "How many would you like to add?",
            validate: function (value) {
                return value > 0;
            }
        }])

        .then(function (value) {
            var quantity = parseInt(value.quantity);
            addQuantity(product, quantity);

        });
}

function addQuantity(product, quantity) {
    connection.query(
        "UPDATE products  SET stock_quantity =? WHERE item_id = ?",
        [product.stock_quantity + quantity, product.item_id],
        function (err, res) {
            console.log("\nSuccessfully added " + quantity + " " + product.product_name + " 's! \n");
            loadMenu();
        }
    );
}