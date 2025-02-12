/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import Spinner from '@atlaskit/spinner';

import { MinHeightContainer } from '../../common/ui/min-height-container';

import { LoaderFallbackOld } from './old';

const styles = css({
	alignItems: 'center',
});

export type LoaderFallbackProps = {
	url?: string;
	hideDisplayText?: boolean;
	isLoadingPlugins?: boolean;
	plugins?: unknown[];
	name?: string;
};

const LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_TABS_WITHOUT_DISPLAYTEXT = '472px';
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_TABS_WITH_DISPLAYTEXT = '550px';
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_PLUGIN_WITH_DISPLAYTEXT = '505px';
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_PLUGIN_WITHOUT_DISPLAYTEXT = '429px';
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_DISPLAYTEXT = '218px';
const LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITHOUT_DISPLAYTEXT = '141px';

const getEstimatedMinHeight = ({
	hideDisplayText,
	isLoadingPlugins,
	plugins,
	url,
}: LoaderFallbackProps) => {
	/**
	 * "Insert mode" (search results shown initially)
	 */
	if (!url) {
		/**
		 * With tabs
		 */
		if ((plugins && plugins.length > 1) || isLoadingPlugins) {
			return hideDisplayText
				? LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_TABS_WITHOUT_DISPLAYTEXT
				: LINK_PICKER_MIN_HEIGHT_IN_PX_WITH_TABS_WITH_DISPLAYTEXT;
		}

		/**
		 * Without tabs
		 */
		if (plugins?.length === 1) {
			return hideDisplayText
				? LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_PLUGIN_WITHOUT_DISPLAYTEXT
				: LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_PLUGIN_WITH_DISPLAYTEXT;
		}
	}

	return hideDisplayText
		? LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITHOUT_DISPLAYTEXT
		: LINK_PICKER_MIN_HEIGHT_IN_PX_WITHOUT_TABS_WITH_DISPLAYTEXT;
};

/**
 * Loader / skeleton for the Link Picker. Takes LoaderFallbackProps (hideDisplayText, isLoadingPlugins, plugins)
 * to determine the height to prevent jumps in height when loading
 */
export const LoaderFallbackNew = (props: LoaderFallbackProps): JSX.Element => {
	const minHeight = getEstimatedMinHeight(props);
	return (
		<MinHeightContainer
			minHeight={minHeight}
			data-testid="link-picker-root-loader-boundary-ui"
			css={styles}
		>
			<Spinner
				testId="link-picker.component-loading-indicator"
				interactionName={props.name || 'link-picker-loading'}
				size="medium"
			/>
		</MinHeightContainer>
	);
};

export const LoaderFallback = (props: LoaderFallbackProps) => {
	if (fg('platform_bandicoots-link-picker-css')) {
		return <LoaderFallbackNew {...props} />;
	}
	return <LoaderFallbackOld {...props} />;
};
