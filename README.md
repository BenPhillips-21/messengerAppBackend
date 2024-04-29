# Messenger Application Docs

[Frontend Repository:](https://github.com/BenPhillips-21/messengerAppFrontend)

Developed by **Benjamin Phillips**

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Built With](#built-with)
- [Authentication](#authentication)
- [API Routes](#api-routes)

## About The Project

This is a messaging application which allows users to send messages to one another either in group chats or privately.

### Key Features

#### JWT-based Authentication and Authorization
The messenger app implements JWT-based authentication and authorization using Passport.js. This approach allows users to securely authenticate and access protected resources. When a user logs in, the server issues a JSON Web Token (JWT) that is then stored in the frontend. This token is used to authenticate subsequent requests to protected routes.

#### Image Storage using Cloudinary
For image storage, the messenger app utilizes Cloudinary, a cloud-based media management platform. By integrating Cloudinary, the app can efficiently handle media assets, such as profile pictures and chat images.

#### User Profile Management
The API includes comprehensive user profile management features. Users can update their profiles, including profile pictures, usernames, and their bio. Profile data is stored securely in the database and can be accessed and modified through RESTful endpoints.

#### Chat Management and Messaging Features
The messenger app supports chat management and messaging functionalities. Users can create new chats, send messages, and view chat histories.

#### Integration with Frontend Client
The backend API seamlessly integrates with the frontend client, enabling a responsive and interactive user experience. Real-time data synchronization ensures that users receive updates instantly, such as new messages or profile changes. This integration enhances user engagement and responsiveness within the messenger application.

## Built With

##### - MongoDB
##### - Express.js
##### - Node.js

## Authentication

The Messenger API utilizes JSON Web Tokens (JWTs) to authenticate requests for protected routes. Upon successful login, an access token in the format "Bearer <token>" is issued to the client. This token must be included in the Authorization header of subsequent requests to access protected routes.

Login URL: https://messenger-app-frontend-chi.vercel.app/login  

POST /login

Body Parameters:
    - username
    - password

Returns:

```
{
  "success": true,
  "message": "Authentication successful",
  "token": (( 188 Character String ))
}

```

## API Routes

Once the user has logged in, they can use the various routes to send messages, create chats, read their chats etc.

Backend Base URL: https://messengerappbackend-production.up.railway.app

GET Current User

/currentuser

Returns: 

```
{
    "profilePic": {
        "public_id": "fh14w5zwu4oyhvcs2adw",
        "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1713316628/fh14w5zwu4oyhvcs2adw.png"
    },
    "_id": "661f41c76edd4fe9055881ce",
    "username": "newDemoUser",
    "bio": "update the bio!!",
    "chats": [
        "661f42796edd4fe9055881df",
        "661f427f6edd4fe9055881e4",
        "6620b3d65d978e0cbb84e559",
    ],
    "admin": false,
    "__v": 0
}
```

POST Update Current User

/updatecurrentuser

Body Parameters:
```
{
    "username": "newUsername",
    "bio": "new user bio !!"
}
```
Note: Username and bio can be updated both separately and individually.

Returns: 

```
{
    "success": true,
    "message": "Field updated successfully",
    "updatedUser": {
        "profilePic": "/public/images/defaultProfilePic.png",
        "_id": "661776d0fb9e076f9cb19502",
        "username": "newUsername",
        "password": "$2a$10$iiWyhEILA3G5pu.ZysNjHOosKnS43sfmfNv1ZkdaMDpOninkAUqsu",
        "bio": "This is the default bio",
        "chats": [],
        "admin": false,
        "__v": 0
    }
}
```

POST Update Profile Picture

/updateprofilepicture

Body Parameters: The request body must be sent as `form-data`.
```
Content-Type: multipart/form-data
image: (attach picture file here)
```

Returns: (the updated user)
```
{
    "profilePic": {
        "public_id": "g4j6pksiutpizznacmvk",
        "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1714367191/g4j6pksiutpizznacmvk.jpg"
    },
    "_id": "66271406397b6963e7f337c0",
    "username": "demoUser",
    "password": "$2a$10$37dEeMY6qt19F15vYf0vueUHilk6M1O6k0Q2I3hly9YiiJVGK8HZu",
    "bio": "ello",
    "chats": [],
    "admin": false,
    "__v": 0
}
```

GET A Specific User

/getuser/:userid

Returns:
```
{
    "profilePic": {
        "public_id": "g4j6pksiutpizznacmvk",
        "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1714367191/g4j6pksiutpizznacmvk.jpg"
    },
    "_id": "66271406397b6963e7f337c0",
    "username": "demoUser",
    "bio": "ello"
}
```

GET All Chats 

/allchats

Returns: 
- An array of all chats a user is in.
- See just below for how chats are returned.

GET A Specific Chat

/:chatid

Returns:
```
{
  "image": {
    "public_id": [Chat Photo ID]
    "url": [Chat Photo Source URL]
  }
  "_id": [Chat ID]
  "users": [Array of all Users in Chat]
  "messages": [Array of all messages in Chat]
  "chad": [User id of whoever is Chat admin]
}
```

POST Create Chat

/createchat/:userid

- Userid being the id of the user that a chat is to be made with.

Returns:
```
{
    "success": true,
    "message": "Chat saved!",
    "chat": {
        "image": {
            "public_id": "vvg3y9ummnw2a0mir9fk",
            "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1713316434/vvg3y9ummnw2a0mir9fk.png"
        },
        "users": [
            "661bc103b554028b3fce3447",
            "661cb095b262fa9b13dc749c"
        ],
        "messages": [],
        "_id": "6620fb815d978e0cbb84e76c",
        "__v": 0
    }
}
```

POST A Message

/:chatid/sendmessage

Body Parameters:
```
{
    "messageContent": "new outbound message in order to see what the heck happens when the message goes longer than expected!!!"
}
```

Returns:

```
{
    "success": true,
    "message": "Message saved!"
}
```

POST Change Chat Name

/:chatid/changechatname

Body Parameters:
```
{
    "newChatName": "Chungus Chat"
}
```

Returns:
```
{
    "success": true,
    "message": "Chat name updated!"
}
```

POST Change Chat Image

/:chatid/changechatimage

Body Parameters: The request body must be sent as `form-data`.
```
Content-Type: multipart/form-data
image: (attach picture file here)
```

Returns:
```
{
    "image": {
        "public_id": "kt1py1g8wcgu4t5hmzbh",
        "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1713317158/kt1py1g8wcgu4t5hmzbh.jpg"
    },
    "_id": "66189ccd0393f5fbd5a868b3",
    "users": [
        "66189c860393f5fbd5a868ac",
        "66189c8d0393f5fbd5a868ae",
        "6618b27f2ae3a08b8061e0a9"
    ],
    "messages": [
        "66189cf00393f5fbd5a868b8",
        "6618ba91f600b860010cf57e",
        "6618ba9ff600b860010cf582",
    ],
    "__v": 0
}
```

GET Delete Message

/:messageid/deletemessage

Returns:
```
"success": true,
"message": "Message deleted successfully."
```

GET Add To Chat

/:chatid/:userid/addtochat

Returns: 
```
{
    "success": true,
    "message": "User added to chat!",
    "updatedChat": {
        "image": {
            "public_id": "vvg3y9ummnw2a0mir9fk",
            "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1713316434/vvg3y9ummnw2a0mir9fk.png"
        },
        "_id": "661f427f6edd4fe9055881e4",
        "users": [],
        "messages": [],
        "__v": 0
    },
    "updatedUser": {
        "profilePic": {
            "public_id": "fh14w5zwu4oyhvcs2adw",
            "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1713316628/fh14w5zwu4oyhvcs2adw.png"
        },
        "_id": "661f41d36edd4fe9055881d0",
        "username": "demoUser3",
        "password": "$2a$10$dxTv4kCCjfZSs6nTSuJiMOjSZEWw/padBbSWlJsDgFgDac3m92Oy6",
        "bio": "This is the default bio",
        "chats": [
            "661f41e76edd4fe9055881d3",
            "661f427f6edd4fe9055881e4"
        ],
        "admin": false,
        "__v": 0
    }
}
```

GET Kick User From Chat

/:chatid/:userid/kickfromchat

- User must be Chad (chat admin) to do this

Returns:
```
{ success: true,
message: "User kicked from chat successfully",
updatedUser: updatedUser,
updatedChat: updatedChat
}
```
