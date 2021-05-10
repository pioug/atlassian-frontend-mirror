/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';

import Button from '@atlaskit/button';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import { Code } from '../src';

const jsCode = `const map = new Map({ key: 'value' })`;
const adg4 = `ADG 4.0`;

const containerStyles: CSSObject = {
  maxWidth: 800,
  display: 'grid',
  alignItems: 'baseline',
  gridTemplateColumns: '100px 1fr',
  gap: 8,
  margin: 8,
};

const noMarginTopStyles: CSSObject = { marginTop: 0 };

export default function Component() {
  return (
    <AtlaskitThemeProvider mode="dark">
      <div id="inline-examples" css={containerStyles}>
        <p>h1 w/ code</p>
        <h1 css={noMarginTopStyles}>
          Code in a heading <Code testId="code-h1">{adg4}</Code>
        </h1>
        <p>h2 w/ code</p>
        <h2 css={noMarginTopStyles}>
          Code in a heading <Code testId="code-h2">{adg4}</Code>
        </h2>
        <p>h3 w/ code</p>
        <h3 css={noMarginTopStyles}>
          Code in a heading <Code testId="code-h3">{adg4}</Code>
        </h3>
        <p>p w/ code</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.{' '}
          <Code testId="code-p">{jsCode}</Code>
        </p>
        <p>very long code</p>
        <p>
          <Code testId="code-long">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam totam
            architecto laudantium necessitatibus reiciendis. Vero eaque
            repellendus assumenda maxime nobis, earum nihil placeat facilis
            aliquid suscipit obcaecati. Quis, amet fuga?
          </Code>
        </p>
        <p>jsx child</p>
        <p>
          <Code testId="code-children">
            {jsCode} <Button appearance="primary">Hello</Button>
          </Code>
        </p>
      </div>
    </AtlaskitThemeProvider>
  );
}
