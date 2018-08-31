function handleRegister(req, res, db, bcrypt) {
	const {email, password} = req.body;
	if (!email || !password){
		return res.status(400).json('Missing Credentials')
	}
	const hash = bcrypt.hashSync(password)
	db('login')
	.where('email', '=', email)
	.update({
		hash: hash;
	})
	.returning('email')
	.then(loginEmail => {
		return db.select('*').from('users')
		.where('email', '=', loginEmail)
		.then(user => {
			res.json(user[0])
		})
		.catch(err => res.status(400).json('Can not find user'))
	})
	.catch(err => res.status(400).json('Incorrect Email'))
}