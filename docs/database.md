# Mongodb connection
If authentication is needed the [mongoose](https://mongoosejs.com/docs/connections.html) connection in `database.js` file should look like:
```js
mongoose.connect(mongodb.URI, {
    "authSource": "admin",
    "user": "●●●●",
    "pass": "●●●●",
    "useNewUrlParser": true
})
```
Instead of:
```js
mongoose.connect(mongodb.URI, {})
```

The following changes can be ignored in git with the following command:
```git
git update-index --assume-unchanged src/database.js
```

`authSource`, `user`, `pass` fields can be stored in [keys.js](../src/keys.js) file if authentication changes within developers.