function chooseGiftee(avail){
	const int = avail.length;
	const index = Math.floor((Math.random() * int) + 1);
	return avail[index-1];
}

function getCandidates(weights){
		return candidates;
}



function selectGiftee(req, res, db){
	const {user_id, spouse_id, group_id} = req.body;
	if (!user_id || !spouse_id || !group_id){
		return res.status(400).json('Missing Credentials')
	}

	db.select('user_id', 'spouse_id', 'giftee_id', 'group_id').from('users')
	.then (data => {

		if (data.length) {
// only sending available giftees
			

			let newGiftee;
			const taken = [];
			const fullList = [];
			let available = [];
			let filteredAvailable = [];
			let nullCount = 0;
			let nullArr = [];
			let a = 0;
			let b = 0;
			let c = 0;
			let d = 0;

//for the love of god man please refactor all this stuff!!!!!!!


// figure out which giftees are taken and set weight for already picked groups 
			data.forEach( user => {

				if (user.giftee_id === null){
					switch (user.user_id){
						case 1:
						case 2:
							a--;
							break;
						case 3:
						case 4:
							b--;
							break;
						case 5:
						case 6:
							c--; 
							break;
						case 7:
						case 8:
							d--;
							break;
					}
				}

				if (user.giftee_id !== null){
					taken.push(user.giftee_id);
				}
				switch (user.giftee_id){
						case 1:
						case 2:
							a++;
							break;
						case 3:
						case 4:
							b++;
							break;
						case 5:
						case 6:
							c++; 
							break;
						case 7:
						case 8:
							d++;
							break;
					}

				if (user.group_id === group_id) {
					switch(user.giftee_id){
						case 1:
						case 2:
						case 3:
						case 4:
							a += 10;
							b += 10;
							break;
						case 5:
						case 6:
						case 7:
						case 8:
							c += 10;
							d += 10;
							break;
					}
					switch(user.group_id){
						case 1:
							a += 10;
							break;
						case 2:
							b += 10;
							break;
						case 3:
							c += 10;
							break;
						case 4:
							d += 10;
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
			let lowWeight = Math.min(a, b, c, d);
			let candidates = [];
			if(lowWeight === a){
					candidates.push(1, 2);
			}
			if(lowWeight === b){
					candidates.push(3, 4);
			}
			if(lowWeight === c){
					candidates.push(5, 6);
			}
			if(lowWeight === d){
					candidates.push(7, 8);
			}

			filteredAvailable = available.filter(val => candidates.includes(val));



// check if there is three or less choices left, and if so we need to prevent a deadlock

			if (nullCount <= 4){
				filteredAvailable = filteredAvailable.filter(val => !nullArr.includes(val))
			}
			newGiftee = chooseGiftee(filteredAvailable);

			res.json({
				lowWeight,
				candidates,
				taken,
				filteredAvailable,
				available,
				nullCount,
				nullArr,
				a,
				b,
				c,
				d,
				newGiftee
			})

// update database and respond with the chosen giftee
			db('users')
			.whereNull('giftee_id')
			.andWhere('user_id', '=', user_id)
			.update({
				'giftee_id': newGiftee
			})
			.then(() => {
		db.select('gender', 'giftee_id', 'group_id', 'user_id', 'name', 'spouse_id')
		.from('users').where('user_id', '=', user_id)
		.then((data) => {
			res.json(data[0])
		})
	})
			.catch(err => res.status(400).json("Unable to update"))





		} else {
			res.status(400).json('Unable to find giftees')
		}
	

	})
	
	.catch(err => res.status(400).json('Could not load giftees'))

}

module.exports = {
	selectGiftee
}