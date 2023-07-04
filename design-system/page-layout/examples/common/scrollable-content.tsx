/** @jsx jsx */

import { Fragment, useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

type ScrollableContentProps = {
  shouldHighlightNth?: boolean;
};

const itemStyles = css({
  boxSizing: 'border-box',
  width: '80%',
  height: '2rem',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  margin: '2rem auto',
  backgroundColor: token(
    'color.background.accent.orange.subtler',
    'papayawhip',
  ),
  borderRadius: token('border.radius', '3px'),
});

const highlightStyles = css({
  ':nth-of-type(4n)': {
    padding: token('space.050', '4px'),
    position: 'sticky',
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    top: 65,
    backgroundColor: token(
      'color.background.accent.blue.subtle',
      'cornflowerblue',
    ),
    textAlign: 'center',
    '&::after': {
      color: token('color.text.inverse', '#FFF'),
      content: '"Stickied element"',
    },
  },
});

const ScrollableContent = ({
  shouldHighlightNth = false,
}: ScrollableContentProps) => {
  const items = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => (
        <div
          key={i}
          css={[itemStyles, shouldHighlightNth && highlightStyles]}
        />
      )),
    [shouldHighlightNth],
  );

  return <Fragment>{items}</Fragment>;
};

export default ScrollableContent;
