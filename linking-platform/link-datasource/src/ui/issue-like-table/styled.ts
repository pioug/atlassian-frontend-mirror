import styled from '@emotion/styled';

import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const ScrollableContainerHeight = 590;

export const FieldTextFontSize = '14px';

export const Table = styled.table`
  width: 100%;
`;

const lineHeight = token('font.lineHeight.300', '24px');
const verticalPadding = token('space.025', '2px');

/**
 * This is a hack used to override styles that are leaking to our table html element
 * from editor table plugin.
 * This css prefix can be used in front of our main css rule to make its weight bigger
 * and force make browser use it first and editor plugin css second.
 */
export const withTablePluginPrefix = (
  tableSection: 'thead' | 'tbody' | '',
  mainRule: string = '&',
) => `
  .pm-table-wrapper > table ${tableSection} ${mainRule},
  .ProseMirror .pm-table-wrapper > table ${tableSection} ${mainRule},
  ${mainRule}
`;
export const withTablePluginHeaderPrefix = withTablePluginPrefix.bind(
  null,
  'thead',
);
export const withTablePluginBodyPrefix = withTablePluginPrefix.bind(
  null,
  'tbody',
);

export const TableHeading = styled.th`
  ${withTablePluginHeaderPrefix()} {
    border: 0;
    position: relative;

    /* This makes resizing work with out jumping due to padding + changes overall width for same default values. */
    box-sizing: border-box;

    line-height: ${lineHeight};
    padding: ${verticalPadding} ${token('space.050', '4px')};
    border-right: 0.5px solid ${token('color.border', N40)};
    border-bottom: 2px solid ${token('color.border', N40)};

    /*
      lineHeight * 2 -> Max height of two lined header
      verticalPadding * 2 -> padding for this component itself
      verticalPadding * 2 -> padding inside span (--container)
      2px -> Bottom border
      Last two terms are needed because of border-box box sizing.
    */
    height: calc(${lineHeight} * 2 + ${verticalPadding} * 4 + 2px);
    vertical-align: bottom;
    background-color: ${token('utility.elevation.surface.current', '#FFF')};
  }

  ${withTablePluginPrefix(
    '',
    'thead.has-column-picker &:nth-last-of-type(2)',
  )} {
    border-right: 0;
  }

  ${withTablePluginHeaderPrefix('&:first-child')} {
    padding-left: ${token('space.050', '4px')};
  }

  ${withTablePluginHeaderPrefix('&:last-child')} {
    border-right: 0;
  }

  & [data-testid='datasource-header-content--container'] {
    width: 100%;
    padding: ${verticalPadding} ${token('space.050', '4px')};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    overflow: hidden;
    word-wrap: break-word;

    &:hover {
      background: ${token('color.background.input.hovered', '#F7F8F9')};
      border-radius: 3px;
    }
  }
`;
