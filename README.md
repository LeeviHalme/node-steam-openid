# node-steam-openid

[![npm version](https://badge.fury.io/js/node-steam-openid.svg)](https://badge.fury.io/js/node-steam-openid)
![npm ci](https://github.com/LeeviHalme/node-steam-openid/actions/workflows/npm-publish.yml/badge.svg)

A lightweight wrapper package around Steam's Authentication API, which supports promises :)

## Requirements

- Express @ 4.x

## Usage

Install the package by typing `npm i node-steam-openid` in your project folder.

### Setup

```javascript
const SteamAuth = require("node-steam-openid");

const steam = new SteamAuth({
  realm: "http://localhost:5000", // Site name displayed to users on logon
  returnUrl: "http://localhost:5000/auth/steam/authenticate", // Your return route
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXX", // Steam API key
});
```

### Routes

```javascript
app.get("/auth/steam", async (req, res) => {
  const redirectUrl = await steam.getRedirectUrl();
  return res.redirect(redirectUrl);
});

app.get("/auth/steam/authenticate", async (req, res) => {
  try {
    const user = await steam.authenticate(req);

    //...do something with the data
  } catch (error) {
    console.error(error);
  }
});
```

## Methods

### getRedirectUrl

Gets the redirect URL to Steam.

#### Parameters

None

#### Returns

- Promise (String)

#### Example

```javascript
steam.getRedirectUrl().then(url => {
  //...do something with the url
});
```

### authenticate

Authenticates the user with oAuth.

#### Parameters

- request (ExpressJsRequest, Object)

#### Returns

- Promise (UserObject)

#### Example

```javascript
steam.authenticate(req).then(user => {
  //...do something with the user
});
```

## Objects

### UserObject

Object which holds all the authenticated user's data. The key `_json` holds the raw response from Steam API.

#### Example

```javascript
{
  _json: { ... },
  steamid: "12345678912345678",
  username: "Example Username",
  name: "Example Name",
  profile: {
    url: "https://steamcommunity.com/id/Example",
    background: {
      static: "....jpg" | null,
      movie: "....webm" | null,
    },
    background_mini: {
      static: "....jpg" | null,
      movie: "....webm" | null,
    },
  },
  avatar: {
    small: "...",
    medium: "...",
    large: "...",
    animated: {
      static: "....png" | null,
      movie: "....webm" | null,
    },
    frame: {
      static: "....png" | null,
      movie: "....webm" | null,
    },
  }
}
```

## Contributing

See [CONTRIBUTING.md](/.github/CONTRIBUTING.md) for contributing guidelines.

## Security

See [SECURITY.md](/.github/SECURITY.md) for security practices.

## Development Roadmap

- [ ] Add the ability to pass custom variables to Steam (query parameters)
- [ ] Add support for Node.js native HTTP [<http.IncomingMessage>](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_incomingmessage) class.
- [ ] Add unit tests

## License

MIT <3
