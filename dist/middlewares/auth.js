"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
var tokens_1 = require("../utils/tokens");
function auth(req, res, next) {
    var _a;
    var token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        try {
            var decoded = (0, tokens_1.verifyToken)(token);
            req.user = decoded;
            console.log(req.user);
            next();
        }
        catch (err) {
            res.status(401).send({ message: 'Unauthorized' });
        }
    }
    else {
        res.status(401).send({ message: 'Unauthorized' });
    }
}
