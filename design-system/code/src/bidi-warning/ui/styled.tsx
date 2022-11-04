/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { Y75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const decoration = css({
  // Required as otherwise the following bidi characters cause the span
  // to not receive hover events.
  //
  // U+2066 LEFT-TO-RIGHT ISOLATE (when using pseudo element before)
  // U+202E RIGHT-TO-LEFT OVERRIDE' (when using pseudo element after)
  position: 'relative',

  ':before': {
    display: 'inline-flex',
    padding: `${token('spacing.scale.0', '0px')} ${token(
      'spacing.scale.050',
      '4px',
    )}`,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    background: token('color.background.warning', Y75),
    color: token('color.text.warning', '#7F5F01'),
    content: '"<"attr(data-bidi-character-code)">"',
    fontSize: '14px',
    fontStyle: 'normal',
    lineHeight: '18px',
    /**
     * Ensures the decoration receives pointer events when it occurs with
     * an ancestor that disables them.
     */
    pointerEvents: 'auto',
  },

  ':hover:before': {
    background: token('color.background.warning.hovered', Y75),
    color: token('color.text.warning', '#533F04'),
  },
});

export function Decorator({
  bidiCharacter,
  children,
  testId,
}: {
  bidiCharacter: string;
  children: ReactNode;
  testId?: string;
}) {
  const bidiCharacterCode = getBidiCharacterCode(bidiCharacter);
  return (
    <span aria-label={bidiCharacterCode}>
      <span
        css={decoration}
        data-testid={testId}
        data-bidi-character-code={bidiCharacterCode}
        // This is set to true so that the content is not read out by
        // screen readers as the content includes angle brackets for
        // visual decoration purposes.
        // We use a span with the aria-label set to the bidi character  code
        // above this span for screen readers.
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
}

function getBidiCharacterCode(bidiCharacter: string) {
  const bidiCharacterCode = bidiCharacter.codePointAt(0)?.toString(16);

  return `U+${bidiCharacterCode}`;
}
