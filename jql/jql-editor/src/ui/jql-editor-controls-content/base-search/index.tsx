import React, { type CSSProperties, useCallback } from 'react';

import { LoadingButton } from '@atlaskit/button';
import SearchIcon from '@atlaskit/icon/glyph/editor/search';

const style: CSSProperties = {
  // Fixes an issue where loading button makes the editor flicker with a scrollbar
  overflow: 'hidden',
};

type Props = {
  isDisabled?: boolean;
  isSearching?: boolean;
  label: string;
  onSearch: () => void;
};

export const BaseSearch = ({
  isDisabled,
  isSearching,
  label,
  onSearch,
}: Props) => {
  // Prevent click events being repeatedly fired if the Enter key is held down.
  const preventRepeatClick = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.repeat) {
      e.preventDefault();
    }
  }, []);

  return (
    <LoadingButton
      aria-label={label}
      isDisabled={isDisabled}
      testId="jql-editor-search"
      style={style}
      appearance={'primary'}
      spacing={'none'}
      onClick={onSearch}
      onKeyDown={preventRepeatClick}
      isLoading={isSearching}
      iconBefore={<SearchIcon label={''} size={'medium'} />}
    />
  );
};
