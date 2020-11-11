# SimpleWebRTC Recording Sample Client

This example client is meant to demonstrate how to create a recording client for
use with a SimpleWebRTC App. This app is based on the [https://github.com/simplewebrtc/simplewebrtc-talky-sample-app](SimpleWebRTC Sample App)
but includes a tiny backend which is responsible for verifying access to the recording client.
The verification step is important to prevent public access to your rooms.


## Running locally

You can retrieve your API key and secrets by visiting [https://accounts.simplewebrtc.com](https://accounts.simplewebrtc.com).
1. `npm i`
2. `SWRTC_API_KEY=<YOUR_API_KEY> npm run build:app`
3. `SWRTC_API_SECRET=<YOUR_SECRET_KEY> npm start`

## Token verification

Access to the call is verified by a JSON Web Token.
This JWT is generated by the
SimpleWebRTC API, signed by your API Secret,
and then passed to the recording client
as a *query param*. In this example app you can
set the API Secret as an environment parameter
to the process as shown above `SWRTC_API_SECRET=<YOUR_SECRET_KEY> npm start`.

Snippet from [./public/index.html](index.html)

```js
      // get query params
      const params = new URLSearchParams(window.location.search);
      // org_key is your API_KEY
      const org_key = params.get('org_key');
      // recording_token is a signed jwt generated by the API
      const recording_token = params.get('auth_token');

      // post to a route to make sure the
      // client should be accessible
      // with the provided jwt
      fetch('/verify-recording', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          recording_token,
          org_key
        })
      })
      .then((res) => res.json())
      .then((recording_data) => {
        // decode the jwt and get the
        // roomName and userData for the client
        SimpleWebRTC.run({
          org_key,
          roomName: recording_data.roomName,
          userDataToken: recording_data.userDataToken,
          root: document.getElementById('root'),
          gridPlaceholder: () => SimpleWebRTC.loadTemplate('empty-peer-grid'),
          haircheckHeaderPlaceholder: () =>
            SimpleWebRTC.loadTemplate('haircheck-header'),
          emptyRosterPlaceholder: () => SimpleWebRTC.loadTemplate('empty-roster'),
          homepagePlaceholder: () => SimpleWebRTC.loadTemplate('homepage')
        });
      });
```

