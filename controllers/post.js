const db = require('../config/database').db;
const path = require('path');
const multer = require('multer');

// set storage engine
const storage = multer.diskStorage({
    destination: './public/images',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
// initialize uploaad variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 204945 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Funtion to check file type
function checkFileType(file, cb) {
    console.log(file);
    // Allow extension
    const filetyppes = /jpeg|jpg|png|gif/;
    // check extension
    const extname = filetyppes.test(path.extname(file.originalname).toLowerCase());
    // ckeck mimetype
    const mimetype = filetyppes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images only')
    }
}

const studentsRegister = (req, res) => {
    const { regNumber, email, firstName, surname, otherName, phoneNumber } = req.body;
    // console.log(myImage);
    if (!regNumber || !email || !firstName || !surname || !phoneNumber) {
        req.flash('error', 'Plaese filled in all fields');
        res.render('registerproject', {
            error: req.flash('error'),
            msg: '',
            regNumber: regNumber,
            email: email,
            phoneNumber: phoneNumber,
            firstName: firstName,
            surname: surname,
            otherName: otherName
        });
    } else {
        db.query('SELECT reg_number FROM students WHERE reg_number = ?', [regNumber], async(error, results) => {
            if (error) {
                throw error;
            }
            if (results.length > 0) {
                req.flash('msg', 'A student with this registration number [' + regNumber + '] already exist. Check your reg. number')
                return res.render('registerproject', {
                    msg: req.flash('msg'),
                    error: '',
                    regNumber: regNumber,
                    email: email,
                    phoneNumber: phoneNumber,
                    firstName: firstName,
                    surname: surname,
                    otherName: otherName
                });
            } else {
                const name = surname + ' ' + firstName + ' ' + otherName;
                db.query('INSERT INTO students SET ?', { stu_name: name, reg_number: regNumber, email: email, phone_number: phoneNumber, passport: req.file.filename }, (error, results) => {

                    if (error) throw error;
                    console.log(results);
                    req.flash('msg', 'Congratulation ' + name + ', Your project course registration was successful!');
                    return res.render('approvedtopic', {
                        Student: req.body,
                        msg: req.flash('msg'),

                    });

                });
            }
        });
    }
}
const registerSupervisor = (req, res) => {
    const { title, name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
        req.flash('error', 'Plaese filled in all fields');
        res.render('addsupervisor', {
            error: req.flash('error'),
            msg: '',
            name: name,
            phoneNumber: phoneNumber,

        });
    } else {
        db.query('SELECT phone_number FROM supervisors WHERE phone_number = ?', [phoneNumber], async(error, results) => {
            if (error) {
                throw error;

            }
            if (results.length > 0) {

                req.flash('msg', 'This lecturer already exist in the database.');
                return res.render('addsupervisor', {
                    msg: req.flash('msg'),
                    error: '',
                    name: name,
                    // email: email,
                    phoneNumber: phoneNumber
                });
            } else {

                db.query('INSERT INTO supervisors SET ?', { title: title, name: name, phone_number: phoneNumber }, (error, results) => {

                    if (error) throw error;
                    console.log(results);
                    req.flash('msg', name + " has been successfully added to the final year students' project supervisors");
                    return res.render('approvedtopic', {
                        Student: req.body,
                        msg: req.flash('msg')
                    });

                });
            }
        });
    }
}
const adm = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash('error', 'Plaese filled in all fields');
        res.render('admin', {
            error: req.flash('error'),
            msg: '',
            email: email,


        });
    } else {
        db.query('SELECT * FROM adm WHERE email = ?', [email], async(error, results) => {
            if (error) {
                throw error;

            }
            console.log(results);
            if ((results.length > 0) && (results[0].password === password)) {


                req.flash('msg', 'Welcome adm! You can now register supervisor(s).');
                return res.render('admin', {
                    Student: results,
                    msg: req.flash('msg'),
                    error: '',
                    name: '',
                    phoneNumber: '',

                });

            } else {

                req.flash('error', 'Username or password is incorrect');
                return res.render('adm', {
                    email: email,
                    error: req.flash('error'),
                    msg: ''
                });



            }
        });
    }
}
const checksupervisor = (req, res) => {
    const regNumber = req.body.regNumber;
    if (!regNumber) {
        req.flash('error', 'Please enter your registration number');
        res.render('registerproject', {
            error: req.flash('error'),
            msg: ''

        });
    } else {
        Student.findOne({ 'Reg_Number': regNumber }, (err, user) => {
            if (err) {
                throw err;
            }
            if (!user) {
                req.flash('error', "Invalid Reg. Number entered. Or you haven't registered your project topics for approval");
                return res.render('projectsupervisor', {
                    error: req.flash('error'),
                    msg: ''
                });
            }
            if (user.approved_topic == '') {
                req.flash('msg', 'Your project topic have not been aproved yet!');
                return res.render('approvedtopic', {
                    msg: req.flash('msg'),
                    Student: user
                });
            } else {
                req.flash('msg', 'Congratulation, your project topic has been approved! ');
                console.log(user.approved_topic);
                return res.render('approvedproject', {
                    msg: req.flash('msg'),
                    Student: user
                });
            }
        });
    }
}
const submittopics = (req, res) => {
    const { regNumber, supName, topic1, topic2, topic3 } = req.body;
    if (!regNumber || !supName || !topic1 || !topic2 || !topic3) {
        req.flash('error', 'All fields are required');
        return res.render('sumbittopics', {
            error: req.flash('error'),
            msg: '',
            regNumber: regNumber,
            topic1: topic1,
            topic2: topic2,
            topic3: topic3
        });
    } else {
        db.query("SELECT reg_number FROM students WHERE reg_number=?", [regNumber], (error, results) => {
            if (error) throw error;
            if (results.length <= 0) {
                req.flash('error', 'The Reg number you entered can not be found!');
                return res.render('submittopics', {
                    error: req.flash('error'),
                    msg: '',
                    regNumber: '',
                    supervisor: supName,
                    topic1: topic1,
                    topic2: topic2,
                    topic3: topic3
                });
            } else {
                db.query("SELECT supervisor FROM students WHERE supervisor=?", [supName], (error, results) => {
                    if (error) throw error;
                    if (results.length <= 0) {
                        req.flash('error', 'May be you entered a wrong name. Or ' + supName + ' is not your supervisor. Else go for your Biometric finger-print to know your supervisor!');
                        return res.render('submittopics', {
                            error: req.flash('error'),
                            msg: '',
                            regNumber: regNumber,
                            supervisor: '',
                            topic1: topic1,
                            topic2: topic2,
                            topic3: topic3
                        });
                    }
                    console.log("I can reach the third query");
                    db.query(`UPDATE students SET topic1=?, topic2=?, topic3=? WHERE reg_number=?`, [topic1, topic2, topic3, regNumber], (error, results) => {
                        if (error) throw error;
                        console.log(results);
                        return res.redirect('/');
                    });
                });
            }
        })
    }
}

module.exports = {
    studentsRegister: studentsRegister,
    registerSupervisor: registerSupervisor,
    checksupervisor: checksupervisor,
    adm: adm,
    upload: upload,
    submittopics: submittopics
}