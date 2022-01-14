const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect('/home')
    }
}

const notAuth = (req, res, next) => {
    if (!req.session.isAuth) {
        next()
    } else {
        res.redirect('/')
    }
}

function theseRoles () {
    return function (req, res, next) {
        if (req.session.user === 'pao' || req.session.user === 'admin') {
            next();
            console.log('pass')
            console.log('admin')
        } else {
            res.sendStatus(403);
        }
    }
}

function requireRole (role) {
    return function (req, res, next) {
        if (req.session.user === role) {
            next();
        } else {
            res.sendStatus(403);
        }
    }
}

module.exports = {
    isAuth,
    notAuth,
    requireRole,
    theseRoles
}