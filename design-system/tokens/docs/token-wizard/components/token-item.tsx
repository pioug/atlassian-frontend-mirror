/* eslint-disable @repo/internal/react/no-unsafe-overrides */
/** @jsx jsx */
import { Fragment, useContext } from 'react';

import { css, jsx } from '@emotion/react';

import {
  N0,
  N20,
  N30,
  N40A,
  N50A,
  N60,
  N800,
  N90,
} from '@atlaskit/theme/colors';
import { borderRadius, fontSize, gridSize } from '@atlaskit/theme/constants';

import { token } from '../../../src';
import darkTheme from '../../../src/artifacts/tokens-raw/atlassian-dark';
import lightTheme from '../../../src/artifacts/tokens-raw/atlassian-light';
import { Groups } from '../../../src/types';
import { getCSSCustomProperty } from '../../../src/utils/token-ids';
import { TokenNameSyntaxContext } from '../../token-explorer/components/token-name-syntax-context';
import { cleanTokenName, getBoxShadow, getTextContrast } from '../../utils';
import type {
  Pairings as PairingsType,
  Token as TokenType,
} from '../data/types';

import CopyPasteBlock from './copy-paste-block';
import Pairings from './pairings';

const cardsWrapperStyles = css({
  display: 'flex',
  margin: `${gridSize()}px 0 ${gridSize()}px`,
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

const colorBlockStyles = css({
  minWidth: gridSize() * 12,
  borderRadius: 3,
  cursor: 'pointer',
  fontSize: fontSize(),
  lineHeight: '24px',
  textAlign: 'center',
});

const opacityTokenBlockStyles = css({
  position: 'relative',
  backgroundColor: token('elevation.surface', N0),
  backgroundImage: `linear-gradient(
          45deg,
          ${token('elevation.surface.sunken', '#F4F5F7')} 25%,
          transparent 25%
        ),
        linear-gradient(
          135deg,
          ${token('elevation.surface.sunken', '#F4F5F7')} 25%,
          transparent 25%
        ),
        linear-gradient(
          45deg,
          transparent 75%,
          ${token('elevation.surface.sunken', '#F4F5F7')} 75%
        ),
        linear-gradient(
          135deg,
          transparent 75%,
          ${token('elevation.surface.sunken', '#F4F5F7')} 75%
        )`,
  backgroundPosition: '0px 0px, 8px 0px, 8px -8px, 0px 8px',
  backgroundSize: '16px 16px',
  color: token('color.text', 'black'),
  overflow: 'hidden',
});

const opacityMaskStyles = css({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: token('color.text', N800),
});

const getShadowBlockStyles = (value: any) => ({
  height: gridSize() * 3,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  backgroundColor: 'white',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  color: 'black',
  boxShadow: getBoxShadow(value as any),
});

const getBaseTokenBlockStyles = (value: string) => ({
  background: value,
  color: getTextContrast(value),
});

const subheadingStyles = css({
  fontSize: fontSize(),
  fontWeight: 500,
  lineHeight: '16px',
});

const descriptionStyles = css({
  marginTop: gridSize(),
  paddingBottom: gridSize() * 2,
  fontSize: fontSize(),
  lineHeight: '24px',
});

const valueCardStyles = css({
  minWidth: gridSize() * 6,
  marginRight: gridSize() * 0.5,
  padding: 2,
  background: token('elevation.surface.raised', N0),
  borderRadius: borderRadius(),
  boxShadow: token(
    'elevation.shadow.raised',
    `0 1px 1px ${N50A}, 0 0 1px 1px ${N40A}`,
  ),
});

const themeTextStyles = css({
  margin: '0 12px',
  textAlign: 'center',
});

const ValueCard = ({
  theme,
  group,
  baseToken,
  value,
}: {
  theme: 'light' | 'dark';
  group: Groups;
  baseToken: string;
  value: string | number;
}) => {
  return (
    <div css={valueCardStyles}>
      {group === 'shadow' ? (
        <div style={getShadowBlockStyles(value)} />
      ) : group === 'opacity' ? (
        <CopyPasteBlock
          text={baseToken}
          renderWrapper={(children) => (
            <div css={[colorBlockStyles, opacityTokenBlockStyles]}>
              {children}
              <div css={opacityMaskStyles} style={{ opacity: value }} />
            </div>
          )}
        />
      ) : (
        <CopyPasteBlock
          text={baseToken}
          renderWrapper={(children) => (
            <div
              css={[colorBlockStyles]}
              style={getBaseTokenBlockStyles(value as string)}
            >
              {children}
            </div>
          )}
        />
      )}
      <p css={themeTextStyles}>
        {theme === 'light' ? 'Light value' : 'Dark value'}
      </p>
    </div>
  );
};

/**
 * __TokenItem__
 *
 * A suggested token item on the result panel.
 *
 */
const TokenItem = ({
  tokenName,
  pairings,
}: {
  tokenName: string;
  pairings?: PairingsType;
}) => {
  const lightTokenRaw = lightTheme.find(
    (token) => cleanTokenName(token.name) === tokenName,
  ) as TokenType;

  const darkTokenRaw = darkTheme.find(
    (token) => cleanTokenName(token.name) === tokenName,
  ) as TokenType;

  const {
    value: lightValue,
    original: { value: lightBaseToken },
    attributes: { group, description },
  } = lightTokenRaw;
  const {
    value: darkValue,
    original: { value: darkBaseToken },
  } = darkTokenRaw;

  const tokenValue = (theme: 'light' | 'dark'): string => {
    let value;
    if (group === 'shadow') {
      value = getBoxShadow((theme === 'light' ? lightValue : darkValue) as any);
    } else {
      value = (theme === 'light' ? lightBaseToken : darkBaseToken) as string;
    }
    return value;
  };

  const { syntax } = useContext(TokenNameSyntaxContext);
  const formattedName =
    syntax === 'css-var' ? getCSSCustomProperty(tokenName) : tokenName;

  return (
    <Fragment>
      <CopyPasteBlock
        text={formattedName}
        renderWrapper={(children) => (
          <code css={tokenNameStyled}>{children}</code>
        )}
      />
      <div css={cardsWrapperStyles}>
        <ValueCard
          theme="light"
          group={group as Groups}
          baseToken={tokenValue('light')}
          value={lightValue}
        />
        <ValueCard
          theme="dark"
          group={group as Groups}
          baseToken={tokenValue('dark')}
          value={darkValue}
        />
      </div>
      <h5 css={subheadingStyles}>Description</h5>
      <p css={descriptionStyles}>{description}</p>
      {pairings && (
        <Fragment>
          <h5 css={[subheadingStyles, { marginTop: 0 }]}>
            Recommended pairings
          </h5>
          <Pairings pairings={pairings} />
        </Fragment>
      )}
    </Fragment>
  );
};

export default TokenItem;
