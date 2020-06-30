exports.createNewSurveyFunc = async (req, res, firestore) => {
  let reqObj = req.body
  console.log('reqObj', reqObj)
  try {
    let surveyObj = {
      ...reqObj,
      createdAtTs: new Date().getTime(),
      createdAt: new Date().toUTCString(),
    }

    await firestore.collection('Surveys').add(surveyObj)

    res.status(200).send({
      success: true,
    })
  } catch (error) {
    console.log('Error in creating survey', error)
    res.status(200).send({
      success: false,
      error,
    })
  }
}
