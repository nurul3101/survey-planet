exports.fetchUserInfoFunc = async (req, res, firestore) => {
  let reqObj = req.body
  try {
    const querySnapshot = await firestore
      .collection('Users')
      .where('uid', '==', reqObj.uid)
      .get()

    let dataArray = []

    querySnapshot.forEach((doc) => {
      let documentObj = doc.data()
      dataArray.push(documentObj)
    })

    if (dataArray.length > 0) {
      const userObj = dataArray[0]
      res.status(200).send({
        success: true,
        userObj,
      })
    } else {
      throw new Error('User with uid not found')
    }
  } catch (error) {
    console.log('Error in creating user', error)

    res.status(200).send({
      success: false,
      error,
    })
  }
}
