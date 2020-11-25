# Employee Management App

This project was created with react. It features an API backend and a web frontend.

## Available Scripts

To start backend server, move to the backend folder and run:

### `npm install`
### `nodemon start`

The server will be hosted at:
http://localhost:5000

To start the frontend server, move to the project directory and run:

### `npm install`
### `npm start`

The server will be hosted at
http://localhost:3000

## Backend

The backend hosts an API that connects to a MongoDB database.

It consists of a simple Employee table with the following fields:
`
id: string
login: string
name: string
salary: number
`

The following API calls are possible:

### Get
Endpoint: /users
A get request with the following query parameters:

```
minSalary: number
maxSalary: number
offset: number
limit:number
sort: <+/-> <field-name>
```
Note: For sorting, + indicates ascending while - indicates descending order. E.g. -salary
The returned data is in json format

### Post
Endpoint: /users/upload
A post request to  with the following input:

A HTTP multipart form with a form field "file" that contains a csv document.
The CSV document should have the following headers:

id, login, name, salary

id is the primary key of the table.
If a matching id is found in the database, it would be updated with the data contained in the document.
Otherwise, a new entry is added in the database
A '#' should be used to ignore any rows.


## Frontend

The frontend is a GUI for that allows the user to send the Get request mentioned above and to look at the data in tabular form.
The user can filter by salary and can sort the data with the header columns. He/She may also click the next and previous buttons to see the rest of the data.



### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
