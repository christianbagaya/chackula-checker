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
    completedUrlLoggIn = "";
const port = 3000;

// "mongodb://christianbagaya:22199855chris@ds155294.mlab.com:55294/arkonor"

//To be commented out
// app.set('port', process.env.PORT || 8000);
// mongoose.connect("mongodb://localhost:27017/testChakula", { useNewUrlParser: true }, () => {
//     console.log("Database connected...")
// });

mongoose.connect("mongodb://christianbagaya:22199855chris@ds155294.mlab.com:55294/arkonor", { useNewUrlParser: true }, () => {
    console.log("Database connected...")
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "22199855chris",
    resave: false,
    // expires: new Date(Date.now() + (60* 1000)),
    saveUninitialized: false,
}));

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

//The DDL definition of the schema***********************DB Schema************************************************
var Mealschema = new mongoose.Schema({
    mealName: String,
    price: String,
    time: String,
});

var AnnouncementSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: String,
    time: String,
    createdAt: { type: Date, expires: 72000, default: Date.now },
});

//**********************************DB Models *********************************************************************************

var MealModelArkonor = mongoose.model("Meal", Mealschema);
var MealModelBigBen = mongoose.model("MealMealBigben", Mealschema);
var MealModelLynes = mongoose.model("MealLynes", Mealschema);
var DrinkModelArkonor = mongoose.model("Drinks", Mealschema);
var DrinkModelBigBen = mongoose.model("DrinksBigben", Mealschema);
var DrinkModelLynes = mongoose.model("DrinkLynes", Mealschema);
var AnnouncementModel = mongoose.model("Anouncementmodel", AnnouncementSchema);

//home route for both bigben and akorno
app.get("/", function (req, res) {
    AnnouncementModel.find({}, function (err, announcement) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { myAnnouncements: announcement });
        }
    });
    // console.log(MealModelArkonor.find({}));


})

app.get("/notFound", function (req, res, next) {
    res.render("notAvailable");
})



//**********************************************Arkonor******************************************************************************

//get route that shows the available meals
app.get("/akorno/meals", function (req, res, next) {
    DrinkModelArkonor.find({}, function (err, foundDrinks) {
        if (err) {
            console.log(err);
        } else {

            // console.log(res.end(JSON.stringify(foundDrinks)));
            MealModelArkonor.find({}, function (err, foundMeals) {
                if (err) {
                    console.log(err);
                } else {
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
}, function (req, res) {
    //  var a = req.mealsanddrinks;
    //  console.log(req.mealsanddrinks);
    res.render("showArkonor", { myFood: req.mealsanddrinks });

});

//input route where the user can input

app.post("/akorno/meals", function (req, res) {
    var name = req.body.mealName;
    var price = req.body.price;
    var moonLanding = new Date();
    var a = moonLanding.toString().split(" ");
    var myDate = a[1] + " " + a[2] + " " + a[4].substring(0, 5);


    MealModelArkonor.create({ mealName: name, price: price, time: myDate }, function (err, { mealName: name }) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/adminPage/akorno/meals/new/meals");
        }
    })

});

//insert drinks for arkonor
app.post("/akorno/drinks", function (req, res) {
    var drinkName = req.body.drinkName;
    var price = req.body.price;
    var moonLanding = new Date();
    var a = moonLanding.toString().split(" ");
    var myDate = a[1] + " " + a[2] + " " + a[4].substring(0, 5);

    DrinkModelArkonor.create({ mealName: drinkName, price: price, time: myDate }, function (err, { mealName: name }) {
        if (err) {
            console.log("Error");
        }
        else {
            res.redirect("/adminPage/akorno/meals/new/drinks");
        }
    })

})

//get the admin page
app.get("/adminPage/akorno", function (req, res) {
    res.render("AdminMain");
});
//Admin can add a new meal
app.get("/adminPage/akorno/meals/new/meals", isLoggedIn, function (req, res) {
    MealModelArkonor.find({}, function (err, foundMeals) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("newArkonor", { myEntries: foundMeals });
        }
    });
    // res.render("new",{entry:myEntries});
});
app.get("/adminPage/akorno/meals/new/drinks", isLoggedIn, function (req, res) {
    DrinkModelArkonor.find({}, function (err, foundDrinks) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("newDrinkArkonor", { myDrinks: foundDrinks });
        }
    });
});
//***********************************************End of Arkonor**********************************************************************




//******************************Big Ben**************************************************************

