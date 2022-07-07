const {
  Loan
} = require('../model/loan');
const {
  User
} = require('../model/user');
const {
  Account
} = require('../model/account');
const mongoose = require("mongoose");
exports.postLoan = async (req, res, next) => {
  try {
    const user = await User.findOne({});
    if (!user) {
      return res.status(422).json({
        message: 'invalid user'
      });

    }
    

    const account = await Account.findOne({
      _id: req.params.id
    });
    if (account.current_balance < 1000000) {
      return res.status(403).json({
        message: 'you dont have up to the required amount'
      });
    }
    const loans = await Loan.findOne({ totalPayment: {$ne : 0} });
    if (loans) {
      return res.status(401).json({ message: "you have unpaid loan" });
    }
    const loan = new Loan({
      ...req.body
    });
    loan.user = new mongoose.Types.ObjectId(user._id)
    loan.current_balance = account.current_balance;

    const principal = loan.amount;
    const calInterest = (loan.interest) / 100 / 12;
    const calculatedPayment = (loan.yearsToPay) * 12;
    const x = Math.pow(1 + calInterest, calculatedPayment);
    const monthly = (principal * x * calInterest) / (x - 1);
    if (isFinite(monthly)) {
      loan.monthlyPayment = monthly.toFixed(2);
      loan.totalPayment = (monthly * calculatedPayment).toFixed(2);
      loan.totalInterest = ((monthly * calculatedPayment) - principal).toFixed(2);
      loan.status = "new";
    }


    const users = await User.findOne({
      _id: loan.user
    });

    users.loans.push(loan);
    await users.save();
    await loan.save();

    // User.populate(user, 'loans').
    // then(user => {
    //   console.log(user);
    // });




  return  res.status(200).json({
      success: true,
      message: "loan request made successfully",
      loan
    });




  } catch (error) {
    next(error);

  }


}
exports.approveLoan = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user._id
    });
    if (!user) {
      return res.status(422).json({
        message: 'invalid user'
      });

    }
    if (user.isAdmin === true) {
      const approve = await Loan.findByIdAndUpdate(req.params.id, {
        status: 'approved'
      }, {
        new: true
      });
      if (!approve) {
        return res.status(422).json({
          message: 'you are not approved'
        });
      }
      return res.status(200).json({
        message: "approved loan successful"
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message
    });

  }


}
exports.rejectLoan = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user._id
    });
    if (!user) {
      return res.status(422).json({
        message: 'invalid user'
      });

    }
    if (user.isAdmin === true) {
      const reject = await Loan.findByIdAndUpdate(req.params.id, {
        status: 'rejected'
      }, {
        new: true
      });
      if (!reject) {
        return res.status(422).json({
          message: 'you are not approved'
        });
      }
      return res.status(200).json({
        message: " loan request declined"
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message
    });

  }


}

exports.editLoan = async (req, res, next) => {
  try {
    const user = await User.findById({_id : req.user._id});
    if (!user) {
      return res.status(401).json({
        message: "not an agent"
      });

    }
    
    
      const loan = await Loan.findById({
        _id: req.params.id
      });

      if (!loan) {
        return res.status(401).json({
          message: 'not an id'
        });
      }

      if (loan.status != "approved") {
        const date = new Date();



        const red = {
          loanID: new mongoose.Types.ObjectId(loan._id),
          loanInterest: loan.interest,
          yearsToPay: loan.yearsToPay,
          principal: loan.amount,
          balance: loan.current_balance,
          monthlyPayment: loan.monthlyPayment,
          status: loan.status,
          totalPayment: loan.totalPayment,
          totalInterest: loan.totalInterest,
          dateUpdated: date
        }

        loan.history.push(red);
        await loan.save();
        const principal = req.body.amount;
        const calInterest = (req.body.interest) / 100 / 12;
        const calculatedPayment = (req.body.yearsToPay) * 12;
        const x = Math.pow(1 + calInterest, calculatedPayment);
        const monthly = (principal * x * calInterest) / (x - 1);

        const monthlyPayment = monthly.toFixed(2);
        const totalPayment = (monthly * calculatedPayment).toFixed(2);
        const totalInterest = ((monthly * calculatedPayment) - principal).toFixed(2);
        const status = "new";
        await Loan.findByIdAndUpdate({
          _id: req.params.id
        }, {
          ...req.body,
          totalPayment,
          monthlyPayment,
          totalPayment,
          totalInterest,
          status
        }, {
          new: true
        });
      return  res.status(200).json({
          message: "successfully updated"
        });



      }
    return  res.status(401).json({
        message: 'it is already approved'
      });

















    





























  } catch (error) {
    next(error);


  }









}
exports.allLoans = async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.user._id });
    if (!user)
      return res.status(401).json({ message: "no user found" });
    
    if (user.Agent == false && user.isApproved == true && user.isAdmin == false) {
      const loan = await Loan.find({user : req.user._id});
      return res.status(200).json({ loan });
    }
    if (user.Agent === true && user.isApproved === true || user.isAdmin === true) {
      const loan = await Loan.find({}).select('-user');
      return res.status(200).json({ loan });
    }
    return res.status(422).json({ message: 'you are not approved' });
    

  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }

  
}
exports.filterLoans = async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.user._id });
    if (!user)
      return res.status(401).json({ message: "no user found" });
    
    if (user.Agent == false && user.isApproved == true && user.isAdmin == false) {
      const loan = await Loan.find({user : req.user._id}, {status : req.params.status}, '-user');
      return res.status(200).json({ loan });
    }
    if (user.Agent === true && user.isApproved === true || user.isAdmin === true) {
      const loan = await Loan.find({status : req.body.status});
      return res.status(200).json({ loan });
    }
    return res.status(422).json({ message: 'you are not approved' });
    

  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }

  
}
