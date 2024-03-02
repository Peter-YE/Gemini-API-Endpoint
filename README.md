# Gemini-API-Endpoint
A light proxy for Gemini API to bypass the location restriction. Deploy on Azure Function

## Deploy
![image](https://github.com/Peter-YE/Gemini-API-Endpoint/blob/main/deploy.png)
Create an Azure Function, follow the official instructions to deploy.
Simply add proxy.mjs to src/functions folder and update package.json


## Usage
The URL of created endpoint is
```
https://<your-project-URL>/api/<your-function-name>/v1beta/models/gemini-pro:generateContent\?key\=<your-key>
```
N.B.
<your-project-URL> is stated in Azure Function project overview page
<your-function-name> is stated in src.functions/proxy.mjs:
```
app.http('proxy', {
    methods: ['GET', 'POST', 'PUT'],
    authLevel: 'anonymous',
    route: 'proxy/{*rest}',
```
Example
```
https://test.azurewebsites.net/api/proxy/v1beta/models/gemini-pro:generateContent\?key\=xxxxxxxxxxxxxxxxxxxxxx
```
## Test
```
curl -v \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Write a story about a magic backpack"}]}]}' \
  -X POST https://test.azurewebsites.net/api/proxy/v1beta/models/gemini-pro:generateContent\?key\=xxxxxxxxxxxxxxxxxxxxxx
```