app.get("/BigBen/meals", function (req, res, next) {
    DrinkModelBigBen.find({}, function (err, foundDrinks) {
        if (err) {
            console.log(err);
        } else {
            // console.log(res.end(JSON.stringify(foundDrinks)));
            MealModelBigBen.find({}, function (err, foundMeals) {
                if (err) {
                    console.log(err);
                } else {
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

}, function (req, res) {
    //  var a = req.mealsanddrinks;
    //  console.log(req.mealsanddrinks);
    res.render("showBigBen", { myFood: req.mealsanddrinks });

});

//input route where the user can input

app.post("/BigBen/meals", isLoggedIn, function (req, res) {
    var name = req.body.mealName;
    var price = req.body.price;
    var moonLanding = new Date();
    var a = moonLanding.toString().split(" ");
    var myDate = a[1] + " " + a[2] + " " + a[4].substring(0, 5);


    MealModelBigBen.create({ mealName: name, price: price, time: myDate }, function (err, { mealName: name }) {
        if (err) {
            console.log(err);

        }
        else {
            res.redirect("/adminPage/BigBen/meals/new/meals");
        }
    })

});

//Insert BigBen drinks
app.post("/BigBen/drinks", isLoggedIn, function (req, res) {
    var drinkName = req.body.drinkName;
    var price = req.body.price;
    var moonLanding = new Date();
    var a = moonLanding.toString().split(" ");
    var myDate = a[1] + " " + a[2] + " " + a[4].substring(0, 5);

    DrinkModelBigBen.create({ mealName: drinkName, price: price, time: myDate }, function (err, { mealName: name }) {
        if (err) {
            console.log("Error");
        }
        else {
            res.redirect("/adminPage/BigBen/meals/new/drinks");
        }
    })

})




app.get("/adminPage/BigBen", isLoggedIn, function (req, res) {
    res.render("AdminMainBigben");
});
//Admin can add a new meal
app.get("/adminPage/BigBen/meals/new/meals", isLoggedIn, function (req, res) {
    MealModelBigBen.find({}, function (err, foundMeals) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("newBigBen", { myEntries: foundMeals });
        }
    });
});

//rendiring the page to insert a new drink
app.get("/adminPage/BigBen/meals/new/drinks", isLoggedIn, function (req, res) {
    DrinkModelBigBen.find({}, function (err, foundDrinks) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("newDrinkBigBen", { myDrinks: foundDrinks });
        }
    });
});


//**********************************************End of BigBen***********************************************************************





//**********************************Lynes******************************************************

app.get("/Lynes/meals", function (req, res, next) {
    DrinkModelLynes.find({}, function (err, foundDrinks) {
        if (err) {
            console.log(err);
        } else {
            // console.log(res.end(JSON.stringify(foundDrinks)));
            MealModelLynes.find({}, function (err, foundMeals) {
                if (err) {
                    console.log(err);
                } else {

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
}, function (req, res) {
    //  var a = req.mealsanddrinks;
    //  console.log(req.mealsanddrinks);
    res.render("showLynes", { myFood: req.mealsanddrinks });

});

//input route where the user can input

app.post("/Lynes/meals", isLoggedIn, function (req, res) {
    var name = req.body.mealName;
    var price = req.body.price;
    var moonLanding = new Date();
    var a = moonLanding.toString().split(" ");
    var myDate = a[1] + " " + a[2] + " " + a[4].substring(0, 5);



    MealModelLynes.create({ mealName: name, price: price, time: myDate }, function (err, { mealName: name }) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/adminPage/Lynes/meals/new/meals");
        }
    })

});

//Insert BigBen drinks
app.post("/Lynes/drinks", isLoggedIn, function (req, res) {
    var drinkName = req.body.drinkName;
    var price = req.body.price;
    var moonLanding = new Date();
    var a = moonLanding.toString().split(" ");
    var myDate = a[1] + " " + a[2] + " " + a[4].substring(0, 5);

    DrinkModelLynes.create({ mealName: drinkName, price: price, time: myDate }, function (err, { mealName: name }) {
        if (err) {
            console.log("Error");
        }
        else {
            res.redirect("/adminPage/Lynes/meals/new/drinks");
        }
    })

})


//Admin main page


app.get("/adminPage/Lynes", isLoggedIn, function (req, res) {
    res.render("AdminMainLynes");
});
//Admin can add a new meal
app.get("/adminPage/Lynes/meals/new/meals", isLoggedIn, function (req, res) {
    MealModelLynes.find({}, function (err, foundMeals) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("newLynes", { myEntries: foundMeals });
        }
    });
});

//rendiring the page to insert a new drink
app.get("/adminPage/Lynes/meals/new/drinks", isLoggedIn, function (req, res) {
    DrinkModelLynes.find({}, function (err, foundDrinks) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("newDrinkLynes", { myDrinks: foundDrinks });
        }
    });
});
// ***************************End of Lynes***********************
// Destroys

app.get("/admin", function (req, res) {
    console.log(req.user);
    if (req.user) {
        res.redirect("/adminPage/" + req.user.username);
    } else {
        res.redirect("/login");
    }
})
//delete a post

//****************************Delete Arkonor ******************************************
app.delete("/adminPage/akorno/meals/:id", isLoggedIn, function (req, res) {
    MealModelArkonor.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send("Error, Not removed, try again");
        }
        else {
            res.redirect("/adminPage/akorno/meals/new/meals");
        }
    })
    // res.send("Hello world");
});

