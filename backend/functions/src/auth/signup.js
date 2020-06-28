exports.signUpFunc = async (req, res, firestore, auth) => {
  let reqObj = req.body
  try {
    const userRecord = await auth.createUser({
      email: reqObj.email,
      emailVerified: true,
      password: reqObj.password,
    })

    let userObj = {
      uid: userRecord.uid,
      email: reqObj.email,
      name: reqObj.name,
      gender: reqObj.gender,
      age: reqObj.age,
      userType: reqObj.userType,
      createdAtTs: new Date().getTime(),
      createdAt: new Date().toUTCString(),
    }

    await firestore.collection('Users').add(userObj)

    res.status(200).send({
      success: true,
      userObj,
    })
  } catch (error) {
    console.log('Error in creating user', error)
    res.status(200).send({
      success: false,
      error,
    })
  }
}
