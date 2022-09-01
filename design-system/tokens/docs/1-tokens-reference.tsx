/** @jsx jsx */
import { Fragment, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { Code } from '@atlaskit/code';
import { md } from '@atlaskit/docs';
import InfoIcon from '@atlaskit/icon/glyph/info';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import SearchIcon from '@atlaskit/icon/glyph/search';
import Lozenge from '@atlaskit/lozenge';
import SectionMessage from '@atlaskit/section-message';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import TextField from '@atlaskit/textfield';
import { N200, N40A, N50A } from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import Toggle from '@atlaskit/toggle';

import { token } from '../src';
import darkTheme from '../src/artifacts/tokens-raw/atlassian-dark';
import lightTheme from '../src/artifacts/tokens-raw/atlassian-light';

import TokenWizardModal from './token-wizard';
import { cleanTokenName, getBoxShadow, getTextContrast } from './utils';

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

const dividerStyles = css({
  marginTop: `${gridSize() * 1.5}px`,
  marginBottom: `${gridSize() * 1.5}px`,
  border: 'none',
  borderTop: `2px solid ${token('color.border', '#ebecf0')}`,
});

const listStyles = css({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  li: {
    margin: 0,
    padding: 0,
  },
});

const tokenStyles = css({
  display: 'grid',
  marginBottom: `${gridSize()}px`,
  padding: '10px',
  gridGap: '10px',
  gridTemplateColumns: 'repeat(6, 1fr)',
  border: `1px solid ${token('color.border', '#eaeaea')}`,
  borderRadius: borderRadius(),
});

const tokenNameStyles = css({
  gridColumnStart: 'span 4',
});

const tokenValueStyles = css({
  minWidth: '180px',
  padding: '5px',
  gridColumnStart: 'span 2',
  border: `1px solid ${token('color.border', '#eaeaea')}`,
  borderRadius: borderRadius(),
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
  margin: `${gridSize() * 2}px 0px`,
  padding: 8,
  position: 'sticky',
  zIndex: 1,
  top: 54,
  flexDirection: 'column',
  backgroundColor: token('elevation.surface.raised', 'white'),
  border: `1px solid ${token('color.border', '#eaeaea')}`,
  borderRadius: borderRadius(),
  boxShadow: token(
    'elevation.shadow.raised',
    `0 1px 1px ${N50A}, 0 0 1px 1px ${N40A}`,
  ),
  '@media (min-width: 1241px)': {
    top: 0,
  },
});

const tokenDescriptionStyles = css({
  margin: 0,
  gridColumnStart: 'span 6',
  gridRowStart: '2',
});

const tokenMetaDataStyles = css({
  display: 'flex',
  alignItems: 'center',
  gridColumn: '1/7',
  color: token('color.text.subtlest', N200),
});

interface Token {
  value: string;
  name: string;
  attributes: {
    group: string;
    description?: string;
    state?: string;
    introduced?: string;
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
                // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
                backgroundColor: 'white',
                // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
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
      {attributes.replacement && (
        <p css={tokenMetaDataStyles}>
          <RefreshIcon label="" />
          <span css={{ margin: '0 4px' }}>Replace with </span>
          <Code>{cleanTokenName(attributes.replacement)}</Code>
        </p>
      )}
      {!attributes.replacement && (
        <p css={tokenMetaDataStyles}>
          <InfoIcon label="" size="small" />
          <span css={{ margin: '0 4px' }}>Introduced in </span>
          <Code>v{attributes.introduced}</Code>
        </p>
      )}
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
          <Code>@atlaskit/tokens</Code> changelog to see what's changed.
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

    ${(<hr css={dividerStyles} />)}

    #### Note on color names and hex values
    Tokens use a new version of the Atlassian color palette
    that's currently a work in progress. As a result, color values will not match those imported from
    \`@atlaskit/theme/colors\`. When using tokens, focus on choosing a token with the
    right **purpose** rather than an exact color match.

    ####

    ${(<TokenWizardModal />)}

    ## Atlassian Design Tokens</h2>

  ${(<TokenExplorer />)}
`;
