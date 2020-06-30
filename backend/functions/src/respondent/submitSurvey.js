exports.submitSurveyFunc = async (req, res, firestore) => {
  let reqObj = req.body
  console.log('reqObj', reqObj)
  try {
    let surveyObj = {
      ...reqObj,
      submittedTs: new Date().getTime(),
      submittedAt: new Date().toUTCString(),
    }

    await firestore.collection('SurveyAnswers').add(surveyObj)

    res.status(200).send({
      success: true,
    })
  } catch (error) {
    console.log('Error in creating survey answer', error)
    res.status(200).send({
      success: false,
      error,
    })
  }
}
