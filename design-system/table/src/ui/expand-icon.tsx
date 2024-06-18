/* eslint-disable no-unused-vars */
/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

// TODO: Using HipChat icons as the standard icon set is missing large
// versions of `chevron-up` and `chevron-down`, despite already including
// `chevron-left-large` and `chevron-right-large`...
import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';

/**
 * __Expand icon__
 *
 * An icon used to display the expanded state in an `<ExpandableCell>`.
 */
export const ExpandIcon = memo(({ isExpanded }: { isExpanded: boolean }) => {
	switch (isExpanded) {
		case true:
			return <ChevronUpIcon size="small" label="" primaryColor="inherit" />;
		case false:
			return <ChevronDownIcon size="small" label="" primaryColor="inherit" />;
	}
});
