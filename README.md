# About this project
The main purpose of this repository is to show my skills in writing GraphQL Api in TypeScript.  
It uses:  
- register/login/email confirmation/forgot password/change password
- session authentication
- AWS RDS with **PostgreSQL** engine
- middlewares to secure certain resources
- resources with many-to-one relation
- Jest.js and is fully covered by **unit tests**

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **src/resolvers**      | Resolvers are functions that generates response for a GraphQL query 
| **src/utils**              | Contains all the utilities and helpers needed for the application 
| **src/middleware**      | Custom middlewares which process the incoming requests before handling them down                    
| **src/entity**           | Entities define schemas that will be used in storing and retrieving data from Application database and GraphQL query   |
| **src/errors**      | Custom errors |
| **src/types**    | Custom types |
