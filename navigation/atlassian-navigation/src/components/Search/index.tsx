/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import SearchIcon from '@atlaskit/icon/glyph/search';

import {
  CREATE_BREAKPOINT,
  fontSize,
  gridSize,
  varSearchBackgroundColor,
  varSearchBorderColor,
  varSearchColor,
  varSearchFocusBorderColor,
  varSearchHoverBackgroundColor,
} from '../../common/constants';
import { useTheme } from '../../theme';
import { IconButton } from '../IconButton';

import { SearchProps } from './types';

const searchInputContainerStyles = css({
  marginRight: gridSize,
  marginLeft: 20,
  position: 'relative',
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
    display: 'none !important',
  },
});

const searchInputIconStyles = css({
  width: '20px',
  height: '20px',
  position: 'absolute',
  top: '5px',
  left: '10px',
  pointerEvents: 'none',
});

const searchInputStyles = css({
  boxSizing: 'border-box',
  width: '220px',
  height: `${gridSize * 4}px`,
  padding: `0 ${gridSize}px 0 40px`,
  backgroundColor: `var(${varSearchBackgroundColor})`,
  border: '2px solid',
  borderColor: `var(${varSearchBorderColor})`,
  borderRadius: 6,
  color: `var(${varSearchColor})`,
  fontSize: `${fontSize}px`,
  outline: 'none',
  '::placeholder': {
    color: 'inherit',
  },
  '&:focus': {
    borderColor: `var(${varSearchFocusBorderColor})`,
  },
  '&:hover': {
    backgroundColor: `var(${varSearchHoverBackgroundColor})`,
  },
});

const searchIconStyles = css({
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [`@media (min-width: ${CREATE_BREAKPOINT}px)`]: {
    display: 'none !important',
  },
});

type SearchComponentProps = {
  onClick: SearchProps['onClick'];
  placeholder: SearchProps['placeholder'];
  label: SearchProps['label'];
  value: SearchProps['value'];
};

const SearchComponent = (props: SearchComponentProps) => {
  const { onClick, placeholder, label, value } = props;
  const theme = useTheme();
  const search = theme.mode.search;

  const onChange = (...args: any[]) => {
    // @ts-ignore
    onClick && onClick(...args);
  };

  const onInputClick = (...args: any[]) => {
    // @ts-ignore
    onClick && onClick(...args);
  };

  const searchInputDynamicStyles = {
    [varSearchBackgroundColor]: search.default.backgroundColor,
    [varSearchColor]: search.default.color,
    [varSearchBorderColor]: search.default.borderColor,
    [varSearchFocusBorderColor]: search.focus.borderColor,
    [varSearchHoverBackgroundColor]: search.hover.backgroundColor,
  };

  return (
    <div css={searchInputContainerStyles} role="search">
      <div css={searchInputIconStyles}>
        <SearchIcon label="" />
      </div>
      <input
        style={searchInputDynamicStyles as React.CSSProperties}
        css={searchInputStyles}
        aria-label={label}
        placeholder={placeholder}
        onChange={onChange}
        onClick={onInputClick}
        value={value}
      />
    </div>
  );
};

/**
 * __Search__
 *
 * A search input that can be passed into `AtlassianNavigation`'s `renderSearch` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#search)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const Search = (props: SearchProps) => {
  const { placeholder, tooltip, label, value, ...iconButtonProps } = props;

  return (
    <Fragment>
      <SearchComponent
        onClick={iconButtonProps.onClick}
        placeholder={placeholder}
        label={label}
        value={value || ''}
      />
      <IconButton
        // @ts-ignore Overriding styles is not supported.
        css={searchIconStyles}
        icon={<SearchIcon label={label} />}
        tooltip={tooltip}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...iconButtonProps}
      />
    </Fragment>
  );
};

export default Search;
