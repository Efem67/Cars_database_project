const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'bazaSamochodow/kolekcja2.db',
    autoload: true
});


var express = require("express")
var app = express()
var path = require("path")
var hbs = require('express-handlebars');
const PORT = 3000;



app.use(express.static('static'))

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');



app.get("/", function (req, res) {
    coll1.find({}, function (err, docs) {

        var info = {
            cars: docs
        }
        // console.log(info.cars)
        res.render('view1.hbs', info);

    });

})

app.get("/saveInfo", function (req, res) {

    const auto = {
        Ubezpieczony: req.query.Ubezpieczony == 'on' ? "TAK" : "NIE",
        Benzyna: req.query.Benzyna == 'on' ? "TAK" : "NIE",
        Uszkodzony: req.query.Uszkodzony == 'on' ? "TAK" : "NIE",
        Naped: req.query.Naped_4x4 == 'on' ? "TAK" : "NIE",
        isEd: false

    };

    coll1.insert(auto, function (err, newDoc) {

    });


    res.redirect('/');
})

app.get("/delete", function (req, res) {


    var numer = req.query.delete;
    coll1.find({}, function (err, docs) {
        var id = docs[numer]._id
        coll1.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
            console.log("Number od deleted docs: ", numRemoved)

        });

    });
    res.redirect('/');

})


app.get("/edit", function (req, res) {

    coll1.find({}, function (err, docs) {
        var numer = req.query.edit;
        // console.log(numer)
        var id = docs[numer]._id

        coll1.update({ _id: id }, { $set: { isEd: true } }, {}, function (err, numUpdated) {
            console.log("Updated " + numUpdated)
        });
    });


    res.redirect('/');

})


app.get("/anul", function (req, res) {


    coll1.find({}, function (err, docs) {
        var numer = req.query.anul;
        // console.log(numer)
        var id = docs[numer]._id

        coll1.update({ _id: id }, { $set: { isEd: false } }, {}, function (err, numUpdated) {
            console.log("Updated " + numUpdated)
        });
    });


    res.redirect('/');

})


app.get("/aktual", function (req, res) {

    coll1.find({}, function (err, docs) {
        var numer = req.query.anul;
        var id = docs[numer]._id

        var ubezpieczony = req.query.ubezpieczony;
        var benzyna = req.query.benzyna;
        var uszkodzony = req.query.uszkodzony;
        var naped4x4 = req.query.a4x4;

        const editAuto = {
            Ubezpieczony: ubezpieczony.toUpperCase(),
            Benzyna: benzyna.toUpperCase(),
            Uszkodzony: uszkodzony.toUpperCase(),
            Naped: naped4x4.toUpperCase(),
            isEd: false,
        };

        coll1.update({ _id: id }, { $set: editAuto }, {}, function (err, numUpdated) {
            console.log("Updated")
        });

    });



    res.redirect('/');

})


app.listen(PORT, function () {
    console.log("Server just started on port: " + PORT)
})