function selectGiftee(req, res, db){
	const {user_id, group_id} = req.body
	db.select('name', 'user_id', 'giftee_id', 'group_id').from('users')
	.then (data => {
		if (data.length) {
// only sending available giftees

			const taken = [];

			data.forEach( user => {
				if (user.giftee_id !== null){
					taken.push(user.giftee_id)
				}
			})
			res.json(taken)





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

	db.select('user_id', 'giftee_id', 'group_id').from('users')
	.where('user_id', '=', user_id)
	.orWhere('user_id', '=', giftee_id)
	.then(data => {
		let num;
		if (data[0].user_id === user_id){
			num = 0;
		} else {
			num = 1;
		}

		if(!data[num].giftee_id){
			if(data[0].group_id !== data[1].group_id){
				db('users').where('user_id', '=', user_id)
				.update({
					giftee_id: giftee_id
				})
				.then(resp => {
					res.json("Successfully registered giftee")
				})
				.catch(err => res.status(400).json('Giftee already taken'))
			} else {
				res.status(400).json('Giftee is spouse')
			}
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