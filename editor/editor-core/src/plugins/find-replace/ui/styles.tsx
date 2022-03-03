/** @jsx jsx */
import { css } from '@emotion/react';
import { N60, N30A } from '@atlaskit/theme/colors';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

export const replaceSectionButtonStyles = css({
  marginLeft: '4px',
});

export const ruleStyles = css({
  width: '100%',
  border: 'none',
  backgroundColor: `${N30A}`,
  margin: '4px 0px',
  height: '1px',
  borderRadius: '1px',
});

export const wrapperStyles = css({
  display: 'flex',
  flexDirection: 'column',

  '> *:not(#replace-hr-element)': {
    margin: '0px 4px',
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
  color: `${N60}`,
  fontSize: `${relativeFontSizeToBase16(12)}`,
  flex: '0 0 auto',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: '4px',
  marginRight: '8px',
});
