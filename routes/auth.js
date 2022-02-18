const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "MohdTauhidAccessSecret@@"




// ROUTE 1 : Create a user using : POST /api/auth/createuser , doesn't require login
router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })

], async (req, res) => {
    let success = false;
    
    // If there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // check wheteher user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success , error: "sorry a user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        //create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const email = req.body.email
        const name = req.body.name
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({success, authToken, email, name })
        localStorage.setItem('username', json.name)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("Internal server error")
    }

})

// ROUTE 2 : Logging user using : POST /api/auth/login , doesn't require login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').exists()
], async (req, res) => {

    // If there are errors , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

try {
    let success = false;


    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ success , error: "Please try to login with correct credintials" })
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        return res.status(400).json({ success ,error: "Please try to login with correct credintials" })
    }

    const data = {
        user: {
            id: user.id
        }
    }
    success = true;
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ success, authToken, email })


} catch (error) {
    console.log(error.message)
    res.status(500).json("Internal server error")
}

})

// ROUTE 3 : getiing user details using : POST /api/auth/getuser , require login
router.post('/getuser', fetchuser, async (req, res)=>{
    try {
        userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.log(error.message)
        res.status(500).json("Internal server error")
    }

})

module.exports = router