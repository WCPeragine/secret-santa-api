function userWishlist(req, res, db){
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json("Unable to` load wishlist");
  }

  db.select('gift_rank', 'gift_name', 'gift_link', 'comments')
  .from('wishlist')
  .where('user_id', '=', user_id)
  .then((data) => {
    res.json(data)
  })
  .catch(err => res.status(400).json('Could not find user'))

}

function userWishlistRating(req, res, db){
  const { user_id, gift_name, rating } = req.body;

  if (!user_id || !gift_name || !rating) {
    return res.status(400).json("Unable to` load wishlist");
  }

  db('wishlist')
  .where('gift_name', '=', gift_name)
  .update({gift_rank: rating})
  .then(() => {
    db.select('gift_rank', 'gift_name', 'gift_link', 'comments')
    .from('wishlist')
    .where('user_id', '=', user_id)
    .then((data) => {
      res.json(data)
    })
    .catch(err => res.status(400).json('Could not find user'))
  })
  .catch(err => res.status(400).json('Could not update'))
}

module.exports = {
  userWishlist,
  userWishlistRating
}
