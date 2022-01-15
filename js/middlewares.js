/* User must be authenticated */
const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/");
  }
};

/* User must be not authenticated */
const notAuth = (req, res, next) => {
  if (!req.session.isAuth) {
    next();
  } else {
    res.redirect("/home");
  }
};

/* 2 roles to access the page */
function theseRoles() {
  return function (req, res, next) {
    if (req.session.user === "regular" || req.session.user === "admin") {
      next();
    } else {
      res.sendStatus(403);
    }
  };
}

/* 1 role to access the page */
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
