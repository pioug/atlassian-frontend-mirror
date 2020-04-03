import React from 'react';
import {
  md,
  Example,
  Props,
  code,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

This component provides a renderer for ADF documents.

## Usage

Use the component in your React app as follows:

${code`
import { ReactRenderer } from '@atlaskit/renderer';
ReactDOM.render(<ReactRenderer document={DOCUMENT} />, container);
`}

## Example

${(
  <Example
    Component={require('../examples/1-with-providers').default}
    title="With Providers"
    source={require('!!raw-loader!../examples/1-with-providers')}
  />
)}

## Using transformers with the renderer
You will need to use a transformer to convert your own storage format into the ADF before you pass it to the renderer.
We have provided helper utility to simplify this process:

${code`
import { BitbucketTransformer } from '@atlaskit/editor-bitbucket-transformer';
import { ReactRenderer, ADFEncoder } from '@atlaskit/renderer';

const adfEncoder = new ADFEncoder(schema => new BitbucketTransformer(schema));
const document = adfEncoder.encode(DOCUMENT);

ReactDOM.render(<ReactRenderer document={document} />, container);
`}

## Polyfills

Don't forget to add polyfills for fetch, ES6 & ES7 to your product build if you want to target older browsers.
We recommend the use of [babel-preset-env](https://babeljs.io/docs/plugins/preset-env/) & [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)

## Truncated renderer
The renderer can be truncated with a fade to white so that excess content is hidden. Control of expanding is left to the parent
so the text and links can be customised - see the example.

The props \`truncated\`, \`maxHeight\` and \`fadeOutHeight\` are all optional. \`maxHeight\` will default to 95px
and \`fadeOutHeight\` will default to 30px unless defined.

${code`
import { ReactRenderer } from '@atlaskit/renderer';
ReactDOM.render(<ReactRenderer document={DOCUMENT} truncated={true} maxHeight={70} fadeOutHeight={30} />, container);
`}

${(
  <Example
    Component={require('../examples/15-truncated.tsx').default}
    title="Truncated"
    source={require('!!raw-loader!../examples/15-truncated.tsx')}
  />
)}

${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../src/ui/Renderer/index')}
  />
)}
`;
