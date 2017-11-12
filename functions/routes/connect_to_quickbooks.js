var tools = require('../tools/tools.js')
var express = require('express')
var router = express.Router()

/** /connect_to_quickbooks **/
router.get('/', function (req, res) {
  // console.log(req.cookies)
  // console.log(req.cookies.sid)
  // req.cookies['connect.sid'] = {secret: 'secret'}
  // console.log(req.cookies['connect.sid'])
  // console.log(req.app.get('routes'))
  // var jsonObj = JSON.parse(req)
  // console.log(req)
  // console.log(req.session)
  // console.log(req.cookies)
  // Set the Accounting + Payment scopes
  tools.setScopes('connect_to_quickbooks')
  

  // Constructs the authorization URI.
  var uri = tools.intuitAuth.code.getUri({
    // Add CSRF protection
    state: tools.generateAntiForgery(req.session)
  })
  

  // console.log(req.session)
  // Redirect
  console.log('Redirecting to authorization uri: ' + uri)
  res.redirect(uri)
})

module.exports = router
