exports.signUpFunc = (req, res, firestore) => {
  console.log(req.body)
  firestore.collection('Users').add({
    name: 'nurul',
  })
  res.status(200).send({
    success: true,
  })
}
