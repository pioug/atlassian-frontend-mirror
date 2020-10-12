import React from 'react';

/**
 * By default the Atlaskit website includes css-reset in examples
 * when implementing css-reset in your application,
 * please include the stylesheet in head as `<link href="<path to css-reset>" rel="stylesheet" />`
 * or import '@atlaskit/css-reset' in your application code
 */
export default () => (
  <div>
    <h2>&lt;ul&gt;</h2>
    <ul>
      <li>First list item</li>
      <li>Second list item</li>
      <li>
        <p>Third list item</p>
        <ul>
          <li>Nested lists as well</li>
          <li>Nested lists as well</li>
          <li>Nested lists as well</li>
        </ul>
      </li>
      <li>
        <p>Fourth list item</p>
        <ol>
          <li>Nested ordered lists as well</li>
          <li>Nested ordered lists as well</li>
          <li>Nested ordered lists as well</li>
        </ol>
      </li>
    </ul>
    <h2>&lt;ol&gt;</h2>
    <ol>
      <li>First list item</li>
      <li>Second list item</li>
      <li>
        <p>Third list item</p>
        <ul>
          <li>Nested lists as well</li>
          <li>Nested lists as well</li>
          <li>Nested lists as well</li>
        </ul>
      </li>
      <li>
        <p>Fourth list item</p>
        <ol>
          <li>Nested ordered lists as well</li>
          <li>Nested ordered lists as well</li>
          <li>Nested ordered lists as well</li>
        </ol>
      </li>
    </ol>
    <h2>&lt;dl&gt;</h2>
    <dl>
      <dt>First definition</dt>
      <dd>Definition description</dd>
      <dd>Definition description</dd>
      <dt>Second definition</dt>
      <dd>Definition description</dd>
      <dt>Third definition</dt>
      <dd>
        <p>Paragraphs should be fine when followed by</p>
        <ul>
          <li>lists like</li>
          <li>this one</li>
        </ul>
        <ol>
          <li>or ordered lists</li>
          <li>like this one</li>
        </ol>
      </dd>
    </dl>
  </div>
);
