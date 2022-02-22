function authUser(req, res, next) {
  if (req.body.user == null) {
    res.status(403)
    return res.send('You need to sign in')
  }

  next()
}

function authRole(role) {
  return (req, res, next) => {
    if (req.body.role !== role) {
      res.status(401)
      return res.send('Not allowed')
    }

    next()
  }
}

module.exports = {
  authUser,
  authRole
}