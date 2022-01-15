const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/");
  }
};

const notAuth = (req, res, next) => {
  if (!req.session.isAuth) {
    next();
  } else {
    res.redirect("/home");
  }
};

function theseRoles() {
  return function (req, res, next) {
    if (req.session.user === "regular" || req.session.user === "admin") {
      next();
    } else {
      res.sendStatus(403);
    }
  };
}

function requireRole(role) {
  return function (req, res, next) {
    if (req.session.user === role) {
      next();
    } else {
      console.log("cant get in");
      res.redirect("/home");
    }
  };
}

module.exports = {
  isAuth,
  notAuth,
  requireRole,
  theseRoles,
};
