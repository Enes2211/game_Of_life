// var obj ={
//     "first_name": "Vardan",
//     "last_name" : "Hovsepyan",
//     "age": 13,
//     "tumo_Student": true
// }

// console.log(obj.first_name)
// console.log(obj.last_name)
// console.log(obj.age)
// console.log(obj.tumo_Student)



var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.send("<h1>Hello world</h1>");
});
app.get("/name/:name", function (req, res) {
  var name = req.params.name;
  res.send("<h1>Hello " + name + " </h1");
});
app.listen(3000, function () {
  console.log("Example is running on port 3000");
});
app.get("/google", function (req, res) {
  res.redirect("https://www.google.com/search?q=");
});
app.get("/")

var Square = require("./module")
var mySquareObject =  new Square (5);

function main(){
    console.log(mySquareObject.getArea());
}
