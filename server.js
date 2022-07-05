const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const path = require("path");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
app.use(express.static("./public"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        // create a random file name
        // pick up the filename extension and save it too
        const randomFileName = uidSafe(24).then((randomString) => {
            // you may want to use the extname method to be found
            //on the core path library

            callback(null, randomString + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static(path.resolve(__dirname, "public")));
app.use("/images", express.static(path.resolve(__dirname, "uploads")));

app.get("/images", (req, res) => {
    db.getImage().then((images) => {
        res.json(images.rows);
    });
});

app.get("/upload/:id", (req, res) => {
    console.log(req.params.id);

    db.getInfo(req.params.id)
        .then((results) => {
            if(results.rows[0]){
                res.json(results.rows[0]);
            }
            else {
                res.json({});
            }
        })
        .catch((err) => {
            console.log("Error at getting Info", err);
        });
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    console.log(req.file.filename);
    console.log("req.body", req.body);
    db.insertInfo(
        "https://s3.amazonaws.com/spicedling/" + req.file.filename,
        req.body.user,
        req.body.title,
        req.body.description
    )
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("there is something wrong at insertInfo", err);
        });
});

app.get("/more/:id", (req, res) => {
    db.getMoreImg(req.params.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            "Err at getting more images", err;
        });
});

app.post("/comment", (req, res) => {
    db.insertComments(req.body.comment, req.body.username, req.body.image_id)
        .then((results) => {
            // console.log("comments", results.rows);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("err in insert comment", err);
        });
});

app.get("/comments/:imageId", (req, res) => {
    db.getComments(req.params.imageId)
        .then((results) => {
            console.log(results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("Err at getting Comments", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
