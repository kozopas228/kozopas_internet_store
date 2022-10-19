const {Router} = require('express');
const path = require('path');
const uuid = require('uuid');
const router = Router();

router.post('/create', async (req, res) => {
    const { img } = req.files;
    let fileName = uuid.v4() + '.jpg';
    await img.mv(path.resolve(__dirname, 'data', fileName));
    res.status(201).send(fileName);
});

module.exports = router;