function handleRegister(req, res, db, bcrypt){
	const {email, password} = req.body;
	if (!email || !password){
		return res.status(400).json('Missing Credentials')
	}
	db.select('email').from('login')
	.where('email', '=', email)
	.then(data => {
		if (!data[0].hash) {
			return res.status(400).json(alreadyRegistered)
		}
	})

	const hash = bcrypt.hashSync(password)
	db('login')
	.where('email', '=', email)
	.update({
		hash: hash
	})
	.catch(err => res.status(400).json('Incorrect Email'))

	db.select('email', 'hash').from('login')
	.where('email', '=', email)
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if (isValid) {
			return db.select('*').from('users')
			.where('email', '=', email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('Could not find user'))
		} else {
			res.status(400).json('Incorrect Credentials')
		}
	})
	.catch(err => res.status(400).json('Incorrect Credentials'))
}

module.exports = {
	handleRegister: handleRegister
};