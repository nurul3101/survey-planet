exports.fetchResponsesToSurveysFunc = async (req, res, firestore) => {
  let reqObj = req.body
  console.log('reqObj', reqObj)
  try {
    const querySnapshot = await firestore
      .collection('Surveys')
      .where('surveyCreatorUid', '==', reqObj.uid)
      .get()

    let surveyQuestions = []

    querySnapshot.forEach((doc) => {
      let documentObj = doc.data()
      surveyQuestions.push(documentObj)
    })

    console.log('surveyQuestions', surveyQuestions)

    const surveyAnswersPromises = surveyQuestions.map((surveyQuestion) => {
      return new Promise(async (resolve, reject) => {
        try {
          const querySnapshot = await firestore
            .collection('SurveyAnswers')
            .where('surveyId', '==', surveyQuestion._id)
            .get()

          let surveyAnswers = []
          querySnapshot.forEach((doc) => {
            let documentObj = doc.data()
            surveyAnswers.push(documentObj)
          })

          console.log('surveyAnswers', surveyAnswers)
          resolve({
            surveyQuestion: surveyQuestion,
            surveyAnswers: surveyAnswers,
          })
        } catch (error) {
          console.log('Error in fetching Responses', error)
          reject(error)
        }
      })
    })

    const surveyResponses = await Promise.all(surveyAnswersPromises)

    res.status(200).send({
      success: true,
      surveys: surveyResponses,
    })
  } catch (error) {
    console.log('Error in Fetching Survey Responses for Coordinator', error)
    res.status(200).send({
      success: false,
      error,
    })
  }
}
