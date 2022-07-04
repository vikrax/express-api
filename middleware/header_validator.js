module.exports = function header_validator(req, res, next) {
    if (req.headers['x-user'] && 
    req.headers['x-user'].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        next()
    } else {
        res.status(400).send('X-user header is invalid.') 
    }
    
};
// Module created for middleware and module illustration