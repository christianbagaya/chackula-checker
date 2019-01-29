var express = require("express"),
    app = express(),
    ejs = require("ejs"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    // bodyParser = require("body-parser"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user"),
    completedUrlLoggIn="";


mongoose.connect("mongodb://christianbagaya:22199855chris@ds155294.mlab.com:55294/arkonor", {useNewUrlParser: true}, ()=>{
    console.log("Database connected...")
});



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret:"22199855chris",
    resave: false,
    // expires: new Date(Date.now() + (60* 1000)),
    saveUninitialized: false,
    }));


passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

//The DDL definition of the schema
var Mealschema = new mongoose.Schema({
    mealName: String,
    price: String,
});

var MealModelArkonor = mongoose.model("Meal", Mealschema);
var MealModelBigBen= mongoose.model("MealMealBigben", Mealschema);
var DrinkModelArkonor = mongoose.model("Drinks", Mealschema);
var DrinkModelBigBen = mongoose.model("DrinksBigben", Mealschema);





//home route for both bigben and Arkornor
app.get("/", function(req, res) {
    // console.log(MealModelArkonor.find({}));
    res.render("index");
    
})




//**********************************************Arkonor******************************************************************************

//get route that shows the available meals
app.get("/Arkornor/meals", function(req, res, next){
    DrinkModelArkonor.find({}, function(err, foundDrinks) {
        if(err){
            console.log(err);
        }else{
            // console.log(res.end(JSON.stringify(foundDrinks)));
            MealModelArkonor.find({}, function(err, foundMeals) {
                if(err){
                    console.log(err);
                }else{
                    // res.render("login");
                    // console.log("hello world");
                    var meals = foundMeals;
                    var drinks = foundDrinks;
                    var mealsanddrinks = [];
                    mealsanddrinks.push(meals);
                    mealsanddrinks.push(drinks);
                    req.mealsanddrinks = mealsanddrinks;
                    next();
                    }
                 })
              }
                
             })
             }, function(req, res) {
                //  var a = req.mealsanddrinks;
                //  console.log(req.mealsanddrinks);
                 res.render("showArkonor",{myFood:req.mealsanddrinks});
                 
             });

//input route where the user can input

app.post("/Arkornor/meals", function(req, res){
   var name = req.body.mealName;
   var price = req.body.price;
   MealModelArkonor.create({mealName:name,price:price}, function(err, {mealName:name}){
       if(err){
           console.log(err);
       }
       else{
           res.redirect("/adminPage/Arkornor/meals/new/meals");
       }
   })
   
});

//insert drinks for arkonor
app.post("/Arkornor/drinks", function(req, res) {
    var drinkName = req.body.drinkName;
    var price = req.body.price;
    DrinkModelArkonor.create({mealName:drinkName, price:price}, function(err, {mealName:name}) {
        if(err){
            console.log("Error");
        }
        else{
            res.redirect("/adminPage/Arkornor/meals/new/drinks");
        }
    })
    
})

//get the admin page
app.get("/adminPage/Arkornor", function(req, res) {
   res.render("AdminMain"); 
});
//Admin can add a new meal
app.get("/adminPage/Arkornor/meals/new/meals", isLoggedIn, function(req, res) {
    MealModelArkonor.find({}, function(err, foundMeals){
        if(err){
            console.log(err);
        }
        else{
          res.render("newArkonor",{myEntries:foundMeals});    
        }
    });
    // res.render("new",{entry:myEntries});
});
app.get("/adminPage/Arkornor/meals/new/drinks", isLoggedIn, function(req, res) {
    DrinkModelArkonor.find({},function(err, foundDrinks) {
        if(err){
            console.log(err);
        }
        else{
            res.render("newDrinkArkonor", {myDrinks:foundDrinks});
        }
    });    
});

//***********************************************End of Arkonor**********************************************************************

//**********************************************Big Ben******************************************************************************

app.get("/BigBen/meals", function(req, res, next){
    DrinkModelBigBen.find({}, function(err, foundDrinks) {
        if(err){
            console.log(err);
        }else{
            // console.log(res.end(JSON.stringify(foundDrinks)));
            MealModelBigBen.find({}, function(err, foundMeals) {
                if(err){
                    console.log(err);
                }else{
                    // res.render("login");
                    // console.log("hello world");
                    var meals = foundMeals
                    var drinks = foundDrinks;
                    var mealsanddrinks = [];
                    mealsanddrinks.push(meals);
                    mealsanddrinks.push(drinks);
                    req.mealsanddrinks = mealsanddrinks;
                    next();
                    }
                 })
              }
                
             })
             }, function(req, res) {
                //  var a = req.mealsanddrinks;
                //  console.log(req.mealsanddrinks);
                 res.render("showBigBen",{myFood:req.mealsanddrinks});
                 
             });

//input route where the user can input

app.post("/BigBen/meals",isLoggedIn, function(req, res){
   var name = req.body.mealName;
   var price = req.body.price;
   MealModelBigBen.create({mealName:name, price:price}, function(err, {mealName:name}){
       if(err){
           console.log(err);
           
       }
       else{
           res.redirect("/adminPage/BigBen/meals/new/meals");
       }
   })
   
});

