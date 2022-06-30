const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const { resolve } = require("path");
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

            callback(null, `${randomString}.jpg`);
        });
    },
});

const uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static(resolve(__dirname, "public")));
app.use("/images", express.static(resolve(__dirname, "uploads")));

app.get("/images", (req, res) => {
    db.getImaged().then((images) => {
        res.json(images.rows);
    });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    console.log("req.body", req.body);
    if (!req.body.title) {
        res.json({ error: "Missing file title" });
        return;
    }
    res.json({ success: true });
});

app.listen(8080, () => console.log(`I'm listening.`));
