const express = require("express"),
	router = express.Router();

router.get("/realtimeChatIndex", (req, res) => {
	res.render("realtimeChatIndex");
});

router.get("/realtimeChat", (req, res) => {
	res.render("realtimeChat");
});

module.exports = router;