//Insert BigBen drinks
app.post("/BigBen/drinks",isLoggedIn, function(req, res) {
    var drinkName = req.body.drinkName;
    var price = req.body.price;
    DrinkModelBigBen.create({mealName:drinkName, price:price}, function(err, {mealName:name}) {
        if(err){
            console.log("Error");
        }
        else{
            res.redirect("/adminPage/BigBen/meals/new/drinks");
        }
    })
    
})


//Admin main page


app.get("/adminPage/BigBen",isLoggedIn, function(req, res) {
   res.render("AdminMainBigben"); 
});
//Admin can add a new meal
app.get("/adminPage/BigBen/meals/new/meals",isLoggedIn, function(req, res) {
    MealModelBigBen.find({}, function(err, foundMeals){
        if(err){
            console.log(err);
        }
        else{
          res.render("newBigBen",{myEntries:foundMeals});    
        }
    });
});

//rendiring the page to insert a new drink
app.get("/adminPage/BigBen/meals/new/drinks",isLoggedIn, function(req, res) {
    DrinkModelBigBen.find({}, function(err, foundDrinks){
        if(err){
            console.log(err);
        }
        else{
          res.render("newDrinkBigBen",{myDrinks:foundDrinks});    
        }
    });
});


//**********************************************End of BigBen***********************************************************************







// Destroys

//delete a post

//****************************Delete Arkonor ******************************************
app.delete("/adminPage/Arkornor/meals/:id",isLoggedIn, function(req, res){
    MealModelArkonor.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.send("Error, Not removed, try again");
        }
        else{
            res.redirect("/adminPage/Arkornor/meals/new/meals");
        }
    })
    // res.send("Hello world");
});

app.delete("/adminPage/Arkornor/drinks/:id",isLoggedIn, function(req, res){
    DrinkModelArkonor.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.send("Error, Not removed, try again");
        }
        else{
            res.redirect("/adminPage/Arkornor/meals/new/drinks");
        }
    })
    // res.send("Hello world");
});

//***********************************************End of delete arkonor ****************************

//**********************************************Delete BigBen****************************************
app.delete("/adminPage/BigBen/meals/:id",isLoggedIn, function(req, res){
    MealModelBigBen.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.send("Error, Not removed, try again");
        }
        else{
            res.redirect("/adminPage/BigBen/meals/new/meals");
        }
    })
    // res.send("Hello world");
});

app.delete("/adminPage/BigBen/drinks/:id",isLoggedIn, function(req, res){
    DrinkModelBigBen.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.send("Error, Not removed, try again");
        }
        else{
            res.redirect("/adminPage/BigBen/meals/new/drinks");
        }
    })
});

//**********************************************End of delete Bigben*********************************

//*********************************************authentication****************************************

    



// app.set('view engine','ejs');
// app.use(bodyParser.urlencoded({extended:true}));



// app.get("/",isLoggedIn, function(req, res){
//   res.render("home"); 
// });

// app. get("/secret", function(req, res){
//     res.render("secretPage");
// });

//***************
// Routes
//****************

// Auth routs

app.get("/login", function(req, res) {
    res.render("login");
});


//Handling user signup
//middleware

// app.post("/login",function (req, res, next){
//                 completedUrlLoggIn = req.body.username;
//                 req.a = completedUrlLoggIn;
//                 console.log(completedUrlLoggIn);
//                 return next(completedUrlLoggIn);
//                 }
    
//         , passport.authenticate("local", {
            
//             successRedirect: "/adminPage/",
//             failureRedirect: "/login"
//         })
        
        // function(req, res) {
        //     console.log(req.body.username);
        // }
    //);



app.post('/login',
  passport.authenticate('local',{failureRedirect: "/login"}),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/adminPage/' + req.user.username);
  });

User.find({}, function(err, username){
    if(err){
        console.log(err)
    }else{
        var a = {usernames:username};
        console.log(a);
        // console.log(a.username);
    }
    
});



//SIGN UP ROUTES
//Login routes
//render login form
app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res){
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       } 
       else{
           passport.authenticate("local")(req, res, function(){
              res.redirect("/adminPage");
           });
       }
    });
});
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function callbackClosure(i, callback) {
  return function() {
    return callback(i);
  }
}

function userLoggedIn(req, res, next){
    completedUrlLoggIn = req.body.username;
    console.log(completedUrlLoggIn);
    return next();
}



// *********************************************Function for putting creating the json object that will be viewed on the page******************

function arkonorMealsAndDrinks(){
    
    MealModelArkonor.find({}, function(err, foundMeals){
        var meals;
        var drinks;
        var mealsAndDrinksJson = {};
        if(err){
            console.log(err);
        }
        else{
            mealsAndDrinksJson.Meals=foundMeals;
            // DrinkModelArkonor.find({}, function(err, foundDrinks) {
            //     if(err){
            //         console.log(err);
            //     }else{
            //         mealsAndDrinksJson.Drinks = foundDrinks;
            //     }
            // });
                
        }
        console.log(mealsAndDrinksJson);
        return mealsAndDrinksJson;
    });
    
    

}
// *********************************************************

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Theserver is Listening");
});