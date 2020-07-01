exports.getRespondentSurveysFunc = async (req, res, firestore) => {
  let reqObj = req.body
  console.log('reqObj', reqObj)
  try {
    const querySnapshot = await firestore
      .collection('SurveyAnswers')
      .where('surveyFillerUid', '==', reqObj.uid)
      .get()

    let dataArray = []

    querySnapshot.forEach((doc) => {
      let documentObj = doc.data()
      dataArray.push(documentObj)
    })

    console.log('dataArray', dataArray)
    const surveyQuestionsPromises = dataArray.map((surveyAnswerObj) => {
      return new Promise(async (resolve, reject) => {
        try {
          let surveyId = surveyAnswerObj.surveyId
          const documentObj = await firestore
            .collection('Surveys')
            .doc(surveyId)
            .get()
          const surveyQuestionData = documentObj.data()
          resolve(surveyQuestionData)
        } catch (error) {
          reject(error)
        }
      })
    })

    const surveyQuestionResponses = await Promise.all(surveyQuestionsPromises)
    console.log('surveyQuestionResponses', surveyQuestionResponses)

    const surveyResponse = []

    surveyQuestionResponses.forEach((surveyQuestionResponse) => {
      const surveyObj = {}
      dataArray.forEach((surveyAnswerResponse) => {
        if (surveyQuestionResponse._id === surveyAnswerResponse.surveyId) {
          surveyObj.surveyQuestionObj = surveyQuestionResponse
          surveyObj.surveyAnswerObj = surveyAnswerResponse
          surveyResponse.push(surveyObj)
        }
      })
    })

    res.status(200).send({
      success: true,
      surveys: surveyResponse,
    })
  } catch (error) {
    console.log('Error in Fetching Surveys Of Respondent', error)
    res.status(200).send({
      success: false,
      error,
    })
  }
}
