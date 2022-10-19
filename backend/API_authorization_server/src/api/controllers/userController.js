const authMiddleware = require('../middlewares/authMiddleware');
const checkRoleMiddleware = require('../middlewares/checkRoleMiddleware');
const roles = require("../../consts/roles");
const { Router } = require("express");
const router = Router();
const userService = require('../../logic/services/userService');
const ApplicationError = require('../../logic/errors/ApplicationError');
const httpStatusCodes = require('../../consts/httpStatusCodes');


router.post("/register", async (req, res, next) => {
    try {
        const { username, email, password} = req.body;
        if(!username || !email || !password) {
            throw new ApplicationError('one of fields were empty');
        }
        const result = await userService.register(username, email, password);
        return res.status(httpStatusCodes.CREATED).json({token: result});
    } catch(error) {
        return next(error, req, res);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { entryData, password} = req.body;
        if(!entryData || !password) {
            throw new ApplicationError('one of fields were empty');
        }
        const result = await userService.login(entryData, password);
        return res.json({token: result});
    } catch(error) {
        return next(error, req, res);
    }
});

router.get("/check", authMiddleware, async (req, res, next) => {
    if(!req.user.id || !req.user.username || !req.user.email || !req.user.rolesIds) {
        throw new ApplicationError('one of fields were empty');
    }
    const result = await userService.check(req.user.id, req.user.username, req.user.email, req.user.rolesIds);
    return res.json({token: result});
});

router.post("/changeUsername", authMiddleware, async (req, res, next) => {
    try {
        const { username } = req.body;
        if(!username) {
            throw new ApplicationError('one of fields were empty');
        }
        await userService.changeUsername(req.user.id, username);
        return res.json({message: 'changed'});
    } catch(error) {
        return next(error, req, res);
    }
});

router.post("/changeEmail", authMiddleware, async (req, res, next) => {
    try {
        const { email } = req.body;
        if(!email) {
            throw new ApplicationError('one of fields were empty');
        }
        await userService.changeEmail(req.user.id, email);
        return res.json({message: 'changed'});
    } catch(error) {
        return next(error, req, res);
    }
});

router.post("/changePassword", authMiddleware, async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if(!oldPassword || !newPassword) {
            throw new ApplicationError('one of fields were empty');
        }
        await userService.changePassword(req.user.id, oldPassword, newPassword);
        return res.json({message: 'changed'});
    } catch(error) {
        return next(error, req, res);
    }
});

router.post("/changeRoles", setAdminRoleIdMiddleware, checkRoleMiddleware, async (req, res, next) => {
    try {
        const { id, rolesIds } = req.body;
        if(!id || !rolesIds) {
            throw new ApplicationError('one of fields were empty');
        }
        await userService.changeRoles(id, rolesIds);
        return res.json({message: 'changed'});
    } catch(error) {
        return next(error, req, res);
    }
});

async function setAdminRoleIdMiddleware(req, res, next) {
    const roleId = await userService.getUserRoleIdByName(roles.ADMIN);
    req.accessedRoles = [roleId];
    next();
}

module.exports = router;
