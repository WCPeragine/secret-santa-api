function userWishlist(req, res, db) {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json("Unable to` load wishlist");
  }

  db.select("gift_rank", "gift_name", "gift_link", "comments")
    .from("wishlist")
    .where("user_id", "=", user_id)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json("Could not find user"));
}

function handleRank(req, res, db) {
  const { giftUp, giftDown, user_id, maxLength } = req.body;
  if (
    !user_id ||
    !giftUp ||
    !giftDown ||
    giftUp.gift_rank < 1 ||
    giftDown.gift_rank > maxLength
  ) {
    return res.status(400).json("Unable to load wishlist");
  } else {
    db("wishlist")
      .where("gift_name", "=", giftUp.gift_name)
      .update({ gift_rank: giftUp.gift_rank })
      .then(() => {
        db("wishlist")
          .where("gift_name", "=", giftDown.gift_name)
          .update({ gift_rank: giftDown.gift_rank })
          .then(() => {
            res.json("confirmed");
          });
      })
      .catch(err => res.status(400).json("denied"));
  }
}

function handleNewItem(req, res, db) {
  const { user_id, giftLength, gift_name, gift_link, comments } = req.body;
  let gift_length = Number(giftLength) + 1;
  if (!user_id || gift_length > 0 || !gift_name) {
    return res.status(400).json("Please try again");
  } else {
    db("wishlist")
      .insert({
        gift_name,
        rank: gift_length,
        gift_link,
        comments,
        user_id
      })
      .then(() => {
        res.json("Wishlist Updated!");
      });
  }
}

// function userWishlistRating(req, res, db){
//   const { user_id, gift_name, rating } = req.body;
//
//   if (!user_id || !gift_name || !rating) {
//     return res.status(400).json("Unable to` load wishlist");
//   }
//
//   db('wishlist')
//   .where('gift_name', '=', gift_name)
//   .update({gift_rank: rating})
//   .then(() => {
//     db.select('gift_rank', 'gift_name', 'gift_link', 'comments')
//     .from('wishlist')
//     .where('user_id', '=', user_id)
//     .then((data) => {
//       res.json(data)
//     })
//     .catch(err => res.status(400).json('Could not find user'))
//   })
//   .catch(err => res.status(400).json('Could not update'))
// }

module.exports = {
  userWishlist,
  handleRank,
  handleNewItem
};
