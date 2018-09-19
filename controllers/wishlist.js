function userWishlist(user_id){
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json("Unable to load wishlist");
  }

  db.select('gift_rank', 'gift_name', 'gift_link', 'comments')
  .from('wishlist')
  .where('user_id', '=', user_id)
  .then((data) => {
    res.json(data)
  })
  .catch(err => res.status(400).json('Could not find user'))

}

module.exports = {
  userWishlist
}
