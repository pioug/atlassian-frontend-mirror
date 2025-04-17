/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

// TODO: Using HipChat icons as the standard icon set is missing large
// versions of `chevron-up` and `chevron-down`, despite already including
// `chevron-left-large` and `chevron-right-large`...
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down--hipchat-chevron-down';
import ChevronUpIcon from '@atlaskit/icon/utility/migration/chevron-up--hipchat-chevron-up';

/**
 * __Expand icon__
 *
 * An icon used to display the expanded state in an `<ExpandableCell>`.
 */
export const ExpandIcon = memo(({ isExpanded }: { isExpanded: boolean }) => {
	switch (isExpanded) {
		case true:
			return (
				<ChevronUpIcon
					color="currentColor"
					LEGACY_size="small"
					label=""
					LEGACY_primaryColor="inherit"
				/>
			);
		case false:
			return (
				<ChevronDownIcon
					color="currentColor"
					LEGACY_size="small"
					label=""
					LEGACY_primaryColor="inherit"
				/>
			);
	}
});
