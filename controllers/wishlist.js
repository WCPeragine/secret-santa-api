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
  const gift_rank = Number(giftLength) + 1;
  if (!user_id || gift_rank < 1 || !gift_name) {
    return res.json("Not enough information");
  } else {
    db("wishlist")
      .insert({
        user_id: user_id,
        gift_name: gift_name,
        gift_rank: gift_rank,
        gift_link: gift_link,
        comments: comments
      })
      .then(() => {
        res.json("Wishlist Updated!");
      });
  }
}

function removeItem(req, res, db) {
  const { user_id, gift_name, gift_rank } = req.body;
  if (!user_id || gift_rank < 1 || !gift_name) {
    return res.json("Not enough information");
  } else {
    db("wishlist")
      .where("gift_rank", "=", gift_rank)
      .andWhere("gift_name", "=", gift_name)
      .andWhere("user_id", "=", user_id)
      .del()
      .then(() => {
        db("wishlist")
          .where("user_id", "=", user_id)
          .andWhere("gift_rank", ">", gift_rank)
          .decrement("gift_rank", 1)
          .then(() => {
            res.json("Wishlist Updated!");
          });
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
  handleNewItem,
  removeItem
};
