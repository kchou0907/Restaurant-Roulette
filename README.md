# For the Biscuit

This is a website/app for restaurant discovery written using HTML, CSS, JS + Node JS/Express JS. It was made so that deciding on a restaurant wouldn't take my friend group literal hours. Currently it just picks a restaurant at random and starts Google Maps to that location; the idea was that if you know nothing about the restaurant, you can't argue about it (also provides a bit of adventure!!). Check out the [live site](https://forthebiscuit.herokuapp.com/)!

## How to Run:
1. `npm install`
2. `npm start`

## Features:
- Google Maps integration and address autocomplete
- Option to specify price level, transport, cuisine, and minimum rating

## Known Issues:
- Considers convenience stores to be restaurants because they have food in them
- Unable to use Apple Maps. But honestly this might be a feature b/c if you're still using Apple Maps what are you doing.
- Sometimes does not fulfill any of the user's parameters. Extra adventure :)

## Future plans:
- Create login microservice using Go, NoSQL, and Redis so that users can see a history + give a review of the places they went to
- Dockerize the backend and formally launch the website using AWS
- Turn this into an Android (and perhaps iOS) app to have better "default phone navigation" integration
- Implement a ML system that tries to guess what the user would enjoy instead of it being random