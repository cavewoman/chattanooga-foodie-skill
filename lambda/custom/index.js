/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require("ask-sdk-core");

const places = [
  { name: "Two Ten Jack", type: "Ramen", location: "Warehouse Row" },
  {
    name: "Public House",
    type: "Fancy Southern Food",
    location: "Warehouse Row"
  },
  { name: "Sekisui", type: "Sushi", location: "Warehouse Row" },
  { name: "Community Pie", type: "Pizza", location: "Miller Plaza" },
  { name: "Taqueria Jalisco", type: "Mexican", location: "Miller Plaza" },
  { name: "Mindy Bs", type: "Sandwiches", location: "Miller Plaza" },
  { name: "Southern Sqweeze", type: "Healthy/Juice", location: "Miller Plaza" },
  {
    name: "Mayan Kitchen",
    type: "Tex Mex",
    location: "Downtown (Further North)"
  },
  {
    name: "Shangri-la",
    type: "Cheap Chinese",
    location: "Downtown (Further North)"
  },
  { name: "Sitar", type: "Indian", location: "Downtown (Further North)" },
  { name: "Kenny’s", type: "American", location: "Midtown" },
  { name: "Urban Stack", type: "Burgers", location: "Midtown" },
  { name: "Two Sons", type: "American", location: "MLK" },
  { name: "Champy’s Chicken", type: "Fried Chicken", location: "MLK" },
  { name: "Uncle Larry’s Catfish", type: "Fried Fish", location: "MLK" },
  { name: "Chattanooga Smokehouse", type: "BBQ", location: "MLK" },
  { name: "Alex Thai", type: "Thai", location: "Southside" },
  { name: "Terminal Brewhouse", type: "Pub Food", location: "Southside" },
  { name: "Main Street Meats", type: "Fancy Meats", location: "Southside" },
  { name: "Niedlovs", type: "Sandwiches", location: "Southside" },
  { name: "Conga", type: "Latin", location: "Southside" },
  { name: "Clydes", type: "BBQ", location: "Southside" },
  { name: "Feed", type: "American", location: "Southside" }
];

const RandomSuggestionHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name ===
        "RandomSuggestionIntent"
    );
  },
  async handle(handlerInput) {
    const suggestion = places[Math.floor(Math.random() * places.length)];
    const outputSpeech = `You should eat at ${
      suggestion.name
    }. \n\n Its located in ${suggestion.location}. \n\n It is categorized as ${
      suggestion.type
    }`;

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .withStandardCard(
        "Chattanooga Foodie Suggestion",
        outputSpeech,
        "https://s3.amazonaws.com/chattanooga-foodie-skill/images/eat-image-small.png",
        "https://s3.amazonaws.com/chattanooga-foodie-skill/images/eat-image-large.png"
      )
      .getResponse();
  }
};

const IntroHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  async handle(handlerInput) {
    let outputSpeech =
      "Welcome to Chattanooga Foodie! If you are in Chattanooga and hungry we can point you in the right direction. Just say, Alexa, ask Chattanooga Foodie where we should eat.";

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(outputSpeech)
      .withStandardCard(
        "Welcome To Chattanooga Foodie!",
        "Ask Chattanooga Foodie where should we eat",
        "https://s3.amazonaws.com/chattanooga-foodie-skill/images/eat-image-small.png",
        "https://s3.amazonaws.com/chattanooga-foodie-skill/images/eat-image-large.png"
      )
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    let outputSpeech =
      "Chattanooga Foodie makes suggestions for where you should eat in Chattanooga Tennessee. Just say, Alexa, ask Chattanooga Foodie where we should eat.";

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(outputSpeech)
      .withStandardCard(
        "Help",
        "Ask Chattanooga Foodie where should we eat",
        "https://s3.amazonaws.com/chattanooga-foodie-skill/images/eat-image-small.png",
        "https://s3.amazonaws.com/chattanooga-foodie-skill/images/eat-image-large.png"
      )
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speechText = "Goodbye!";

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  }
};

const getRemoteData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    IntroHandler,
    RandomSuggestionHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
