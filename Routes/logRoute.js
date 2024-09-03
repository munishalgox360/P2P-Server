const express = require("express");
const router = express.Router();
const fs = require("fs");


router.post("/error", async (req, res) => {
    const error = req.body.error;
    const date = new Date();
    
    let newlog = `\n[${date.toDateString()}] <time> [<i style="color:red">${date.toLocaleTimeString()}</i>] :: MESSAGE => { ${error} }<br>\n`

    try {
        fs.appendFileSync("log.txt", newlog);
        res.status(200).json({ status : 201, message : "Created"});    
    } catch (e) {
        res.status(500).json({ error : "ERROR :: log error", message : e.message });
    }
});

router.get("/error", async (req, res) => {
    try {
        const logs = fs.readFileSync("log.txt", "utf-8");
        res.send(logs);
    } catch (error) {
        res.status(500).json({ error : "ERROR :: log error", message : e.message });
    }
});
module.exports = router;