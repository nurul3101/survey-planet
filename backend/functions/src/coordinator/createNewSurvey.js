exports.createNewSurveyFunc = async (req, res, firestore) => {
  let reqObj = req.body
  console.log('reqObj', reqObj)
  try {
    const surveysRef = firestore.collection('Surveys').doc()

    let surveyObj = {
      ...reqObj,
      createdAtTs: new Date().getTime(),
      createdAt: new Date().toUTCString(),
      _id: surveysRef.id,
    }

    await surveysRef.set(surveyObj)

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
