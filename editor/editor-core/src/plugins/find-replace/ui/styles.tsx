/** @jsx jsx */
import { css } from '@emotion/react';
import { N60, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

export const replaceSectionButtonStyles = css({
  marginLeft: token('space.050', '4px'),
});

export const ruleStyles = css({
  width: '100%',
  border: 'none',
  backgroundColor: `${token('color.border', N30A)}`,
  margin: `${token('space.050', '4px')} 0px`,
  height: '1px',
  borderRadius: '1px',
});

export const wrapperStyles = css({
  display: 'flex',
  flexDirection: 'column',

  '> *:not(#replace-hr-element)': {
    margin: `0px ${token('space.050', '4px')}`,
  },
});

export const sectionWrapperStyles = css`
  display: flex;

  & > * {
    display: inline-flex;
    height: 32px;
    flex: 0 0 auto;
  }

  & > [data-ds--text-field--container] {
    display: flex;
    flex: 1 1 auto;
  }
`;

export const countStyles = css({
  color: `${token('color.text.subtlest', N60)}`,
  fontSize: `${relativeFontSizeToBase16(12)}`,
  flex: '0 0 auto',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: token('space.050', '4px'),
  marginRight: token('space.100', '8px'),
});

export const countWrapperStyles = css({
  alignItems: 'center',
});
