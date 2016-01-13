# NodeExpressPassport
REST api for authorized access to  endpoints 

steps to test:
  ( need to have MongoDB installed ) 

  1- npm install
  2- node server.js
  
  3. open POSTMAN to test api
         localhost:8080/api/signup   to create user: name & password (POST)
         localhost:8080/api/authentication    for user to login , for valid login the token is generated and send to client.(POST) - copy the token from the response body
         localhost:8080/api/memeberInfo       for Authorization property in the header  paste token,  and select GET.
         
         
