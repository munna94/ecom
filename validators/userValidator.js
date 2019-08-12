exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty();
    req.check('email', 'Email must be b/w 2 to 32 character').notEmpty()
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'password is required').notEmpty();
    req.check('password')
        .isLength({
            min: 6
        })
        .withMessage('pass must be at least 6 characters.')

    const errors = req.validationErrors();
    if (errors) {
        const firstErrors = errors.map(error => error.msg)[0];
        return res.status(400).send({
            status: 'validation failed',
            error: firstErrors
        })
    }

    next();

}