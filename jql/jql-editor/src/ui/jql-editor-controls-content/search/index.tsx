import React from 'react';

import Tooltip from '@atlaskit/tooltip/Tooltip';

import { TooltipContent } from '../../../common/styled';
import { useIntl, useIsSearching, useStoreActions } from '../../../state';
import { TooltipTag } from '../../tooltip-tag';
import { BaseSearch } from '../base-search';
import { messages } from './messages';

export const Search = (): React.JSX.Element => {
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
