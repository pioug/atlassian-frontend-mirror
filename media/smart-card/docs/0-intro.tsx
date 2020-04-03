import React from 'react';
import {
  code,
  md,
  Example,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}
  
  Turns a URL into a card with JSON-LD metadata sourced from either:

  - a Client which communicates with Object Resolver Service;
  - a Client which with a custom fetch function (defined by you!).

  ## Usage

  ${code`import { Provider, Card } from '@atlaskit/smart-card';`}

  In the Fabric Editor - wrap your instance of the Editor:

  ${code`
    <SmartCardProvider>
      <Editor />
    </SmartCardProvider>
  `}

  In the Fabric Renderer - wrap your instance of the Renderer:

  ${code`
    <SmartCardProvider>
      <Renderer />
    </SmartCardProvider>
  `}

  ${(
    <Example
      Component={require('../examples/0-intro').default}
      title="An editable example"
      source={require('!!raw-loader!../examples/0-intro')}
    />
  )}

${(
  <Props
    heading="Smart Link Props"
    props={require('!!extract-react-types-loader!../src/view/CardWithUrl/loader')}
  />
)}

`;
