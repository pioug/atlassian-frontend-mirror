import React from 'react';

import Tooltip from '@atlaskit/tooltip';

import { TooltipContent } from '../../../common/styled';
import { useIntl, useIsSearching, useStoreActions } from '../../../state';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { TooltipTag } from '../../tooltip-tag';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { BaseSearch } from '../base-search';

import { messages } from './messages';

export const Search = () => {
  const [intl] = useIntl();
  const [, { onSearch }] = useStoreActions();
  const label = intl.formatMessage(messages.searchLabel);
  const [isSearching] = useIsSearching();
  return (
    <Tooltip
      position={'bottom'}
      content={<TooltipContent>{label}</TooltipContent>}
      tag={TooltipTag}
    >
      <BaseSearch label={label} onSearch={onSearch} isSearching={isSearching} />
    </Tooltip>
  );
};
