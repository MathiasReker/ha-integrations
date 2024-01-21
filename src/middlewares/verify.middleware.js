// eslint-disable-next-line consistent-return
const verifyMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization');
    const token = authorizationHeader.split(' ')[1];

    const auth = token === process.env.TOKEN;
    if (!auth) {
      res.status(400)
        .json({ errors: ['Token is invalid.'] });
    }
    next();
  } catch (err) {
    res.status(401)
      .json({ errors: ['Access denied.'] });
  }
};

export default verifyMiddleware;
