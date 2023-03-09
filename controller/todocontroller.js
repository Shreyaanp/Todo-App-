module.exports = (app, db , deletefb) => {
    let username = '';
    app.get('/', (req, res) => {
        res.render('create_user');
    });
    app.post('/login', (req, res) => {
        username = req.body.username;
        //check if username exists
        const docRef = db.collection('users').doc(username);
        docRef.get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                //update time and date
                db.collection('users').doc(username).update({
                    Date_time: new Date()
                });
                req.session.username = username;
                const todoindex = doc.data().todoindex;
                let send = {};
                    for (let i = 0; i < todoindex; i++) {
                        send[i] = doc.data()[i];
                        send['username'] = username
                    }

                res.render('index', {username : username, send: send, todoindex : todoindex});
            } else {
                // create new user
                const todoindex = 0;
                db.collection('users').doc(username).set({
                    username: username,
                    Date_time: new Date().getTime(),
                    todoindex: 0,
                    0: null
                });
                let send = {};
                for (let i = 0; i < todoindex; i++) {
                    send[i] = doc.data()[i];
                    send['username'] = username
                }

                req.session.username = username;
                res.render('index', {username : username, send: send, todoindex : todoindex});
                console.log("new user created");
            }
        }
        ).catch((error) => {
            console.log("Error getting document:", error);
        }
        );

    });
    // app.delete('/', (req, res) => {
    // });
    app.post('/add', (req, res) => {
        const username = req.session.username;
        const todo = req.body.todo;
        // console.log(username);
        // console.log(todo);
        const docRef = db.collection('users').doc(username);

        docRef.get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                const todoindex = doc.data().todoindex;

                db.collection('users').doc(username).update({
                    [todoindex]: todo,
                    todoindex: todoindex + 1
                }).then(() => {
                    console.log("Document successfully written!");
                    // send the JSON data to the front-end
                    let send = {};
                    for (let i = 0; i <= todoindex; i++) {
                        send[i] = doc.data()[i];
                    }
                    send[todoindex + 1] = todo;

                    res.render('index', {username : username, send: send, todoindex : todoindex+1});
                    console.log(send,'send[0]')
                }).catch((error) => {
                    console.log("Error writing document:", error);
                    res.status(500).send("Error writing document");
                });
            } else {
                console.log("No such document!");
                res.status(404).send("No such document");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
            res.status(500).send("Error getting document");
        });
    });

    app.post('/delete/:index', (req, res) => {
        // Get the index of the item to delete from the request parameters
        const index = req.params.index;
        const username = req.session.username;
        const docRef = db.collection('users').doc(username);
        docRef.get().then((doc) => {
            if (doc.exists) {
                const todoindex = doc.data().todoindex;
                docRef.update({
                    [index]: deletefb,
                    todoindex: todoindex - 1
                }).then(() => {
                    console.log("Document successfully deleted!");
                    // send the JSON data to the front-end
                    let send = {};
                    for (let i = 0; i < todoindex; i++) {
                        if(doc.data()[i] !=null && i!=index){
                            send[i] = doc.data()[i];
                        }
                    }
                    console.log(send,'delete')
                    res.render('index', {username : username, send: send, todoindex : todoindex-1});
                }).catch((error) => {
                    console.log("Error writing document:", error);
                    res.status(500).send("Error writing document");
                });
            } else {
                console.log("No such document!");
                res.status(404).send("No such document");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
            res.status(500).send("Error getting document");
        });
    });

};