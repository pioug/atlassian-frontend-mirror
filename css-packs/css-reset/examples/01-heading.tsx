import React from 'react';

/**
 * By default the Atlaskit website includes css-reset in examples
 * when implementing css-reset in your application,
 * please include the stylesheet in head as `<link href="<path to css-reset>" rel="stylesheet" />`
 * or import '@atlaskit/css-reset' in your application code
 */
export default () => (
  <div>
    <h1>This &lt;h1&gt; element is using h800</h1>
    <h2>This &lt;h2&gt; element is using h700</h2>
    <h3>This &lt;h3&gt; element is using h600</h3>
    <h4>This &lt;h4&gt; element is using h500</h4>
    <h5>This &lt;h5&gt; element is using h400</h5>
    <h6>This &lt;h6&gt; element is using h300</h6>
  </div>
);
