(function() {
  /**
  * @desc this script accepts the JSON payload from
  * https://www.lds.org/directory/services/ludrs/1.1/unit/roster/131296/ELDER
  * and sends each elder with an email address a message
  */

  var lib = require('./node_modules/email/index.js'),
    Email = lib.Email,
    data = '';

  /**
  * @desc returns the result from our
  * email object
  *
  * @return {String}
  */
  function errorHandler(error) {
    if (error) {
      console.log(error);
    } else {
      console.log('message sent');
    }
  }

  /**
  * @desc reduces the list of elders
  * down to a count of those who don't
  * have an email address in lds tools
  *
  * @param {Array}
  * @return {Int}
  */
  function withoutEmail(data) {
    return data.reduce((curr, next) => {
      if(next.email) return curr;
      else return ++curr;
    }, 0);
  }


  /**
  * @desc read in JSON data
  */
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (chunk) {
    data += chunk;
  });


  /**
  * @desc do work son
  */
  process.stdin.on('end', function() {
    
    var elders = JSON.parse(data);
    console.log('\nThere are currently: ' + elders.length + ' registered in lds.org');
    console.log('Elders without an email address: ' + withoutEmail(elders) + '\n');

    elders.forEach((elder) => {
      var email = elder.email.trim() || '',
        name = elder.preferredName.split(', ')[1],
        firstName = name.split(' ')[0],
        msg = 'Hey ' + firstName + ' just wondering \n' +
        'if you got your home teaching done! if you have \n' + 
        'please email your district leader, those are listed below \n \n' + 
        'Thanks \n' +
        'Sam Teahan';

      console.log(firstName + ' email: ' + email);

      var message = new Email({
        from: 'sammyteahan@gmail.com',
        to: email,
        subject: 'Home Teaching',
        body: msg
      });
     
      // message.send(errorHandler);
    });
  });
}());