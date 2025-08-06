module.exports.isLoggedIn = (req, res, next) => {
    console.log(`Request user: ${req.user}`)
    if(!req.isAuthenticated()){
        req.flash('error', 'You have to sign in first')
        return res.redirect('/login')
    }
    next()
}
