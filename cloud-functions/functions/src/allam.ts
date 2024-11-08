
import * as functions from "firebase-functions";
import { setCorns } from "./util";
import axios from 'axios';
import * as logger from "firebase-functions/logger";

const IBM_GET_TOKEN = 'https://iam.cloud.ibm.com/identity/token';
const IBM_GET_SUGGESTION = 'https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29';

export const GetToken = functions.https.onRequest(async (req, res) => {
    if(setCorns(req,res)){
      try {
        const response = await axios.post(IBM_GET_TOKEN, null, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
            apikey: '0cW3_VyIWSq4a6YFfHULg_tmViFLvp3x-8i_LPcng4x2', // Replace with your actual API key or use an environment variable
          },
        });
        res.send(response.data);
      } catch (error: any) {
        console.error('Error fetching token:', error.message);
        res.status(500).send('Failed to fetch token');
      }
    }
  });

  export const sendPrompt = functions.https.onRequest(async (req, res) => {
    const params:any = req.body;
    logger.error("Params!"+params.prompt + ' ##' + params.token);
    
    if(setCorns(req,res)){
      try {
        const response = await axios.post(IBM_GET_SUGGESTION, {
          "input": `<s> [INST]<<SYS>>${params.sentiment}<</SYS>>${params.prompt}[/INST][INST]`,
            "parameters": {
                "decoding_method": "greedy",
                "max_new_tokens": 900,
                "min_new_tokens": 0,
                "stop_sequences": [],
                "repetition_penalty": 1
            },
            "model_id": "sdaia/allam-1-13b-instruct",
            "project_id": "a9a10a8d-3cc2-452e-9994-4d43f501a283"
          },{
          headers: {
            'Authorization': 'Bearer ' + params.token,
            'Access-Control-Allow-Origin':'*',
          }
        });
        res.send(response.data);
      } catch (error: any) {
        logger.error("Send Prompt Error!"+ JSON.stringify(error));
        console.error('Send Prompt Error:', error.message);
        res.status(500).send('Failed to fetch token');
      }
    }
  });