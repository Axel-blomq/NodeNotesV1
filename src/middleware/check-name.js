module.exports = (req, res, next) => {
    if (req.params.name != 'ssxel') {
        return res.send("You're not welcome")
    }
    next()
}