// Require Dependencies
const axios = require("axios");
const openid = require("openid");
const url = require("url");

const OPENID_CHECK = {
  ns: 'http://specs.openid.net/auth/2.0',
  op_endpoint: 'https://steamcommunity.com/openid/login',
  claimed_id: 'https://steamcommunity.com/openid/id/',
  identity: 'https://steamcommunity.com/openid/id/',
};

// Main Class
class SteamAuth {
  constructor({ realm, returnUrl, apiKey }) {
    if (!realm || !returnUrl || !apiKey)
      throw new Error(
        "Missing realm, returnURL or apiKey parameter(s). These are required."
      );

    this.realm = realm;
    this.returnUrl = returnUrl;
    this.apiKey = apiKey;
    this.relyingParty = new openid.RelyingParty(
      returnUrl,
      realm,
      true,
      true,
      []
    );
  }

  // Get redirect url for Steam
  async getRedirectUrl() {
    return new Promise((resolve, reject) => {
      this.relyingParty.authenticate(
        "https://steamcommunity.com/openid",
        false,
        (error, authUrl) => {
          if (error) return reject("Authentication failed: " + error);
          if (!authUrl) return reject("Authentication failed.");

          resolve(authUrl);
        }
      );
    });
  }

  // Fetch user
  async fetchIdentifier(steamOpenId) {
    return new Promise(async (resolve, reject) => {
      // Parse steamid from the url
      const steamId = steamOpenId.replace(
        "https://steamcommunity.com/openid/id/",
        ""
      );

      try {
        const response = await axios.get(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=${steamId}`
        );
        const players =
          response.data &&
          response.data.response &&
          response.data.response.players;

        if (players && players.length > 0) {
          // Get the player
          const player = players[0];

          // Return user data
          resolve({
            _json: player,
            steamid: steamId,
            username: player.personaname,
            name: player.realname,
            profile: player.profileurl,
            avatar: {
              small: player.avatar,
              medium: player.avatarmedium,
              large: player.avatarfull
            }
          });
        } else {
          reject("No players found for the given SteamID.");
        }
      } catch (error) {
        reject("Steam server error: " + error.message);
      }
    });
  }

  // Authenticate user
  async authenticate(req) {
    return new Promise((resolve, reject) => {
      const searchParams = url.parse(req.url, true).query;

      if (searchParams['openid.ns'] !== OPENID_CHECK.ns) return reject("Claimed identity is not valid.");
      if (searchParams['openid.op_endpoint'] !== OPENID_CHECK.op_endpoint) return reject("Claimed identity is not valid.");
      if (!searchParams['openid.claimed_id']?.startsWith(OPENID_CHECK.claimed_id)) return reject("Claimed identity is not valid.");
      if (!searchParams['openid.identity']?.startsWith(OPENID_CHECK.identity)) return reject("Claimed identity is not valid.");

      // Verify assertion
      this.relyingParty.verifyAssertion(req, async (error, result) => {
        if (error) return reject(error.message);
        if (!result || !result.authenticated)
          return reject("Failed to authenticate user.");
        if (
          !/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(
            result.claimedIdentifier
          )
        )
          return reject("Claimed identity is not valid.");

        try {
          const user = await this.fetchIdentifier(result.claimedIdentifier);

          return resolve(user);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

// Export class
module.exports = SteamAuth;
