var differenceBy = require('lodash/differenceBy')

exports.getSurveyFeedFunc = async (req, res, firestore) => {
  let reqObj = req.body
  try {
    const querySnapshot = await firestore
      .collection('Surveys')
      .where('visibleTillDateTs', '>=', new Date().getTime())
      .where('surveyAuthorization', 'array-contains-any', [
        'all',
        reqObj.age,
        reqObj.gender,
      ])
      .get()

    let dataArray = []

    querySnapshot.forEach((doc) => {
      let documentObj = doc.data()
      dataArray.push(documentObj)
    })

    // Get Surveys Already Filled by the Respondent
    const respondentAnswersSnapshot = await firestore
      .collection('SurveyAnswers')
      .where('surveyFillerUid', '==', reqObj.uid)
      .get()

    let respondentAnswers = []

    respondentAnswersSnapshot.forEach((doc) => {
      let documentObj = doc.data()
      respondentAnswers.push({ ...documentObj, _id: documentObj.surveyId })
    })

    const filteredArrays = differenceBy(dataArray, respondentAnswers, '_id')

    res.status(200).send({
      success: true,
      surveys: filteredArrays,
    })
  } catch (error) {
    console.log('Error in Fetching Survey Feed', error)
    res.status(200).send({
      success: false,
      error,
    })
  }
}
