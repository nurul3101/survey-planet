exports.signUpFunc = async (req, res, firestore, auth) => {
  let reqObj = req.body
  try {
    const userRecord = await auth.createUser({
      email: reqObj.email,
      emailVerified: true,
      password: reqObj.password,
    })

    console.log('userRecord', userRecord)

    await firestore.collection('Users').add({
      uid: userRecord.uid,
      email: reqObj.email,
      name: reqObj.name,
      gender: reqObj.gender,
      age: reqObj.age,
      userType: reqObj.userType,
      createdAt: new Date().getTime(),
    })

    res.status(200).send({
      success: true,
    })
  } catch (error) {
    console.log('Error in creating user', error)
    res.status(200).send({
      success: false,
      error,
    })
  }
}
