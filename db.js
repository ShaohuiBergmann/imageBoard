const spicedPg = require("spiced-pg");
const database = "imageboard";
const username = "postgres";

const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

module.exports.getImage = () => {
    return db.query(`SELECT * FROM images
         ORDER BY id DESC
         LIMIT 6;`);
};

module.exports.insertInfo = (url, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description) VALUES (
    $1, $2, $3, $4)
    RETURNING *;`;

    const param = [url, username, title, description];
    return db.query(q, param);
};

module.exports.getInfo = (id) => {
    return db.query(
        `SELECT * FROM images
         WHERE id = $1;`,
        [id]
    );
};

module.exports.getMoreImg = (id) => {
    return db.query(
        `SELECT url, title, id, (
  SELECT id FROM images
  ORDER BY id ASC
  LIMIT 1
) AS "lowestId"
FROM images
WHERE id < $1
ORDER BY id DESC
LIMIT 10;`,
        [id]
    );
};

module.exports.insertComments = (comment, username, id) => {
    const q = `INSERT INTO comments (comment, username, image_id)
                VALUES ($1, $2, $3)
                RETURNING *;`;
    const params = [comment, username, id];
    return db.query(q, params);
};

module.exports.getComments = (id) => {
    return db.query(
        `SELECT * FROM comments
    WHERE image_id = $1;`,
        [id]
    );
};

