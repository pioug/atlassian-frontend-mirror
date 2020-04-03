import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
# Intro

The **SmartCardProvider** utilises **React.Context** to expose a Store (Redux), Client (SmartCardClient) and any configuration options available for Smart Links.

It accepts the following properties:

${(
  <Props
    heading="SmartCardProvider Props"
    props={require('!!extract-react-types-loader!../src/state/context/provider')}
  />
)}

`;
