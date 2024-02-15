/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { N0, N30A, N60A } from '@atlaskit/theme/colors';

import token from '../../src/get-token';

export const TokenModalCodeBlock = `
import { N0, N30A, N60A, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

color: token('color.text', N800),
background: token('elevation.surface.overlay', N0),
boxShadow: token(
  'elevation.shadow.overlay',
  \`0 0 0 1px \${N30A}, 0 2px 1px \${N30A}, 0 0 20px -6px \${N60A}\`,
),
`;

const dialogStyles = css({
  display: 'flex',
  minHeight: 0,
  flex: '1 1 auto',
  flexDirection: 'column',
  backgroundColor: token('elevation.surface.overlay', N0),
  borderRadius: token('border.radius.100', '3px'),
  boxShadow: token(
    'elevation.shadow.overlay',
    `0 0 0 1px ${N30A}, 0 2px 1px ${N30A}, 0 0 20px -6px ${N60A}`,
  ),
  pointerEvents: 'auto',
});

const headerStyles = css({
  display: 'flex',
  padding: '24px 24px 22px',
});

const titleStyles = css({
  margin: 0,
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: 1,
});

const bodyStyles = css({
  padding: '2px 24px',
});

const footerStyles = css({
  display: 'flex',
  padding: '22px 24px 24px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '8px',
});

export const TokenModal = () => {
  return (
    <div css={dialogStyles}>
      <div css={headerStyles}>
        <span css={titleStyles}>Modal dialog</span>
      </div>
      <div css={bodyStyles}>
        This is place holder text. The basic dialog for modals should contain
        only valuable and relevant information. Simplify dialogs by removing
        unnecessary elements or content that does not support user tasks. If you
        find that the number of required elements for your design are making the
        dialog excessively large, then try a different design solution.{' '}
      </div>
      <div css={footerStyles}>
        <Button testId="secondary" appearance="subtle">
          Cancel
        </Button>
        <Button testId="primary" appearance="primary">
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default { example: TokenModal, code: TokenModalCodeBlock };
