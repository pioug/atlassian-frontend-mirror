/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import WorldIcon from '@atlaskit/icon/glyph/world';
import { N20, N30, N40, N60, N800, N90 } from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';

import { token, useThemeObserver } from '../../../src';
import darkTheme from '../../../src/artifacts/tokens-raw/atlassian-dark';
import lightTheme from '../../../src/artifacts/tokens-raw/atlassian-light';
import { cleanTokenName } from '../../utils';
import type { Pairings as PairingsType } from '../data/results';
import type { Token as TokenType } from '../types';

import CopyPasteBlock from './copy-paste-block';

const wrapperStyles = css({
  maxWidth: 'fit-content',
  margin: `${gridSize() * 2}px 0`,
  padding: 16,
  border: `1px solid ${token('color.border', N40)}`,
  borderRadius: borderRadius(),
});

const tokenNameStyled = css({
  padding: `${gridSize() * 0.5}px ${gridSize()}px`,
  background: token('color.background.neutral', N20),
  borderRadius: borderRadius(),
  color: token('color.text', N800),
  cursor: 'pointer',
  fontSize: '12px',
  lineHeight: '24px',
  span: {
    color: token('color.icon.subtle', N90),
    verticalAlign: 'middle',
  },
  ':hover': {
    background: token('color.background.neutral.hovered', N30),
  },
  ':active': {
    background: token('color.background.neutral.pressed', N60),
  },
});

const exampleStyles = css({
  display: 'flex',
  marginBottom: gridSize() * 2,
  padding: '36px 104px',
  alignItems: 'center',
  columnGap: 8,
  borderRadius: borderRadius(),
  fontSize: '24px',
});

const tokenNameWrapperStyles = css({
  '&:not(:last-of-type)': {
    marginBottom: gridSize(),
  },
});
/**
 * __Pairing__
 *
 * Recommended pairings for the suggested token on the result panel.
 *
 */
const Pairing = ({ pairings }: { pairings: PairingsType }) => {
  const theme = useThemeObserver();
  const tokensList = theme === 'dark' ? darkTheme : lightTheme;
  const findTokenValue = (tokenName: string) => {
    const token = tokensList.find(
      (token) => cleanTokenName(token.name) === tokenName,
    ) as TokenType;
    return token?.value;
  };

  return (
    <div css={wrapperStyles}>
      <div
        css={[
          exampleStyles,
          {
            border: `1px solid ${findTokenValue(pairings.border)}`,
            background: findTokenValue(pairings.background),
            color: findTokenValue(pairings.text),
          },
        ]}
      >
        <WorldIcon
          primaryColor={findTokenValue(pairings.icon)}
          label="pairingIcon"
        />
        Text
      </div>
      {Object.values(pairings)
        .sort()
        .map((tokenName) => (
          <div css={tokenNameWrapperStyles}>
            <CopyPasteBlock
              text={tokenName}
              renderWrapper={(children) => (
                <code css={tokenNameStyled}>{children}</code>
              )}
            />
          </div>
        ))}
    </div>
  );
};

export default Pairing;
