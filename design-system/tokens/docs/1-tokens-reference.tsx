/** @jsx jsx */
import { Fragment, useState } from 'react';

import { css, jsx } from '@emotion/core';

import { Code } from '@atlaskit/code';
import { md } from '@atlaskit/docs';
import SearchIcon from '@atlaskit/icon/glyph/search';
import Lozenge from '@atlaskit/lozenge';
import SectionMessage from '@atlaskit/section-message';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import TextField from '@atlaskit/textfield';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import Toggle from '@atlaskit/toggle';

import { token } from '../src';
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
  borderRadius: borderRadius(),
  border: `1px solid ${token('color.border', '#eaeaea')}`,
  marginBottom: `${gridSize()}px`,
  padding: '10px',
});

const tokenNameStyles = css({
  gridColumnStart: 'span 4',
});

const tokenValueStyles = css({
  gridColumnStart: 'span 2',
  padding: '5px',
  borderRadius: borderRadius(),
  minWidth: '180px',
  border: `1px solid ${token('color.border', '#eaeaea')}`,
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

const searchWrapperStyles = css({
  display: 'flex',
  flexDirection: 'column',
  margin: `${gridSize() * 2}px 0px`,
  padding: 8,
  borderRadius: borderRadius(),
  border: `1px solid ${token('color.border', '#eaeaea')}`,
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

function cleanTokenName(name: string) {
  return name.replace(/\.\[default\]/g, '');
}

const Token = ({ name, value, attributes, original }: Token) => (
  <div>
    <div css={tokenStyles}>
      <div css={tokenNameStyles}>
        <Code>{cleanTokenName(name)}</Code>{' '}
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
  <Fragment>
    <div>
      <ul css={listStyles}>
        {list.map((token) => (
          <li key={token.name}>
            <Token {...token} />
          </li>
        ))}
      </ul>
    </div>
  </Fragment>
);

const TokenExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeprecated, setShowDeprecated] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);

  const filterTheme = (theme: typeof lightTheme) =>
    theme
      .filter(
        (token) =>
          token.attributes.state === 'active' ||
          (token.attributes.state === 'deprecated' && showDeprecated) ||
          (token.attributes.state === 'deleted' && showDeleted),
      )
      .filter(
        (token) =>
          !searchQuery ||
          token.name.search(
            searchQuery.replace(/[-[\]{}()*+?.,\\^$|]/g, '\\$&'),
          ) !== -1,
      );

  const filteredDarkTheme = filterTheme(darkTheme);
  const filteredLightTheme = filterTheme(lightTheme);
  const numResults = filteredLightTheme.length;

  return (
    <Fragment>
      <div css={searchWrapperStyles}>
        <div css={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            name="token-search"
            aria-label="tokens search"
            placeholder="Search for tokens"
            isMonospaced={true}
            elemBeforeInput={
              <div css={{ margin: `0px ${gridSize()}px` }}>
                <SearchIcon size="small" label="" />
              </div>
            }
            elemAfterInput={
              <div css={{ margin: `0px ${gridSize() * 2}px`, display: 'flex' }}>
                <Lozenge appearance={numResults ? 'default' : 'removed'}>
                  {numResults} results
                </Lozenge>
              </div>
            }
            onChange={(e) => {
              setSearchQuery((e.target as HTMLInputElement).value);
            }}
          />
        </div>
        <div css={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
          <label htmlFor="toggle-deprecated">Show deprecated tokens</label>
          <Toggle
            id="toggle-deprecated"
            onChange={() => setShowDeprecated((prev) => !prev)}
            isChecked={showDeprecated}
          />
          <label
            htmlFor="toggle-deleted"
            css={{ marginLeft: `${gridSize() * 2}px` }}
          >
            Show deleted tokens
          </label>
          <Toggle
            id="toggle-deleted"
            onChange={() => setShowDeleted((prev) => !prev)}
            isChecked={showDeleted}
          />
        </div>
      </div>

      <Tabs id="default">
        <TabList>
          <Tab>Atlassian Light Theme</Tab>
          <Tab>Atlassian Dark Theme</Tab>
        </TabList>
        <TabPanel>
          <TokenList
            list={(filteredLightTheme as Token[]).sort(sortByStatus)}
          />
        </TabPanel>
        <TabPanel>
          <TokenList list={(filteredDarkTheme as Token[]).sort(sortByStatus)} />
        </TabPanel>
      </Tabs>
    </Fragment>
  );
};

export default md`
    ${(
      <SectionMessage title="Documentation is based on latest version of @atlaskit/tokens">
        <p>
          Tokens in the list below are documented as they appear in the latest
          version of the tokens package.
        </p>
        <p>
          If you are an older version of the token package, see the
          @atlaskit/tokens changelog to see what's changed.
        </p>
      </SectionMessage>
    )}

    Design Tokens in the Atlassian Design System are subject to change,
    and can be deprecated or deleted over time in major version updates.
    The tokens listed below are labelled based on one of the following
    three states:

    ${(
      <ul>
        <li>
          <Lozenge appearance={getAppearance('active')}>active</Lozenge> tokens
          are the up-to-date tokens you should be using when building with the
          Atlassian Design System.
        </li>
        <li>
          <Lozenge appearance={getAppearance('deprecated')}>deprecated</Lozenge>{' '}
          tokens are still present in the most recent version of{' '}
          <Code>@atlaskit/tokens</Code> but will raise linting errors, and will
          be removed in the next major version. If there is a replacement token,
          the tokens linting rule will provide the option to 'fix' the usage and
          insert the recommended replacement token.
        </li>
        <li>
          <Lozenge appearance={getAppearance('deleted')}>deleted</Lozenge>{' '}
          tokens existed in previous versions of <Code>@atlaskit/tokens</Code>,
          but were deprecated and then deleted over two major versions. These
          tokens are documented here for reference only, and should not be used.
        </li>
      </ul>
    )}

    **Note on color hex values:** Tokens use a new version of the Atlassian color palette
    that's currently a work in progress. As a result, color values will not match those imported from
    \`@atlaskit/theme/colors\`. When using tokens, focus on choosing a token with the
    right **purpose** rather than an exact color match

    ## Atlassian Design Tokens

  ${(<TokenExplorer />)}
`;
