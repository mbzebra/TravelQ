'use strict';

var countrylist = require("./lib/countries");



/**
 * This code is a specific function that handles Mariswaran's TravelQ Alexa Skills
 *
 * Author : Mariswaran Balasubramanian
 * Created Date : March 2017
 * Skill Name : TravelQ
 */


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `${title}`,
            content: `${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}




function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {

    console.log("Country list is" + countrylist);
    const sessionAttributes = {};
    const cardTitle = 'TravelQ';
    const speechOutput = 'Welcome to TravelQ,  just say TravelQ to start your travel quiz. Answer 10 questions from around the world and earn your badge.  ';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Do you want to know your travel quotient. Say Alexa begin TravelQ. You need to answer 10 travel related questions.  ';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'TravelQ';
    const speechOutput = 'Thank you for trying the TravelQ Skill. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}


// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * 
 */
function getCountryDetails(randNumber) 
{
    var countries = Object.keys(countrylist.countries);
    var ctr = 1;
    var selectedCountry = null;

    countries.forEach(function(country) {
        ctr = ctr + 1;
        if(randNumber == ctr){
            selectedCountry =  countrylist.countries[country];
            
        }
    });

return selectedCountry;

} 

/**
 * 
 * Build Question List
 */
function buildQuestionList() {

    var questionList = new Array(20);

    for(var i = 0; i < 20 ; i++)
    {
        var randNum = Math.floor((Math.random() * 255) + 1);
        var selectedCountry = getCountryDetails(randNum);
        questionList[i] = "Name the Capital of " + selectedCountry.name; 

    }
    return questionList;

}


/**
 * Begins the TravelQ session and saves it to DB
 */
function startTravelQSession(intent, session, callback) {
   try{

    var numSpeechArr = {
        1 : "First ",
        2 : "Second ",
        3 : "Third ",
        4 : "Fourth ",
        5 : "Fifth ",
        6 : "Sixth ",
        7 : "Seventh ",
        8 : "Eighth ",
        9 : "Ninth ",
        10 : "Tenth "
    };
    var questionList = new Array(20);
    questionList = buildQuestionList();

    var cardTitle = 'TravelQ - ';
    const sessionAttributes = {};
    var speechOutput = "Your"
    for(var i = 1; i <= 10 ; i++) {

        cardTitle = cardTitle + " " + numSpeechArr[i] + " Question "
        speechOutput = speechOutput + " " + numSpeechArr[i] + "Question is " + questionList[i];
        
        const shouldEndSession = false;
        const repromptText = 'Do you need more time to answer the question';


        console.log("Speech Output is:" + speechOutput);
        callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));

        speechOutput = "Your ";
    }
   
    
          
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'To use bookmarker first save bookmark for your book and then just say get bookmark ';
    const shouldEndSession = true;

   
}
catch(err)
{
    console.log(err);
    callback(err);
}
       
}


/**
 * Ends the TravelQ in the session and saves it to DB
 */
function endTravelQSession(intent, session, callback) {
   try{
   
    }
    catch(err)
    {
        callback(err)
    }

}


/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if(intentName === 'BeginTravelQ') {
        startTravelQSession(intent, session, callback);
    } else if(intentName === 'EndTravelQ') {
        endTravelQSession(intent, session, callback);
    }  else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