app.delete("/adminPage/akorno/drinks/:id", isLoggedIn, function (req, res) {
    DrinkModelArkonor.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send("Error, Not removed, try again");
        }
        else {
            res.redirect("/adminPage/akorno/meals/new/drinks");
        }
    })
    // res.send("Hello world");
});

//***********************************************End of delete arkonor ****************************

//**********************************************Delete BigBen****************************************
app.delete("/adminPage/BigBen/meals/:id", isLoggedIn, function (req, res) {
    MealModelBigBen.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send("Error, Not removed, try again");
        }
        else {
            res.redirect("/adminPage/BigBen/meals/new/meals");
        }
    })
    // res.send("Hello world");
});


app.delete("/adminPage/BigBen/drinks/:id", isLoggedIn, function (req, res) {
    DrinkModelBigBen.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send("Error, Not removed, try again");
        }
        else {
            res.redirect("/adminPage/BigBen/meals/new/drinks");
        }
    })
});
// ****************Delete Lynes************************
app.delete("/adminPage/Lynes/meals/:id", isLoggedIn, function (req, res) {
    MealModelLynes.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send("Error, Not removed, try again");
        }
        else {
            res.redirect("/adminPage/Lynes/meals/new/meals");
        }
    })
});

app.delete("/adminPage/Lynes/drinks/:id", isLoggedIn, function (req, res) {
    DrinkModelLynes.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send("Error, Not removed, try again");
        }
        else {
            res.redirect("/adminPage/Lynes/meals/new/drinks");
        }
    })
});



//**************************End of delete Bigben*********************************


//**********************************************Announcement app**************************************
app.get("/announcement", function (req, res, next) {
    AnnouncementModel.find({}, function (err, foundAnnouncements) {
        if (err) {
            console.log(err);
        } else {
            res.render("announcement", { myAnnouncements: foundAnnouncements });
        }

    })
})

app.get("/newAnnouncement", isLoggedIn, function (req, res) {
    AnnouncementModel.find({}, function (err, announcement) {
        var user = req.user.username;
        if (err) {
            console.log(err);
        } else {

            res.render("newAnnouncement", { myAnnouncements: announcement, myUsers: user });

        }
    })
})

app.post("/announcement", function (req, res) {
    var author = req.body.author;
    var title = req.body.title;
    var body = req.body.body;

    AnnouncementModel.create({ author: author, title: title, body: body }, function (err, { body: body }) {
        if (err) {
            console.log(err);
        }
        else {

        }
    })
    res.redirect("/newAnnouncement");
});


app.delete("/newAnnouncement/:id", function (req, res) {
    AnnouncementModel.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.redirect("/newAnnouncement");
        }
    })
});

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

app.get("/login", function (req, res) {
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
    passport.authenticate('local', { failureRedirect: "/login" }),
    function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/adminPage/' + req.user.username);
    });

User.find({}, function (err, username) {
    if (err) {
        console.log(err)
    } else {
        var a = { usernames: username };
        // console.log(a);
        // console.log(a.username);
    }

});



//SIGN UP ROUTES
//Login routes
//render login form
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    req.body.username;
    req.body.password;
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect('/adminPage/' + req.user.username);
            });
        }
    });
});
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function callbackClosure(i, callback) {
    return function () {
        return callback(i);
    }
}

function userLoggedIn(req, res, next) {
    completedUrlLoggIn = req.body.username;
    console.log(completedUrlLoggIn);
    return next();
}



// *********************************************Function for putting creating the json object that will be viewed on the page******************

function arkonorMealsAndDrinks() {

    MealModelArkonor.find({}, function (err, foundMeals) {
        var meals;
        var drinks;
        var mealsAndDrinksJson = {};
        if (err) {
            console.log(err);
        }
        else {
            mealsAndDrinksJson.Meals = foundMeals;


        }
        //console.log(mealsAndDrinksJson);
        return mealsAndDrinksJson;
    });

}
// *********************************************************

// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Theserver is Listening");
// });
// app.listen(3001, 'localhost', function() {
//     console.log("... port %d in %s mode", app.address().port, app.settings.env);
//   });

//   app.listen(app.get('port'),function(){
//       console.log("Server listening");
//   });

// app.listen(port, () => console.log(`The server is listening at port ${port}!`))

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Theserver is Listening");
});
