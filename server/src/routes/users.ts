import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post("/", async (req, res) => {

    const { fullName, username, password } = req.body;

	const user = new User({ fullName, username, password });
	await user.save();

	res.send(user);
});

router.get("/:username", async (req, res) => {
	const { username } = req.params;

	const user = await User.findOne({ username }).exec();

	if (!user) {
		return res.status(400).json({
			errors: [
				{
					message: "Couldn't find user with that username",
				},
			],
		});
	}

	res.send(user);
});

export default router;