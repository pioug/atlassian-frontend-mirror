import React from 'react';

const CSSResetLinksExample = () => (
  <div data-testid="css-reset">
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

export default CSSResetLinksExample;
