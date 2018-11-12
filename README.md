# Hotel California

> You can check out any time you like but, you can never leave! - The Eagles

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
