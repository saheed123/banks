const express = require('express');

const route = express.Router();
const multer = require('multer');
const resetPassword = require('../controller/passwordReset');
const changePassword = require('../controller/changePassword');
const {
  loginUser,
  updateUser,
  deleteUser,
  findUser,
  postUser,
  logout,
  findall
} = require('../controller/userController');
const {postLoan,approveLoan, rejectLoan, editLoan, allLoans,filterLoans } = require('../controller/loan');
const {
  loginEmployee,
  updateEmployee,
  deleteEmployee,
  findEmployee,
  postEmployee,
  logoutEmployee,
  findallEmployee,
  depositforUser,
  employeeTransfer
  

} = require('../controller/employee');
const approved = require("../config/approveAgent");
const alloan = require('../config/allAgent');

const {
  addBank
} = require("../controller/bank");
const {
  deposit,
  deleteDeposit,
  getAllDeposit,
  getDeposit,
  deleteAllDeposit
} = require('../controller/deposits');
const {
  withdraw,
  getAllwithdraw,
  getWithdraw,
  deletewithdraw,
  deleteAllwithdraw
} = require('../controller/withdraw');
const {
  transfer,
  getTransfer,
  getAllTransfer,
  deleteAllTransfer,
  deleteTransfer

} = require('../controller/transfer');

const {
  verifyToken
} = require('../config/verifyToken');
const admin = require('../config/admin');
const employee = require('../config/employee');
const {
  list_all_tasks,
  create_a_task,
  read_a_task,
  download,
  delete_a_task
} = require('../controller/deposits');
const {
  loginValidator,
  registerValidator,
  passwordReset,
  accountValidation,
  branchValidation,
  bankValidation,
  transactValidation,
  loanValidator
} = require('../config/validator');
const path = require('path');
const {
  openAccount,
  DeleteAccount,
  DeleteAllAccount,
  allAccount
} = require('../controller/account');
const {
  addBranch,
  DeleteBranch,
  getABranch,
  getAllBranch,
  deleteAllBranch
} = require('../controller/branch');
const { postAgent, loginAgent,agentRequestList,approveAgent, findAgent,findallAgent,deleteAgent} = require("../controller/agent");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  }
  cb(null, false);
}


const upload = multer({
  storage,
  fileFilter
});

// ORDINARY USERS ROUTE
route.post('/register', upload.single('image'), registerValidator, postUser);
route.post('/login', loginValidator, loginUser);
route.post('/passwordReset', passwordReset, resetPassword);
route.post('/passwordReset/:userId/:token', changePassword);
route.put('/register/update', registerValidator, verifyToken, updateUser);
route.delete('/register/delete', verifyToken, deleteUser);
route.get('/me', verifyToken, findUser);
route.get('/all/user', [verifyToken, admin], findall);
route.get('/logout',verifyToken, logout);
// ACCOUNT ROUTE

route.post('/account', accountValidation, [verifyToken], openAccount);
route.get('/allaccount', [verifyToken], allAccount);



route.delete('/account/delete/:id', [verifyToken], DeleteAccount);
route.delete('/account/delete', [verifyToken], DeleteAllAccount);

route.post('/branch/add', branchValidation, addBranch);
route.delete('/deleteBranch/:Id', [verifyToken], DeleteBranch);
route.get('/branch/me/:id', getABranch);
route.get('/allBranch', getAllBranch);
route.delete('/allBranch/delete', [verifyToken], deleteAllBranch);

//  EMPLOYEES ROUTE

route.post('/register/employee', upload.single('image'), registerValidator, postEmployee);
route.post('/user/deposit/employee/:id', depositforUser);
route.post('/user/employee/transfer/:id', employeeTransfer);
route.post('/login/employee', loginValidator, loginEmployee);
route.delete('/register/employee/delete', verifyToken, deleteEmployee);
route.get('/employee/me',[verifyToken], findEmployee);
route.get('/employee/all', [verifyToken, admin], findallEmployee);
route.put('/register/update/employee', registerValidator, verifyToken, updateEmployee);


// ADD BANK

route.post('/addBank', addBank);

// DEPOSIT////////////////////////////////
route.post('/deposit/:id', [transactValidation], deposit);
route.delete('/deposit/delete/:id', deleteDeposit);
route.delete('/deposit/deleteAll', deleteAllDeposit);
route.get('/deposit/me/:id', getDeposit);
route.get('/deposit/all', getAllDeposit);

// WITHDRAW////////////////

route.post('/withdraw/:id', withdraw);
route.get('/getwithdraw/:id', getWithdraw);
route.get('/Allwithdraw', getAllwithdraw);
route.delete('/withdraw/delete/:id', deletewithdraw);
route.delete('/withdraw/deleteAll', deleteAllwithdraw);

// TRANSFER/////////////////////

route.post('/transfer/:id', transfer);
route.get('/transfer/me/:id', getTransfer);
route.get('/transfer/all', getAllTransfer);
route.delete('/transfer/deleteall', deleteAllTransfer);
route.delete('/transfer/delete/:id', deleteTransfer);

                                  // LOAN//////////////
route.post('/loan/:id', [loanValidator,verifyToken, approved], postLoan);
route.post('/loan/approve/:id', [verifyToken, admin], approveLoan);
route.post('/loan/reject/:id', [verifyToken, admin], rejectLoan);
route.get('/loan/findAll', [verifyToken], allLoans);
route.get('/loan/filter', [verifyToken], filterLoans);

                        //  AGENT ROUTE
route.post('/agent/post', upload.single('image'), registerValidator, postAgent);

route.post('/agent/login', loginAgent);
route.get('/agent/list', [verifyToken, admin], agentRequestList);
route.post('/agent/approve/:id', [verifyToken,admin], approveAgent);
route.get('/agent/find', [verifyToken], findAgent);
route.get('/agent/findall', [verifyToken, admin], findallAgent);
route.delete('/agent/delete', [verifyToken], deleteAgent);
route.post('/edit/loan/:id',[verifyToken, approved], editLoan);








module.exports = route;