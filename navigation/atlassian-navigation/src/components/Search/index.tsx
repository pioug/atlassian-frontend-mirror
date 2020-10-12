/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/core';

import SearchIcon from '@atlaskit/icon/glyph/search';

import { useTheme } from '../../theme';
import { IconButton } from '../IconButton';

import {
  searchIconCSS,
  searchInputContainerCSS,
  searchInputCSS,
  searchInputIconCSS,
} from './styles';
import { SearchProps } from './types';

type SearchComponentProps = {
  onClick: SearchProps['onClick'];
  placeholder: SearchProps['placeholder'];
  label: SearchProps['label'];
};

const SearchComponent = (props: SearchComponentProps) => {
  const { onClick, placeholder, label } = props;
  const theme = useTheme();

  const onChange = (...args: any[]) => {
    // @ts-ignore
    onClick && onClick(...args);
  };

  const onInputClick = (...args: any[]) => {
    // @ts-ignore
    onClick && onClick(...args);
  };

  return (
    <div css={searchInputContainerCSS} role="search">
      <div css={searchInputIconCSS}>
        <SearchIcon label="" />
      </div>
      <input
        css={searchInputCSS(theme)}
        aria-label={label}
        placeholder={placeholder}
        onChange={onChange}
        onClick={onInputClick}
        value=""
      />
    </div>
  );
};

export const Search = (props: SearchProps) => {
  const { placeholder, tooltip, label, ...iconButtonProps } = props;

  return (
    <Fragment>
      <SearchComponent
        onClick={iconButtonProps.onClick}
        placeholder={placeholder}
        label={label}
      />
      <IconButton
        css={searchIconCSS}
        icon={<SearchIcon label={label} />}
        tooltip={tooltip}
        {...iconButtonProps}
      />
    </Fragment>
  );
};

export default Search;
