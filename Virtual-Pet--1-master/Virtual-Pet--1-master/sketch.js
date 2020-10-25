//declare the variables.
var dog;
var dogImg;
var happyDogImg;
var database;
var foodS;
var foodObj;

var fedTime;
var lastFed;

function preload() {
  //load the images.
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(500, 500);
  //use the database.
  database = firebase.database();
  //refer to "FOOD" in the database.
  foodS = database.ref("Food");
  //create a listener to listen to all the changes in the database.
  foodS.on("value", readStock);

  //create the dog sprite.
  dog = createSprite(400, 400, 20, 20);
  dog.scale = 0.2;
  dog.addImage(dogImg);

  foodObj = new Food(200, 200);
  foodObj.scale = 0.1;
}


function draw() {
  background(46, 139, 87);

  //write text.
  textSize(20);
  fill(255);
  stroke("red");
  text("'Hi, I am your pet dog, My name is Snoopy.You can also feed me'", 50, 400, 300, 300);

  foodObj.display();

  if (foodS !== undefined) {
    //write text.
    textSize(20);
    fill(255);
    stroke("red");
    text("Food Remaining: " + foodS, 150, 50);

    feed = createButton("Feed the Dog");
    feed.position(700, 150);
    feed.mousePressed(FeedDog);

    add = createButton("Add Food");
    add.position(375, 150);
    add.mousePressed(AddFood);

    fedTime = database.ref('FeedTime');
    fedTime.on("value", function (data) {
      lastFed = data.val();
    })

    fill(255, 255, 255);
    textSize(15);
    if (lastFed >= 12) {
      text("Last Fed : " + lastFed % 12 + "PM", 350, 30);
    } else if (lastFed == 0) {
      text("Last Fed : 12AM", 350, 350);
    } else {
      text("Last Fed :" + lastFed + "AM", 350, 30);
    }

    drawSprites();
  }
}
//read the stock value (which is 30)and store the value in the variable foodS.
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
//write stock.
function writeStock(x) {
  //if the food stock is greater than 0, it will decrease by 1. if it is lesser than or equal to 0, it will be 0.
  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }
  //refer and update that food is x.
  database.ref("/").update({
    Food: x
  })
}

function FeedDog() {
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1)
  database.ref('/').update({

    Food: foodObj.getFoodStock(),
    FeedTime: hour()

  })

}

function AddFood() {
  foodS++
  database.ref('/').update({
    Food: foodS
  })
}