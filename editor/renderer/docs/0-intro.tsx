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

## Best practices to prevent performance issues

### Avoid unnecessary props changes

As any React component, if props change then it will likely result in a re-render.

Unnecessary props changes will trigger component reconciliation and potential re-renders. This has caused render performance degradation for Editor and Renderer components in the past.

Some common examples of props causing re-renders:

${code`

  // ❌ function returns new object each time
  getEventHandlers = () => ({
      ...defaultHandlers,
      newHander: () => { ... }
  });

  // ❌ creates new function each time
  onRenderComplete = () => {
    // ...
  }

  return (
  <ReactRenderer
    // ❌ passes new object each time
    media={{
      allowLinking: true,
    }}
    // ❌ called function returns new object each time
    eventHandlers={this.getEventHandlers()}
    // ❌ passes new function each time
    onComplete={onRenderComplete}
    // ❌ creates a new function each time
    onError={() => { ... }}
    //...
  />);
`}

Most of these can be generally avoided by following these best practices:
- extracting static objects to module level constants
- avoid passing brand new objects and anonymous functions as props upon every render
- memoising props via helpers like [useMemo()](https://reactjs.org/docs/hooks-reference.html#usememo)
- use [useCallback()](https://reactjs.org/docs/hooks-reference.html#usecallback) for callbacks where applicable

### Other best practices for React

Consider using [windowing techniques](https://reactjs.org/docs/optimizing-performance.html#virtualize-long-lists) if possible when rendering many Renderers (eg. viewing comments).

For Renderer it is important to avoid [redundant reconciliation](https://reactjs.org/docs/optimizing-performance.html#avoid-reconciliation) as it can involve rendering many nested React components, depending on the document structure.

Check out the React docs for more examples of [optimizations](https://reactjs.org/docs/hooks-faq.html#performance-optimizations).

### Avoid duplicated dependencies

Ensure you have only have *one* version of Renderer sub-dependencies (adf-schema, editor-common, prosemirror-model, etc) in your output bundles.

This has caused bugs and crashes on production in the past.

The issue can be avoided by running de-duplication on the lock file or using resolutions for yarn/overrides for npm on the package.json.

### Use correct peer dependencies

Make sure to use correct peer dependencies versions!

For example, using newer versions of React or react-dom can cause unexpected issues with Renderer.

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
    Component={require('../examples/15-truncated').default}
    title="Truncated"
    source={require('!!raw-loader!../examples/15-truncated')}
  />
)}

${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../src/ui/Renderer/index')}
  />
)}
`;
