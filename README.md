# Questions and Answers API

API for a Questions and Answers section of a single page E-commerce site using ExpressJS, MySQL, and Docker to containerize the Express Server.

# Starting the Server
- Create mysql database and in a .env file add a PORT and HOST variable
- PORT=3000
- Create a MySQL DB with the name QA
- HOST should be whatever is hosting your MySQL DB (most likely localhost)
- Method 1:
  - docker build . --name [image_name]
  - docker run -d -p 3000:3000 --name [container_name] [image_name]
- Method 2:
  - npm install
  - npm run build (if it throws an error run node server/db.js and then npm run build)
  - npm start
