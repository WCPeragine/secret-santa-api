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
	return res.json(user_id)
	db.select('giftee_id').from('users')
	.where('user_id', '=', user_id)
	.then(data => {
		if(data.length){
			db('users').where('user_id', '=', user_id)
			.update({
				giftee_id: giftee_id
			})
			.catch(err => res.status(400).json('Incorrect user'))
		} else {
			res.status(400).json('User already has a giftee')
		}
	})

}

module.exports = {
	selectGiftee,
	setGiftee
}