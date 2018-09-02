function chooseGiftee(avail){
	const int = avail.length;
	const index = Math.floor((Math.random() * i) + 1);
	return avail[index];
}



function selectGiftee(req, res, db){
	const {user_id, spouse_id, group_id} = req.body
	db.select('name', 'user_id', 'giftee_id', 'group_id').from('users')
	.then (data => {
		if (data.length) {
// only sending available giftees


			let newGiftee;
			const taken = [];
			const fullList = [];
			let available = [];
			let filteredAvailable = [];
			let groupWeight = {
				a: 0,
				b: 0,
				c: 0,
				d: 0
			}

// figure out which giftees are taken and set weight for already picked groups 
			data.forEach( user => {
				if (user.giftee_id !== null){
					taken.push(user.giftee_id);
					switch (user.group_id){
						case 1:
							groupWeight.a++;
							break;
						case 2:
							groupWeight.b++;
							break;
						case 3:
							groupWeight.c++; 
							break;
						case 4:
							groupWeight.d++;
							break;
					}
				}
				if (user.group_id === group_id) {
					taken.push(user.user_id)
					switch(user.giftee_id){
						case 1:
						case 2:
						case 3:
						case 4:
							groupWeight.a++;
							groupWeight.b++;
							break;
						case 5:
						case 6:
						case 7:
						case 8:
							groupWeight.c++;
							groupWeight.d++;
							break;
					}
				}
			})


// add all giftees to a list
			data.forEach( user => {
				fullList.push(user.user_id)
			})


// only add available giftees to available list
			available = fullList.filter(val => !taken.includes(val));
// Choose from what is available based on groupWeight

			let {a, b, c, d} = groupWeight;
			let lowWeight = Math.min(a, b, c, d);
			let candidates = [];
			switch(lowWeight){
				case a:
					candidates.push(1, 2);
				case b:
					candidates.push(3, 4);
				case c:
					candidates.push(5, 6);
				case d:
					candidates.push(7, 8);
					break;
			}

			filteredAvailable = available.filter(val => candidates.includes(val));

			newGiftee = chooseGiftee(filteredAvailable);



// update database to include the new giftee

// respond with the chosen giftee
			res.json(newGiftee)





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