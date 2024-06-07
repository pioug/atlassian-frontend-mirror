/** @jsx jsx */
import { jsx } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import Spinner from '@atlaskit/spinner';

import { MinHeightContainer } from '../../common/ui/min-height-container';

import { styles } from './styled';

export type LoaderFallbackProps = {
	hideDisplayText?: boolean;
	isLoadingPlugins?: boolean;
	plugins?: unknown[];
};

const LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_TABS_WITHOUT_DISPLAYTEXT = '472px';
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_TABS_WITH_DISPLAYTEXT = '550px';
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_PLUGIN_WITH_DISPLAYTEXT = '505px';
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_PLUGIN_WITHOUT_DISPLAYTEXT = '429px';
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_DISPLAYTEXT = '218px';
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITHOUT_DISPLAYTEXT = '141px';
// EDM-7122: can delete these two consts once min height container for link picker is firm for the loader
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_DISPLAYTEXT = '142px';
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_DISPLAYTEXT = '220px';

const getEstimatedMinHeight = ({
	hideDisplayText,
	isLoadingPlugins,
	plugins,
}: LoaderFallbackProps) => {
	if (getBooleanFF('platform.linking-platform.link-picker.fixed-height-search-results')) {
		if ((plugins && plugins.length > 1) || isLoadingPlugins) {
			return hideDisplayText
				? LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_TABS_WITHOUT_DISPLAYTEXT
				: LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_TABS_WITH_DISPLAYTEXT;
		}
		if (plugins?.length === 1) {
			return hideDisplayText
				? LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_PLUGIN_WITHOUT_DISPLAYTEXT
				: LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_PLUGIN_WITH_DISPLAYTEXT;
		}
		return hideDisplayText
			? LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITHOUT_DISPLAYTEXT
			: LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_DISPLAYTEXT;
	}
	return hideDisplayText
		? LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_DISPLAYTEXT
		: LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_DISPLAYTEXT;
};

/**
 * Loader / skeleton for the Link Picker. Takes LoaderFallbackProps (hideDisplayText, isLoadingPlugins, plugins)
 * to determine the height to prevent jumps in height when loading
 */
export const LoaderFallback = (props: LoaderFallbackProps) => {
	const minHeight = getEstimatedMinHeight(props);
	return (
		<MinHeightContainer
			minHeight={minHeight}
			data-testid="link-picker-root-loader-boundary-ui"
			css={styles}
		>
			<Spinner testId="link-picker.component-loading-indicator" size="medium" />
		</MinHeightContainer>
	);
};
