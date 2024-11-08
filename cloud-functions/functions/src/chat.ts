import * as functions from "firebase-functions";
import { Configuration, OpenAIApi } from "openai";
import { setCorns } from "./util";

// const DEFAULT_MODAL = "text-davinci-003";
const GPTSettings = {
     APIKey: "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",
     Model: "text-davinci-003",
     Max_tokens: 2500,
     Temprature: 0

}

const configurations = new Configuration({

     apiKey: GPTSettings.APIKey
})
const openai = new OpenAIApi(configurations);

export const ChatFunction = functions.https.onRequest(async (req, res) => {
          const params = req.body;
          if(setCorns(req,res)){

               if (!params.query) {
                    res.send("send query");
               } else {
                    try {
                         const openApiResponse = await openai.createCompletion({
                              model: GPTSettings.Model,
                              prompt: params.query.toString() || "Not Defined",
                              max_tokens: GPTSettings.Max_tokens,
                              temperature: GPTSettings.Temprature,
                         });
          
                         const jsonResponse = {
                              message: 'Response received successfully!',
                              data: {
                                   result: openApiResponse.data.choices[0].text,
                              },
                              status: 200,
                         };
          
                         res.send(jsonResponse);
                    } catch (error) {
                         console.error('Error:', error);
                         res.status(500).send('Internal Server Error');
                    }
               }

          }
     
});
