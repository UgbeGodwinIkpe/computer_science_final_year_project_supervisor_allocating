const homePage = (req, res) => {
    res.render('homePage');
}

const registerproject = (req, res) => {
    res.render('registerproject', {
        error: '',
        msg: '',
        regNumber: '',
        email: '',
        phoneNumber: '',
        firstName: '',
        surname: '',
        otherName: '',
        topic1: '',
        topic2: '',
        topic3: ''
    });
}

const addSupervisor = (req, res) => {
    req.flash('msg', 'Admin. you are welcome!')
    res.render('addsupervisor', {
        error: '',
        msg: req.flash('msg'),
        name: '',
        email: '',
        phoneNumber: ''
    });
}

const submittopics = (req, res) => {
    req.flash('msg', 'Kindly submt your three selected topics to your supervisor');
    res.render("submittopics", {
        error: '',
        msg: req.flash('msg')
    })
}

const adm = (req, res) => {
    res.render('adm', {
        error: '',
        msg: 'Please the username and password to access the admin page!',
        email: ''
    });
}
const passport = (req, res) => {
    res.render('passport', {
        error: '',
        msg: '',
        image: ''
    });
}
const projectsupervisor = (req, res) => {
    res.render('projectsupervisor', {
        error: '',
        msg: ''
    });
}


module.exports = {
    homePage: homePage,
    registerproject: registerproject,
    projectsupervisor: projectsupervisor,
    addSupervisor: addSupervisor,
    adm: adm,
    passport: passport,
    submittopics: submittopics
}