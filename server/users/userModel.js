var bcrypt    = require('bcryptjs'); // Note that this is using bcryptjs rather than bcrypt
var mysql     = require('mysql');
var Sequelize = require('sequelize');

var SALT_WORK_FACTOR = 10;

// TODO: Move these values to environment variables.
var sequelize = new Sequelize('handledb', 'bce62c7ed88dce', 'b3cc7632', {
  dialect: 'mysql',
  host:    'us-cdbr-azure-west-a.cloudapp.net',
  port:    3306
});

sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect ot the database: ', err);
    } else {
      console.log('Connection to db established successfully')
    }
  });


  // See http://sequelizejs.com/docs/1.7.8/models#definition for details about definitions below.
  User = sequelize.define('User', 
  {
    email: { 
      type: Sequelize.STRING(32), 
      allowNull: false, 
      unique: true,
      validate: {
        isEmail: true
      }},
    password: { 
      type: Sequelize.STRING(128), 
      allowNull: false,
      set: function(value) {
        console.log('User password set called.');

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(value, salt);

        this.setDataValue('password', hash);
        this.setDataValue('salt', salt);
      },
    },
    salt: {
      type: Sequelize.STRING,
      allowNull: true
    },
    name: { 
      type: Sequelize.STRING(32), 
      allowNull: false 
    }
  },
  {
    instanceMethods: {
      // Instance methods are called against instances of a class, like this: currentUser.methodName().
      // This 'this' value is for the instance of the model. In this case, it would be a user.
      // The following would print 'David' as this.name if it was for a user named 'David'
      testInstanceMethod: function(value) {
        console.log('userModel testInstanceMethod called.\tvalue=' + value + 
          '\tthis.name=' + this.name);
        console.log('userModel testInstanceMethod called.\tvalue=' + value + 
          '\tthis.getDataValue(\'name\')=' + this.getDataValue('name'));
      },

      // Validate the enteredPassword against this User instance's persisted password.
      checkPassword: function(enteredPassword) {
        console.log('checkPassword');
        
        var savedPassword = this.password;
        var isMatch = bcrypt.compareSync(enteredPassword, savedPassword);
        console.log('bcrypt compare returning ', isMatch);
        return isMatch;
      },
    },
    classMethods: {
      // Class methods can be called like this: User.methodName(). 
      // The 'this' value for them is the 'User' model itself.
      // For example, the following prints 'User' as this.name.
      testClassMethod: function(value) {
        console.log('testClassMethod called.\tvalue=' + value + 
          '\tthis.name=' + this.name);
      },

      encryptPassword: function(password) {
        // How do I encrypt
      }

    }
  }
);

// Room = sequelize.define('Room',
// {
//   name: { type: Sequelize.STRING(64), allowNull: false },
//   created_by: {}
// })

// Interview = sequelize.define('Interview',
// { 
//   // room name

// })

sequelize
  .sync({force:false})
  .complete(function(err) {
    if (!!err) {
      console.log('An error occurred while creating the table: ', err);
    } else {
      console.log('User table created (if sync force=true)');
    }
  });
