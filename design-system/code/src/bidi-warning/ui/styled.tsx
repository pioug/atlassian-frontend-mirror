/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

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
    /* layout */
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 4px',
    fontSize: '14px',
    lineHeight: '18px',

    background: token('color.background.warning', Y75),

    /**
     * Ensures the decoration receives pointer events when it occurs with
     * an ancestor that disables them.
     */
    pointerEvents: 'auto',

    /* contents */
    content: '"<"attr(data-bidi-character-code)">"',
    // This color is Y800 which is not yet rolled out
    // https://hello.atlassian.net/wiki/spaces/~tswan/pages/1366555782?focusedCommentId=1370387374#comment-1370387374
    color: token('color.text.warning', '#7F5F01'),
    fontStyle: 'normal',
  },

  ':hover:before': {
    color: token('color.text.warning', '#533F04'),
    background: token('color.background.warning.hovered', Y75),
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
