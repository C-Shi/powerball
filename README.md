## Project Overview
This is a back end API for checking US Powerball Ticket. This API will accept ticket information and compare with Powerball Public API, verify your ticket info and provide the detail of winning result

## For Developer
 API endpoint
  * Developer can send POST request to the below public endpoint to aquire data
  ```
  localhost:3000/api
  ```
 POST data structure and sample
  * Public API endpoint accept `application/x-www-form-urlencoded` and `application/json` format
  * POST data should have a property of `date`, in the format of `YYYY-MM-DD` which indicates the draw date
  * POST data should have a property of `picks`, which is an array of pick, each pick should be an array of 6 numbers (5 white balls and 6th is Powerball) following the Powerball number rules. (eg: You should not include number such as 101)
  * Use the following POST data as reference
  ```json
  {
    "date":"2019-04-24",
    "picks": [
      [ 5, 6, 7, 8, 9, 10 ],
      [ 6, 32, 35, 36, 65, 4],
      [ 32, 33, 36, 45, 62, 4]
    ]
  }
  ``` 
 Expected Response from API
  * If valid ticket information is provided, server will respond with a JSON about whether each pick has won, the prize won per-pick, and the total of all prizes won on the ticket
  * Sample Success Response as follow:
  ```json
  {
    "ticket": [
        {
            "prize": false,
            "pick": [ 5, 6, 7, 8, 9, 10 ]
        },
        {
            "prize": "Grand Prize",
            "pick": [ 6, 32, 35, 36, 65, 4 ]
        },
        {
            "prize": 7,
            "pick": [ 32, 33, 36, 45, 62, 4 ]
        }
    ],
    "totalWinning": "Grand Prize + 7"
  }
  ```

  

## Live Demo


## Prerequiste
This app requires: 

- A Linux or MacOS Environment *(Windows Untested)*
- Node.js LTS 10.9+

## How To Use
Fork and Clone this repository to your local machine

From the checked-out application folder, run: 

`npm install`

This will install dependencies.

`npm start`

You should see output like this: 

```
node index.js
App listening on port 3000
```

To check out sample HTML demo, visit:
```
localhost:3000/sample
```

To use this API, send POST request with the data format mention above to:
```
localhost:3000/api
```

## Testing

To run the existing (sample) tests simply use: 

`npm test`

You should see output like this: 

```
 Test Suites: 3 passed, 3 total
 Tests:       9 passed, 9 total
 Snapshots:   0 total
 Time:        2.585s
 Ran all test suites. 
```


