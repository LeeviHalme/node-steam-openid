# node-steam-openid

A lightweight wrapper package around Steam's Authentication API, which supports promises :)

## Usage

Install the package by typing `npm i node-steam-openid` in your project folder.

### Setup

```javascript
const SteamAuth = require("node-steam-openid");

const steam = new SteamAuth({
  realm: "http://localhost:5000", // Site name displayed to users on logon
  returnUrl: "http://localhost:5000/auth/steam/authenticate", // Your return route
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXX" // Steam API key
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
  profile: "https://steamcommunity.com/id/Example",
  avatar: {
    small: "...",
    medium: "...",
    large: "..."
  }
}
```

## License

MIT <3
