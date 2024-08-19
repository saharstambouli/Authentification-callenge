const router = require('express').Router()
const userCtrl = require('../controllers/user.controller')
const {validationCheck} = require('../middleware/data.checker')




router.post('/register',validationCheck, userCtrl.register)
router.post('/login',userCtrl.login)



module.exports=router