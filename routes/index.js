const express = require('express');
const router = express.Router();
const getControllers = require('../controllers/get');
const postControllers = require('../controllers/post');



router.get('/', getControllers.homePage);
router.get('/submittopcs', getControllers.submittopics);
router.get('/registerproject', getControllers.registerproject);
router.get('/addSupervisor', getControllers.addSupervisor);
router.get('/adm', getControllers.adm);
router.get('/uploadpassport', getControllers.passport);

router.get("/projectsupervisor", getControllers.projectsupervisor);


router.post('/registerproject', postControllers.upload, postControllers.studentsRegister);
router.post('/addSupervisor', postControllers.registerSupervisor);
router.post('/adm', postControllers.adm);
router.post('/checksupervisor', postControllers.checksupervisor);
router.post('/submittopics', postControllers.submittopics);


// Exporting router
module.exports = router;