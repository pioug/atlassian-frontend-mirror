/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/core';

import { Code } from '@atlaskit/code';
import { md } from '@atlaskit/docs';
import Lozenge from '@atlaskit/lozenge';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

import darkTheme from '../src/artifacts/tokens-raw/atlassian-dark';
import lightTheme from '../src/artifacts/tokens-raw/atlassian-light';

const sortByStatus = (a: Token, b: Token) => {
  if (
    a.attributes.state === 'deprecated' &&
    b.attributes.state !== 'deprecated'
  ) {
    return 1;
  }
  if (
    b.attributes.state === 'deprecated' &&
    a.attributes.state !== 'deprecated'
  ) {
    return -1;
  }

  return 0;
};

function hexToRGB(hex: string) {
  const hexColor = hex.replace('#', '');

  return {
    r: parseInt(hexColor.substr(0, 2), 16),
    g: parseInt(hexColor.substr(2, 2), 16),
    b: parseInt(hexColor.substr(4, 2), 16),
  };
}

function getTextContrast(hex: string) {
  const { r, g, b } = hexToRGB(hex);
  const lum = (r * 299 + g * 587 + b * 114) / 1000;

  return lum >= 80 ? 'black' : 'white';
}

const listStyles = css({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  li: {
    padding: 0,
    margin: 0,
  },
});

const tokenStyles = css({
  display: 'grid',
  gridGap: '10px',
  gridTemplateColumns: 'repeat(6, 1fr)',
  borderRadius: '3px',
  border: '1px solid #eee',
  marginBottom: '8px',
  padding: '10px',
});

const tokenNameStyles = css({
  gridColumnStart: 'span 4',
});

const tokenValueStyles = css({
  gridColumnStart: 'span 2',
  padding: '5px',
  borderRadius: '3px',
  minWidth: '180px',
  border: '1px solid #eaeaea',
  'span:nth-of-type(2)': {
    display: 'none',
  },
  ':hover span:first-of-type': {
    display: 'none',
  },
  ':hover span:nth-of-type(2)': {
    display: 'block',
  },
});

const tokenDescriptionStyles = css({
  gridRowStart: '2',
  gridColumnStart: 'span 6',
  margin: 0,
});

interface Token {
  value: string;
  name: string;
  attributes: {
    group: string;
    description?: string;
    state?: string;
    replacement?: string;
  };
  original: {
    value: string;
  };
}

function getAppearance(state?: string) {
  switch (state) {
    case 'deprecated':
    case 'deleted':
      return 'removed';
    case 'active':
      return 'success';
    default:
      return 'default';
  }
}

function getBoxShadow(rawShadow: any[]) {
  return rawShadow
    .map(({ radius, offset, color, opacity }) => {
      const { r, g, b } = hexToRGB(color);

      return `${offset.x}px ${offset.y}px ${radius}px rgba(${r}, ${g}, ${b}, ${opacity})`;
    })
    .join(',');
}

const Token = ({ name, value, attributes, original }: Token) => (
  <div>
    <div css={tokenStyles}>
      <div css={tokenNameStyles}>
        <Code>{name}</Code>{' '}
        <Lozenge appearance={getAppearance(attributes.state)}>
          {attributes.state}
        </Lozenge>
      </div>
      <div
        css={tokenValueStyles}
        style={
          attributes.group !== 'shadow'
            ? { backgroundColor: value, color: getTextContrast(value) }
            : {
                backgroundColor: 'white',
                color: 'black',
                boxShadow: getBoxShadow(value as any),
              }
        }
      >
        {typeof value === 'string' && (
          <Fragment>
            <span>{original.value}</span>
            <span>{value}</span>
          </Fragment>
        )}
      </div>
      <p css={tokenDescriptionStyles}>{attributes.description}</p>
    </div>
  </div>
);

const TokenList = ({ list }: { list: Token[] }) => (
  <ul css={listStyles}>
    {list.map((token) => (
      <li key={token.name}>
        <Token {...token} />
      </li>
    ))}
  </ul>
);

export default md`
  ${(
    <Tabs id="default">
      <TabList>
        <Tab>Alassian Light Theme</Tab>
        <Tab>Alassian Dark Theme</Tab>
      </TabList>
      <TabPanel>
        <TokenList list={(lightTheme as Token[]).sort(sortByStatus)} />
      </TabPanel>
      <TabPanel>
        <TokenList list={(darkTheme as Token[]).sort(sortByStatus)} />
      </TabPanel>
    </Tabs>
  )}
`;
