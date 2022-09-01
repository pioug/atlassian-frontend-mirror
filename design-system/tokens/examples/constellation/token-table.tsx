/** @jsx jsx */
import React, { useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Avatar from '@atlaskit/avatar';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import DynamicTable from '@atlaskit/dynamic-table';
import { N50A, N60A } from '@atlaskit/theme/colors';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { Example } from '../../../../../services/website-constellation/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/example/Example';
import token from '../../src/get-token';

const TokensTagCodeBlock = `
import { N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// left and right shadow styles
boxShadow: token(
  'elevation.shadow.overflow',
  \`2px 0px 8px \${N50A}, 1px 0px 0px \${N60A}\`,
),
`;

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'name',
        content: 'Name',
        isSortable: true,
        width: withWidth ? 25 : undefined,
      },
      {
        key: 'party',
        content: 'Party',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'term',
        content: 'Term',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 10 : undefined,
      },
      {
        key: 'content',
        content: 'ID',
        shouldTruncate: true,
      },
      {
        key: 'more',
        shouldTruncate: true,
      },
    ],
  };
};

export const head = createHead(true);

const presidents = [
  {
    id: 1,
    name: 'George Washington',
    party: 'None, Federalist',
    term: '1789-1797',
  },
  {
    id: 2,
    name: 'John Adams',
    party: 'Federalist',
    term: '1797-1801',
  },
];

const nameWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
});

const avatarWrapperStyles = css({
  marginRight: '8px',
});

interface President {
  id: number;
  name: string;
  party: string;
  term: string;
}

export const rows = presidents.map((president: President, index: number) => ({
  key: `row-${index}-${president.name}`,
  isHighlighted: false,
  cells: [
    {
      key: president.name,
      content: (
        <span css={nameWrapperStyles}>
          <div css={avatarWrapperStyles}>
            <Avatar name={president.name} size="medium" />
          </div>
          {president.name}
        </span>
      ),
    },
    {
      key: president.party,
      content: president.party,
    },
    {
      key: president.id,
      content: president.term,
    },
    {
      key: 'Lorem',
      content: president.id,
    },
    {
      key: 'MoreDropdown',
      content: (
        <DropdownMenu trigger="More">
          <DropdownItemGroup>
            <DropdownItem>{president.name}</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
      ),
    },
  ],
}));

const wrapperStyles = css({
  position: 'relative',
  overflow: 'hidden',
  table: {
    width: '1000px',
  },
});

const overflowStyles = css({
  overflowX: 'auto',
});

const shadowStyles = css({
  width: '10px',
  position: 'absolute',
  top: '-10px',
  bottom: '-10px',
  boxShadow: token(
    'elevation.shadow.overflow',
    `2px 0px 8px ${N50A}, 1px 0px 0px ${N60A}`,
  ),
});

const rightShadowStyles = css({
  right: ' -10px',
});

const leftShadowStyles = css({
  left: ' -10px',
});

const TokensTable = () => {
  const [shadowLeft, setShadowLeft] = useState(false);
  const [shadowRight, setShadowRight] = useState(false);

  const ref: any = React.createRef();

  const checkShadow = () => {
    if (!ref.current) {
      return;
    }
    if (ref.current.scrollLeft > 0) {
      setShadowLeft(true);
    } else {
      setShadowLeft(false);
    }

    if (
      ref.current.scrollLeft >=
      Math.floor(
        ref.current.scrollWidth - ref.current.getBoundingClientRect().width,
      )
    ) {
      setShadowRight(false);
    } else {
      setShadowRight(true);
    }
  };

  useEffect(() => {
    checkShadow();
  });

  return (
    <div css={wrapperStyles}>
      <div css={overflowStyles} onScroll={checkShadow} ref={ref}>
        <DynamicTable head={head} rows={rows} />
        {shadowLeft && <div css={[shadowStyles, leftShadowStyles]}></div>}
        {shadowRight && <div css={[shadowStyles, rightShadowStyles]}></div>}
      </div>
    </div>
  );
};

const TokensTableExample = () => {
  return (
    <Example
      Component={TokensTable}
      source={TokensTagCodeBlock}
      packageName="@atlaskit/tokens"
    />
  );
};

export default TokensTableExample;
