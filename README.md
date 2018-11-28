[![I ♥️ Antares](https://img.shields.io/badge/built--with-antares-blue.svg)](https://github.com/deanius/antares)

# Hotel California

> You can check out any time you like but, you can never leave! - The Eagles

# What's It Got To Offer Me?

If you're a leveling-up developer in the React/Redux/JavaScript Node space, if
you know how to make a basic web app, but want to get REALTIME features like
WebSockets into your app. If you want to know more than just what code to paste,
but really feel like you know what you're doing - going through the Hotel
California tutorial will help you level up your game.

## How do I Use It ?

> The best way to learn is by doing.

This project is structured in a series of steps, or Goals.
Each Goal is outlined in a [Pull Request](//github.com/deanius/hotel-california/pulls).

Pull down the master branch of this project, and read the objectives on each Pull
Request page. Check them off (in your repo or on paper please!) as you complete
them, and compare your code to the code provided.

When you've got code you want me to check out, submit me a PR, and soneone on the
project will get back to you with feedback!

---

## Usage

`npm start`

Your browser should open to `http://localhost:3120`, and
you should see the occupancy of Room 20 toggling

![WebSocket demo](http://www.deanius.com/HotelCaliforniaToggle.gif)

## Structure

The project runs a node server (`/server.js`) on port 8470,
and a webpack server on port 3120 concurrently (aka in "parallel" mode).
API requests `/api/rooms` and `/api/occupancy` are served up by the code in `/server.js`.

Other than that, it's basic Create React App.

## Storybook

`npm run storybook`

This will show you the UI development framework Storybook, which was used
to get the look of the React components correct in each state. It's a great
tool for iterative design with a great team.

## Giving Back

Hey, buy this guy a coffee while you're here, he started the repo - thanks Esau, enjoy I enjoyed your project a latte!

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/esausilva)
