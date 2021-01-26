# Dashboard

The purpose of this project is to implement a web application that works like Netvibes.

## Technos ##
    • Node.js - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.

    • Express - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

    • HTML - (HyperText Markup Language) is the most basic building block of the Web. It defines the meaning and structure of web content.

    • CSS - Cascading Style Sheets is a stylesheet language used to describe the presentation of a document written in HTML or XML.

    • Javascript - JS is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js..

    • React - React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.

    • Bootstrap - Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins.

    • MongoDB - MongoDB is an open-source NoSQL database.

## Requirements ##
    • Docker – Docker is a platform for developers and sysadmins to develop, deploy, and   run application with containers.

    • MongoDB – MongoDB is an open-source NoSQL database.

    • NPM – NPM is the package manager for JavaScript.
    
    • Node.js – As an asynchronous event drive JavaScript runtime, Node is designed to build scalable network applications.

# Launch #

    •  Go to the root folder (B-DEV-500-TLS-5-1-cardgames-lucas.simao)

    •  Run the command: docker-compose build

    •  Run the command: docker-compose up

    •  The site should launch on a browser (localhost: 8080)

## Registration - Authentication ##

    • Registration and authentication at the local level with email address and password
    • Authentication with OAuth2 (Google, Facebook, Twitter)

## List of services ##

    • Weather
    • LastFm
    • Nasa
    • Gmail

## List of widgets ##

    • Weather
        • Actual weather
        • Hours forcast
        • Days forcast

    • LastFm
        • Artist infos
        • Top 10 / country
        • Top 10 / tags

    • Nasa
        • Daily picture
        • Opportunity picture
        • Curiosity picture

    • Gmail
        • Email from
        • Email category
        • Send Email

## Routes of the Node.js server ##
    • /api/user/register - Load page to register. (POST)
    • /api/user/login - Load page to logout. (POST)
    • /api/user/getUsername - Get the logged in Username. (GET)
    • /api/user/:hash1 - Active the account. (GET)
    • /api/oauth/google - Connection with google. (GET)
    • /api/oauth/Goauth2callback - Active google account. (GET)
    • /api/gmailWidget/compatible - Check if the user is connected with Google. (GET)
    • /api/gmailWidget/sendEmail - Send an email. (POST)
    • /api/gmailWidget/emailFROM - Get the email from and adress. (GET)
    • /api/gmailWidget/emailCATEGORY - Get the email from a category. (GET)
    • /api/oauth/facebook - Connection with facebook. (GET)
    • /api/oauth/Foauth2callback - Active facebook account. (GET)
    • /api/oauth/Twitter - Connection with twitter. (GET)
    • /api/oauth/Toauth2callback - Active facebook account. (GET)
    • /api/token/verifyToken - Verify the token of the user looged. (GET)
    • /api/subscribe/subscribe_list - Get the list of the subscribed services. (GET)
    • /api/subscribe/subscribe_service - Subscribe to a service. (POST)
    • /api/subscribe/delete_service - Unscubscribe to a service. (DELETE)
    • /api/subscribe/addWidget - Add a Widget. (GET)
    • /api/subscribe/delWidget - Delete a Widget. (GET)

## UML SEQUENCE ##
![Screenshot](umlSequence.jpeg)

## UML CLASS ##
![Screenshot](umlClass.jpg)

## MOCKUP ##
![Screenshot](design/Mockup1.png)
![Screenshot](design/Mockup2.png)
![Screenshot](design/Mockup3.png)
