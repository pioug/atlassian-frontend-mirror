import React, { memo } from 'react';

// TODO: Using HipChat icons as the standard icon set is missing large
// versions of `chevron-up` and `chevron-down`, despite already including
// `chevron-left-large` and `chevron-right-large`...
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/core/chevron-up';

/**
 * __Expand icon__
 *
 * An icon used to display the expanded state in an `<ExpandableCell>`.
 */
export const ExpandIcon: React.MemoExoticComponent<
	({ isExpanded }: { isExpanded: boolean }) => React.JSX.Element
> = memo(({ isExpanded }: { isExpanded: boolean }): React.JSX.Element => {
	switch (isExpanded) {
		case true:
			return <ChevronUpIcon color="currentColor" label="" size="small" />;
		case false:
			return <ChevronDownIcon color="currentColor" label="" size="small" />;
	}
});
