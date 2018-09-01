function selectGiftee(req, res, db){
	db.select('name', 'user_id', 'giftee_id', 'group_id').from('users')
	.then (data => {
		console.log(data)
		// if(data.length) {
		// 	res,json(data[0])
		// } else {
		// 	res.status(400).json('not found')
		// }
	})
	.catch(err => res.status(400).json('Could not load giftees'))
}

module.exports = {
	selectGiftee: selectGiftee
}