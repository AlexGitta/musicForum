module.exports = function(app, userData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', userData)
    });
    app.get('/login',function(req,res){
        res.render('login.ejs', userData)
    });
    app.get('/signup',function(req,res){
        res.render('signup.ejs', userData)
    });

// post function for user profile that is logged in 

    app.get('/thisuser',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE username = (?)"; // query database to get all the posts from that user
        // execute sql query
        let newrecord = [userData.signedin];        // using signedin for user that is signed in
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("userpage.ejs", newData)     // render profile page
        });
    });

// post function for other users profile

    app.post('/userprofile',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE username = (?)"; // query database to get all the posts from that user
        // execute sql query
        let newrecord = [req.body.user];        // typically the button
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("userpage.ejs", newData)     // opening userpage and passing in posts from that user
        });
    });

// post function for search

    app.post('/search',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE bodytext LIKE CONCAT('%', (?), '%') OR username LIKE CONCAT('%', (?), '%')"; // query database to get all the posts, using LIKE and CONCAT to widen search
        // execute sql query
        let newrecord = [req.body.squery, req.body.squery];
        let searchedfor = req.body.squery;
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, searchedfor, {allPosts:result});
            console.log(newData)
            res.render("search.ejs", newData)       // render search result page, pass in posts
        
        });
    });

    
// post functions for logging in or signing up

app.post('/loggedin', function (req,res) {
        // saving data in database
        let sqlquery = "SELECT password FROM users WHERE username = (?)";       // get password of attempted login
        // execute sql query
        let newrecord = [req.body.username];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            res.send('Database error.');
          }
          else {
            try
            {
                if (result[0].password == req.body.password)       
                {
                    console.log('loggedin');
                    userData.signedin = req.body.username;
                    res.render("index.ejs", userData)       // if password matches, sign user in
                }
                else
                {
                    res.send('Incorrect password');         // if password doesnt match
                }
            }
            catch
            {
                console.log('catch');
                res.send('We couldnt find a user with those details. Please sign up or try to re-enter your details.');     // if user not found
            }
          }
        });
  }); 

  app.post('/signedup', function (req,res) {
    // saving data in database
    let sqlquery = "SELECT * FROM users WHERE username = (?)";      // check if database contains other user with this username
    // execute sql query
    let newrecord = [req.body.username];
    db.query(sqlquery, newrecord, (err, result) => {
    console.log(result);
      if (err) {
        res.send('Database error.');
      }
      else {
        try
        {
            if(result.length > 0)
            {
                res.send('We already have a user with that username. Please try another.');     
            }
            else
            {
                let sqlquery = "INSERT INTO users (username, password) VALUES (?,?)";       // creating user
                let newrecord = [req.body.username, req.body.password];
                db.query(sqlquery, newrecord, (err, result) => {
                    if (err) {
                        res.send('Database error.');
                      }
                    else{
                        userData.signedin = req.body.username;
                        res.render("index.ejs", userData)       // back to home page, now logged in
                    }

                })
            }
        }
        catch
        {
            console.log('catch');
            res.send('We couldnt find a user with those details. Please sign up or try to re-enter your details.');
        }
      }
    });
}); 


// post and get functions for each genre page, all essentially the same with the values changed


    app.get('/alternative',function(req,res){
    let sqlquery = "SELECT * FROM posts WHERE genre = 'alternative'"; // query database to get all the posts
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            res.redirect('./'); 
        }
        let newData = Object.assign({}, userData, {allPosts:result});
        console.log(newData)
        res.render("alternative.ejs", newData)      // open html page
    
    });

});
    app.post('/alternative', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'alternative')";     // user making post
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'alternative'"; // requery before reloading the page
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("alternative.ejs", newData)      // reload page to display new post
            
            });
          }
        });
  }); 
    app.get('/ambient',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'ambient'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("ambient.ejs", newData)
        
        });

    });
    app.post('/ambient', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'ambient')";
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'ambient'"; // query database to get all the posts
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("ambient.ejs", newData)
            
            });
          }
        });
  }); 
    app.get('/ambient',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'ambient'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("ambient.ejs", newData)
        
        });

    });
    app.post('/electronic', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'electronic')";
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'electronic'"; // query database to get all the posts
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("electronic.ejs", newData)
            
            });
          }
        });
  }); 
    app.get('/electronic',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'electronic'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("electronic.ejs", newData)
        
        });

    });
    app.post('/hiphop', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'hiphop')";
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'hiphop'"; // query database to get all the posts
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("hiphop.ejs", newData)
            
            });
          }
        });
  }); 
    app.get('/hiphop',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'hiphop'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("hiphop.ejs", newData)
        
        });

    });
    app.post('/jazz', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'jazz')";
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'jazz'"; // query database to get all the posts
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("jazz.ejs", newData)
            
            });
          }
        });
  }); 
     app.get('/jazz',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'jazz'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("jazz.ejs", newData)
        
        });

    });
    app.post('/punk', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'punk')";
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'punk'"; // query database to get all the posts
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("punk.ejs", newData)
            
            });
          }
        });
  }); 
     app.get('/punk',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'punk'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("punk.ejs", newData)
        
        });

    });

    app.post('/rock', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'rock')";
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'rock'"; // query database to get all the posts
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("rock.ejs", newData)
            
            });
          }
        });
  }); 
     app.get('/rock',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'rock'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("rock.ejs", newData)
        
        });

    });
    app.post('/soul', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'soul')";
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'soul'"; // query database to get all the posts
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("soul.ejs", newData)
            
            });
          }
        });
  }); 
     app.get('/soul',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'soul'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("soul.ejs", newData)
        
        });

    });
    app.post('/experimental', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'experimental')";
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'experimental'"; // query database to get all the posts
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("jazz.ejs", newData)
            
            });
          }
        });
  }); 
     app.get('/experimental',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'experimental'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("experimental.ejs", newData)
        
        });

    });
    app.post('/pop', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'pop')";
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'pop'"; // query database to get all the posts
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("pop.ejs", newData)
            
            });
          }
        });
  }); 
    app.get('/pop',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'pop'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("pop.ejs", newData)
        
        });

    });
    app.post('/world', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'world')";
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'world'"; // query database to get all the posts
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("world.ejs", newData)
            
            });
          }
        });
  }); 
     app.get('/world',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'world'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("world.ejs", newData)
        
        });

    });
    app.post('/country', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO posts (username, bodytext, genre) VALUES (?,?, 'country')";
        // execute sql query
        let newrecord = [userData.signedin, req.body.post];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            let sqlquery = "SELECT * FROM posts WHERE genre = 'country'"; // query database to get all the posts
            // execute sql query
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./'); 
                }
                let newData = Object.assign({}, userData, {allPosts:result});
                console.log(newData)
                res.render("country.ejs", newData)
            
            });
          }
        });
  }); 
     app.get('/country',function(req,res){
        let sqlquery = "SELECT * FROM posts WHERE genre = 'country'"; // query database to get all the posts
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, userData, {allPosts:result});
            console.log(newData)
            res.render("country.ejs", newData)
        
        });

    });
}