exports.fetchCoordinatorSurveysFunc = async (req, res, firestore) => {
  let reqObj = req.body
  console.log('reqObj', reqObj)
  try {
    const querySnapshot = await firestore
      .collection('Surveys')
      .where('surveyCreatorUid', '==', reqObj.uid)
      .get()

    let dataArray = []

    querySnapshot.forEach((doc) => {
      let documentObj = doc.data()
      dataArray.push(documentObj)
    })

    console.log('dataArray')

    res.status(200).send({
      success: true,
      surveys: dataArray,
    })
  } catch (error) {
    console.log('Error in Fetching Surveys Of Coordinator', error)
    res.status(200).send({
      success: false,
      error,
    })
  }
}
