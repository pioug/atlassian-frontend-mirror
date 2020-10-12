import React from 'react';
import { md, code, Example } from '@atlaskit/docs';

export default md`

This package exports a CSS file which provides a minimal reset along with base styles for many HTML elements. It is meant to be used as a basis for all styling to be built upon.

## Usage

Please include the stylesheet bundle available in css-reset package.

*css-reset* should be the first stylesheet on your page, that is, all the other stylesheet should be included after css-reset*

${code`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Your page</title>
    <link rel="stylesheet" href="node_modules/@atlaskit/css-reset/dist/bundle.css" />
    <!-- your awesome styles -->
  </head>
  <body>
    <p>Hello world!</p>
  </body>
</html>
`}

${(
  <Example
    packageName="@atlaskit/css-reset"
    Component={require('../examples/01-heading').default}
    title="Heading"
    source={require('!!raw-loader!../examples/01-heading')}
  />
)}

${(
  <Example
    packageName="@atlaskit/css-reset"
    Component={require('../examples/02-links').default}
    title="Links"
    source={require('!!raw-loader!../examples/02-links')}
  />
)}

${(
  <Example
    packageName="@atlaskit/css-reset"
    Component={require('../examples/03-lists-flat').default}
    title="Lists - flat"
    source={require('!!raw-loader!../examples/03-lists-flat')}
  />
)}

${(
  <Example
    packageName="@atlaskit/css-reset"
    Component={require('../examples/04-lists-nested').default}
    title="Lists - nested"
    source={require('!!raw-loader!../examples/04-lists-nested')}
  />
)}

${(
  <Example
    packageName="@atlaskit/css-reset"
    Component={require('../examples/05-tables-simple').default}
    title="Table - simple"
    source={require('!!raw-loader!../examples/05-tables-simple')}
  />
)}

${(
  <Example
    packageName="@atlaskit/css-reset"
    Component={require('../examples/06-tables-complex').default}
    title="Tables - complex"
    source={require('!!raw-loader!../examples/06-tables-complex')}
  />
)}

${(
  <Example
    packageName="@atlaskit/css-reset"
    Component={require('../examples/07-quotes').default}
    title="Quotes"
    source={require('!!raw-loader!../examples/07-quotes')}
  />
)}

${(
  <Example
    packageName="@atlaskit/css-reset"
    Component={require('../examples/08-code-and-pre').default}
    title="Code/ Pre"
    source={require('!!raw-loader!../examples/08-code-and-pre')}
  />
)}

${(
  <Example
    packageName="@atlaskit/css-reset"
    Component={require('../examples/09-misc-elements').default}
    title="Miscellaneous"
    source={require('!!raw-loader!../examples/09-misc-elements')}
  />
)}
`;
