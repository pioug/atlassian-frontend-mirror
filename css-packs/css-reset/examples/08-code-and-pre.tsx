import React from 'react';

/**
 * By default the Atlaskit website includes css-reset in examples
 * when implementing css-reset in your application,
 * please include the stylesheet in head as `<link href="<path to css-reset>" rel="stylesheet" />`
 * or import '@atlaskit/css-reset' in your application code
 */
export default () => (
  <div>
    <h2>Preformatted text using {`<pre>`}</h2>
    <pre>
      {' '}
      Item | Qty ------------------- Apples | 5 Oranges | 10 Grapes | 99
    </pre>
    <h2>Code blocks with {`<pre> and <code>`}</h2>
    <pre>
      <code>
        {`<div class="foo">
<h1>Example markup snippet</h1>
<p>Sona si Latine loqueris. Si <b>Hoc Legere</b> Scis Nimium Eruditionis Habes. Sentio aliquos togatos contra me conspirare.</p>
</div>`}
      </code>
    </pre>
    <h2>Inline {`<code>`}</h2>
    <p>
      Simply paste <code>{`body { font-weight: bold; }`}</code> into your file.
    </p>
  </div>
);
