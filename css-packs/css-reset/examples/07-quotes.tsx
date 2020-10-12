import React from 'react';

/**
 * By default the Atlaskit website includes css-reset in examples
 * when implementing css-reset in your application,
 * please include the stylesheet in head as `<link href="<path to css-reset>" rel="stylesheet" />`
 * or import '@atlaskit/css-reset' in your application code
 */
export default () => (
  <div>
    <h2>
      {`<blockquote>`} with {`<cite>`}
    </h2>
    <blockquote>
      <p>
        All that is gold does not glitter, not all those who wander are lost;
        The old that is strong does not wither, deep roots are not reached by
        the frost.
      </p>
      <p>
        {' '}
        From the ashes a fire shall be woken, a light from the shadows shall
        spring; Renewed shall be blade that was broken, the crownless again
        shall be king.
      </p>
      <p>
        <cite>J.R.R. Tolkien, The Fellowship of the Ring</cite>.
      </p>
    </blockquote>
    <h2>
      Inline quotes with {`<q>`} and {`<cite>`}
    </h2>
    <p>
      The old addage{' '}
      <q>
        Be yourself; everyone else is already taken. <cite>Oscar Wilde</cite>
      </q>{' '}
      is very fitting.
    </p>
  </div>
);
