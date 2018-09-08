function handleRegister(req, res, db, bcrypt){
	const {email, password} = req.body;
	if (!email || !password){
		return res.status(400).json('Missing Credentials')
	}

	db.select('hash').from('login')
	.where('email', '=', email)
	.then(data => {
		if (data[0].hash) {
			return res.status(400).json("Registration failed")
		} else {
			const hash = bcrypt.hashSync(password)
			db('login')
			.where('email', '=', email)
			.update({
				hash: hash
			})
			.catch(err => res.status(400).json('Incorrect Email'))

			
			return db.select('*').from('users')
			.where('email', '=', email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('Could not find user'))
		}
	})

	
}

module.exports = {
	handleRegister: handleRegister
};