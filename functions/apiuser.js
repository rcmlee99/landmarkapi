const functions = require("firebase-functions");
const admin = require("firebase-admin");
const env = process.env.NODE_ENV || "local";
const envconfig = require(`./config/${env}.json`);
const config = env === "local" ? envconfig : functions.config();
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const firestore = admin.firestore;
const constants = require("./constants");
const portAPIUser = constants.portAPIUser;

const express = require("express");
const cors = require("cors");
const app = express();
const API_PREFIX = "v1/api/user";
const uuid = require("uuid");

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json());
app.use((req, res, next) => {
  if (req.url.indexOf(`/${API_PREFIX}`) === 0) {
    req.url = req.url.substring(API_PREFIX.length + 1) + "/";
  }
  next();
});

app.get("/", async (req, res) => {
  console.log(req.url);

  try {
    let apikey = config.webhook.apikey;
    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf("Basic ") === -1
    ) {
      res.status(401).json({ message: "Missing Authorization Header" });
    }
    if (req.headers.authorization !== `Basic ${apikey}`) {
      res.status(401).send("Authentication required.");
    }

    // Get all the active users
    let users = [];
    await firestore()
      .collection("users")
      .get()
      .then((userSnapshot) => {
        userSnapshot.forEach((doc) => {
          const user = doc.data();
          users.push(user);
        });
      });
    res.status(200).send({ users });
  } catch (error) {
    console.error(error);
    res.status(400).send();
  }
});

app.post("/", async (req, res) => {
  try {
    let apikey = config.webhook.apikey;
    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf("Basic ") === -1
    ) {
      res.status(401).json({ message: "Missing Authorization Header" });
    }
    if (req.headers.authorization !== `Basic ${apikey}`) {
      res.status(401).send("Authentication required.");
    }

    // Add New User Notes
    const docId = uuid.v1();
    const payload = req.body;

    let responseFirestore = await firestore()
      .doc(`users/${docId}`)
      .set(payload, { merge: true });
    let response = {
      status: responseFirestore,
      user: payload,
    };
    res.status(200).send(response);
  } catch (error) {
    let response = {
      status: error,
      user: req.body,
    };
    console.error(error);
    res.status(400).send(response);
  }
});

app.post("/seed", async (req, res) => {
  try {
    let apikey = config.webhook.apikey;
    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf("Basic ") === -1
    ) {
      res.status(401).json({ message: "Missing Authorization Header" });
    }
    if (req.headers.authorization !== `Basic ${apikey}`) {
      res.status(401).send("Authentication required.");
    }

    // Seed New User Notes use MockData.json via API Post
    const seedusers = req.body.users;
    console.log(JSON.stringify(seedusers));
    const responses = [];
    await Promise.all(
      seedusers.map(async (user) => {
        let responseFirestore = await firestore()
          .doc(`users/${uuid.v1()}`)
          .set(user, { merge: true });
        responses.push(responseFirestore);
      })
    );

    res.status(200).send(responses);
  } catch (error) {
    console.error(error);
    res.status(400).send();
  }
});

app.listen(portAPIUser);

const apiuser = functions.https.onRequest(app);

module.exports = {
  apiuser,
};
