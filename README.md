## The Zipper

##### Requirement / Instructions :

This is about designing and implementing a web API that receives a number of uploaded files, zips them up into a zip file and then gives the API user back the newly created Zip file.


## Technology Used
  
      1. Node.JS
      2. Typescript
      3. Express
      4. Inversify
      5. Typeorm
      6. archiver
      7. multer
      8. node-cron
      9. MySQL
      10. jest
      
      
## How to Run and Build

To install dependencies, just execute:

```npm install```

Please create 2 database in MySQL,

```
CREATE DATABASE `zipper` 
CREATE DATABASE `zippertest`
```

To run the application, just execute:

```npm run watch```

## How to Run test

To run test, just execute:

```npm test```

## Design Pattern

I decided to use **_Builder design Pattern_** to store Users, Uploaded Files data and retrieve the same from repository since its providing a more flexible way to separate the object creation, functionality from service layer and scalable.

## Architecture

Fully based on onion architecture and good practices.

This project is using:

TypeORM for connection to MySQL database, Inversifyjs as IoC (Inversion of Control), Express as API handler, archiver to convert files to zip, multer to upload files, node-cron to run the cron job, you will need a MySQL database at port 3306 or actually you can change this port at:

.env.dev - development 
.env.test - testing

The tables in MySQL will automatically be created as soon as the application gets started.

Currently the cron-job has been configured to run every 1hr, you can change this setting inside /src/config/types.ts under MESSAGES.CRON_CONFIG

## RESTful API

* /uploadFiles   -X HTTP POST (To upload the files on to upload folder and user data on to db).
* /downloadZip/:id -X HTTP GET (To download zip file based on the User ID)

## Way to Test API

Once the server is started, we can test this API in following ways.

##### Curl

```
1. curl -X POST \
  http://localhost:3500/uploadFiles \
  -H 'cache-control: no-cache' \
  -H 'content-type: multipart/form-data;' \
  -F userName=shyam \
  -F 'file=@file.txt'

2. curl -X GET \
  http://localhost:3500/downloadZip/1 \
  -H 'cache-control: no-cache' \ 
```

##### NodeJS Request

1. /uploadFiles
```
var fs = require("fs");
var request = require("request");

var options = { method: 'POST',
  url: 'http://localhost:3500/uploadFiles',
  headers: 
   { 'postman-token': 'f631f4fd-cd84-9a09-3c18-da4a5fb7f12e',
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data;' },
  formData: 
   { userName: 'shyam',
     file: 
      { value: 'fs.createReadStream("file.txt")',
        options: 
         { filename: 'file.txt',
           contentType: null } } } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

2. /downloadFiles/:id
```
var request = require("request");

var options = { method: 'GET',
  url: 'http://localhost:3500/downloadZip/1',
  headers: 
   { 'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

or
You can directly execute the endpoint http://localhost:3500/downloadZip/1 on your browser, it will download the zip file.

```
