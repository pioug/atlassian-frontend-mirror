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
  value: SearchProps['value'];
};

const SearchComponent = (props: SearchComponentProps) => {
  const { onClick, placeholder, label, value } = props;
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
        value={value}
      />
    </div>
  );
};

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
        css={searchIconCSS}
        icon={<SearchIcon label={label} />}
        tooltip={tooltip}
        {...iconButtonProps}
      />
    </Fragment>
  );
};

export default Search;
