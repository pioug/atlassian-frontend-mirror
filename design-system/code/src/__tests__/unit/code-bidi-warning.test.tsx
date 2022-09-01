import React from 'react';

import { render } from '@testing-library/react';

import { characters } from '../../../examples/example-data/bidi-examples';
import CodeBidiWarning from '../../bidi-warning';

describe('CodeBidiWarning', () => {
  test('Decoration is cosmetic', () => {
    const component = render(
      <p>
        hello <CodeBidiWarning bidiCharacter={characters.u202e} />
        world
      </p>,
    );

    expect(component.container.textContent).toBe(
      `hello ${characters.u202e}world`,
    );
  });

  test('Decoration is available to non visual users', () => {
    const component = render(
      <CodeBidiWarning bidiCharacter={characters.u202e} />,
    );

    const bidiCharacterCode = `U+${characters.u202e
      .codePointAt(0)
      ?.toString(16)}`;
    const decoration = component.getByLabelText(bidiCharacterCode);
    expect(decoration).not.toBeNull();
  });
});
