import React from 'react';

import { Code, CodeBlock } from '../src';

import { characters, codeSnippets } from './example-data/bidi-examples';

export default function Component() {
  return (
    <div>
      <div data-testid="bidi-code-warning">
        <h2>Bidi characters</h2>
        <p>
          Bidi characters in code blocks and snippets are visually presented to
          mitigate against trojan source attacks.
        </p>
        <h3>Code block examples</h3>
        {Object.entries(codeSnippets).map(([snippetKey, snippetValue]) => {
          return (
            <>
              <h3>Example: {snippetKey}</h3>
              <CodeBlock
                testId={`bidi-warning-${snippetKey}`}
                text={snippetValue}
              />
            </>
          );
        })}
        <h3>Code snippet examples</h3>
        {Object.entries(characters).map(([characterKey, characterValue]) => {
          return (
            <>
              <h3>Example: {characterKey}</h3>
              Inline code snippet{' '}
              <Code testId={`bidi-warning-${characterKey}`}>
                start{characterValue}end
              </Code>
              .
            </>
          );
        })}
      </div>
    </div>
  );
}
