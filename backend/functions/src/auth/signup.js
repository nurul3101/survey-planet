exports.signUpFunc = (req, res, firestore, auth) => {
  auth
    .createUser({
      email: 'nurulraza26@gmail.com',
      emailVerified: true,
      password: 'test123',
    })
    .then((userRecord) => {
      console.log('userRecord', userRecord)
      firestore
        .collection('Users')
        .add({
          name: 'nurul',
        })
        .then(() => {
          res.status(200).send({
            success: true,
          })
        })
    })
}
