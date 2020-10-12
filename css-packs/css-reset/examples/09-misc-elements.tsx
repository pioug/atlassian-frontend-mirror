import React from 'react';

/**
 * By default the Atlaskit website includes css-reset in examples
 * when implementing css-reset in your application,
 * please include the stylesheet in head as `<link href="<path to css-reset>" rel="stylesheet" />`
 * or import '@atlaskit/css-reset' in your application code
 */
export default () => (
  <div>
    <h2>{`<time>`}</h2>
    <p>
      Can you move that meeting on <time dateTime="20220101 10:00">May 15</time>{' '}
      to the pub?
    </p>
    <h2>
      {`<dfn>`} and {`<abbr>`}
    </h2>
    <p>
      <dfn>Recursion</dfn>: the repeated application of a recursive procedure or
      definition.See also: recursion.
    </p>
    <p>
      The <abbr title="Atlaskit">AK</abbr> library provides a typography
      component &mdash; make sure you put a title (or AkTooltip) on your{' '}
      {`<abbr>`} elements.
    </p>
    <h2>
      {`<ins>`} and {`<del>`}
    </h2>
    <p>
      Ice cream <del>sucks</del>
      <ins>is awesome</ins>!
    </p>
    <h2>
      {`<sub>`} and {`<sup>`}
    </h2>
    <p>
      These elements
      <a href=".">
        <sup>1</sup>
      </a>{' '}
      should still
      <a href=".">
        <sub>2</sub>
      </a>{' '}
      have default styling<sup>3</sup> as well<sub>4</sub>
    </p>
    <h2>Keyboard commands with {`<kbd>`}</h2>
    <p>
      Simply press <kbd>Alt</kbd> + <kbd>F4</kbd> to preview your changes.
    </p>
    <h2>Variables in a mathematical expression with {`<var>`}</h2>
    <p>
      A simple equation: <var>x</var> = <var>y</var> + 2
    </p>
    <h2>{`<small>`} text</h2>
    <p>
      <small>Only use this size text if there is a good rationale.</small>
    </p>
  </div>
);
