exports.fetchUserInfoFunc = async (req, res, firestore) => {
  let reqObj = req.body
  try {
    const querySnapshot = await firestore
      .collection('Users')
      .where('uid', '==', reqObj.uid)
      .get()

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
