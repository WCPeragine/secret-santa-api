function selectGiftee(req, res, db){
	db.select('name', 'user_id', 'giftee_id', 'group_id').from('users')
	.then (data => {
		if (data.length) {
			res.json(data)
		} else {
			res.status(400).json('Unable to find giftees')
		}

	})
	.catch(err => res.status(400).json('Could not load giftees'))
}

function setGiftee(req, res, db){
	const {user_id, giftee_id} = req.body;
	if (!user_id || !giftee_id || user_id === giftee_id) {
		return res.status(400).json('Incorrect information')
	}

	db.select('giftee_id').from('users')
	.where('user_id', '=', user_id)
	.then(data => {
		if(!data[0].giftee_id){
			db('users').where('user_id', '=', user_id)
			.update({
				giftee_id: giftee_id
			})
			.then(resp => {
				res.json("Successfully registered giftee")
			})
			.catch(err => res.status(400).json('Giftee taken already'))
		} else {
			res.status(400).json('User already has a giftee')
		}
	})
	.catch(err => res.status(400).json('Incorrect user id'))

}

module.exports = {
	selectGiftee,
	setGiftee
}