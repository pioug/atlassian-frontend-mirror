import { md, code } from '@atlaskit/docs';
export default md`
**Server-side rendering (SSR)** is a performance optimization for modern web apps.

It enables us to fetch the file metadata and render the thumbnail to raw HTML and CSS on the server before serving it to a browser. This means users will see the thumbnail right at page load.

Media card provides a handy API for using it with server-side rendering.

## Prerequisite
Media Card is wrapped with [React-loadable](https://github.com/jamiebuilds/react-loadable) for async loading and it is **not** compatible with SSR out of box.

The basic idea is to avoid async loading when rendering on the server side and during the client side hydration. There are multiple solution for this.

Please reach out Media Team to get support

## Properties

### MediaClientConfig

\`initialAuth\` - mandatory for both server and client sides.

The nature of SSR in React is generally defined as a synchronous operation and authProvider is async, so we provide \`initialAuth\` prop which is a sync method

\`authProvider\` - mandatory for client side only.

You can provide below placeholder only in case you can't provide it in server side.

${code`authProvider: () => Promise.reject(new Error('must use initialAuth'))`}

### ssr

\`"server"|"client"\` - it is used to indicate that the card is rendered on client or server side

## Usage

### Stage 1 - Server side

${code`
import { Card } from '@atlaskit/media-card';
import { MediaClientConfig } from '@atlaskit/media-core';

// The token lifespan must be long enough for related file data to be fetched
const initialAuth = {
  clientId: "f41dff68-9c65-4def-803a-13a0b73f3986"
  baseUrl: "https://media.dev.atl-paas.net"
  token: "jwt-token"
}

const mediaClientConfig = {
  authProvider: () => Promise.reject(new Error('must use initialAuth')),
  initialAuth
};

const identifier = {
  mediaItemType: 'file',
  id: 'some-file-id',
  collectionName: 'some-collection-name',
};

<Card ssr="server" mediaClientConfig={mediaClientConfig} identifier={identifier} />;
`}

### Stage 2 - Client side hydration

${code`
import { Card } from '@atlaskit/media-card';
import { MediaClientConfig } from '@atlaskit/media-core';

// The token lifespan must be long enough for file data to be fetched
const initialAuth = {
  clientId: "f41dff68-9c65-4def-803a-13a0b73f3986"
  baseUrl: "https://media.dev.atl-paas.net"
  token: "jwt-token"
}

const mediaClientConfig = {
  authProvider,
  initialAuth
};

// make sure the identifier matches the one on the server side
const identifier = {
  mediaItemType: 'file',
  id: 'some-file-id',
  collectionName: 'some-collection-name',
};

<Card ssr="client" mediaClientConfig={mediaClientConfig} identifier={identifier} />;
`}

## Integration with Renderer
### Stage 1 - Server side

${code`
import { ReactRenderer } from "@atlaskit/renderer";

// The token lifespan must be long enough for file data to be fetched
const initialAuth = {
  clientId: "f41dff68-9c65-4def-803a-13a0b73f3986"
  baseUrl: "https://media.dev.atl-paas.net"
  token: "jwt-token"
}

const mediaClientConfig = {
  authProvider: () => Promise.reject(new Error('must use initialAuth')),
  initialAuth
};

<ReactRenderer
  media={{
    ssr:{
      mode: 'server',
      config: mediaClientConfig
    }
  }}
  ...
/>;
`}

### Stage 2 - Client side hydration

${code`
import { ReactRenderer } from "@atlaskit/renderer";

// The token lifespan must be long enough for file data to be fetched
const initialAuth = {
  clientId: "f41dff68-9c65-4def-803a-13a0b73f3986"
  baseUrl: "https://media.dev.atl-paas.net"
  token: "jwt-token"
}

const mediaClientConfig = {
  authProvider,
  initialAuth
};

<ReactRenderer
  media={{
    ssr:{
      mode: 'client',
      config: mediaClientConfig
    }
  }}
  ...
/>;
`}
`;
