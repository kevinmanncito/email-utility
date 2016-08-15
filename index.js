(function() {
  /**
  * @desc this script accepts the JSON payload from
  * https://www.lds.org/directory/services/ludrs/1.1/unit/roster/131296/ELDER
  * and sends each elder with an email address a message
  */

  var lib = require('./node_modules/email/index.js'),
    axios = require('axios'),
    Email = lib.Email,
    data  = '',
    key   = 'key-e37e964ac557f4fe87bfa0717279944f';

  var api_key = 'key-e37e964ac557f4fe87bfa0717279944f';
  var domain = 'sandbox20c4f050e2d74fb89b06fab37ddf8f69.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});


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
      if (next.email) return curr;
      else return ++curr;
    }, 0);
  }

  /**
  * @desc helper function to send email via mailgun
  *
  * @param {String} - name
  * @param {String} - email
  */
  function sendEmail(name, email) {
    var month = "July"
    var text = 'Hey ' + name + ',\n' +
      'We\'re just checking in to see if you were able to get your home teaching done during the month of ' + month + '.\n' +
      'Please send us an email at logan29eq@gmail.com and let us know how things went with your families, ' +
      'and if there is anything we can help with. If you don\'t have, or don\'t know your assignment, ' +
      'please let us know and we will contact you with your assignment.\n\n' +
      'There was a handful of you who already let us know you need an assignment last month, we will be getting you your assignment soon! Sorry for the delay!'
      '\n' +
      '\n' +
      'Thanks! \n' +
      'Logan 29th Elders Quorum Presidency';
    var message = {
      from: 'logan29eq@gmail.com',
      to: email,
      subject: month + ' Home Teaching',
      text: text
    };
    mailgun.messages().send(message, function (error, body) {
      if (error) {
        console.log(error);
      }
      console.log(`Message sent to ${email}`);
    });
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
  * @desc do work once we have our data
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
        'Elders Quorum Presidency';

      var message = new Email({
        from: 'logan29eq@gmail.com',
        to: email,
        subject: 'Home Teaching',
        body: msg
      });

      if (email) {
        console.log(`${firstName} email: ${email}`);
        // sendEmail(firstName, email);
      }
    });

  });
}());
