import React from 'react';

/**
 * By default the Atlaskit website includes css-reset in examples
 * when implementing css-reset in your application,
 * please include the stylesheet in head as `<link href="<path to css-reset>" rel="stylesheet" />`
 * or import '@atlaskit/css-reset' in your application code
 */
export default () => (
  <div>
    <p>
      <a href=".">Standard link</a>
    </p>
    <p>
      Link with descenders: <a href=".">jump quickly!</a>
    </p>
    <h2>
      Link in a <a href=".">heading</a>
    </h2>
    <ul>
      <li>
        <a href=".">links can also</a>
      </li>
      <li>
        <a href=".">appear in lists</a>
      </li>
      <li>
        <a href=".">like this</a>
      </li>
    </ul>
  </div>
);
