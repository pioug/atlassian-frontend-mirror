/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type FC, useCallback, useEffect, useState } from 'react';

import { css } from '@compiled/react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import { cssMap, jsx } from '@atlaskit/css';
import noop from '@atlaskit/ds-lib/noop';
import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { DEFAULT_APPEARANCE } from './constants';
import Actions from './flag-actions';
import { useFlagGroup } from './flag-group';
import { DismissButton, Expander } from './internal';
import {
	flagBackgroundColor,
	flagIconColor,
	flagIconGlyph,
	flagTextColor,
	flagTextColorToken,
} from './theme';
import type { FlagProps } from './types';

const styles = cssMap({
	// For cases where a single word is longer than the container (e.g. filenames)
	overflowWrap: {
		overflowWrap: 'anywhere',
	},
	flag: {
		boxShadow: token('elevation.shadow.overlay', '0px 8px 12px #091e423f, 0px 0px 1px #091e424f'),
		borderRadius: token('radius.small', '3px'),
		overflow: 'hidden',
		zIndex: 600,
		width: '100%',
		transition: 'background-color 200ms',
	},
});

const CSS_VAR_ICON_COLOR = '--flag-icon-color';

const oldDescriptionStyles = css({
	maxHeight: 100, // height is defined as 5 lines maximum by design
	overflow: 'auto',
	overflowWrap: 'anywhere', // For cases where a single word is longer than the container (e.g. filenames)
});

const descriptionStyles = css({
	maxHeight: 100, // height is defined as 5 lines maximum by design
	font: token('font.body'),
	overflow: 'auto',
	overflowWrap: 'anywhere', // For cases where a single word is longer than the container (e.g. filenames)
});

const iconWrapperStyles = css({
	display: 'flex',
	minWidth: '24px',
	minHeight: '24px',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	color: `var(${CSS_VAR_ICON_COLOR})`,
});

const flagWrapperStyles = css({
	width: '100%',
});

const analyticsAttributes = {
	componentName: 'flag',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const transitionStyles = css({
	flexGrow: 1,
	transition: `gap 0.3s`,
});

/**
 * __Flag__
 *
 * A flag is used for confirmations, alerts, and acknowledgments that require minimal user interaction,
 * often displayed using a flag group.
 *
 * - [Examples](https://atlassian.design/components/flag/examples)
 * - [Code](https://atlassian.design/components/flag/code)
 * - [Usage](https://atlassian.design/components/flag/usage)
 */
const Flag: FC<FlagProps> = (props) => {
	const {
		actions = [],
		appearance = DEFAULT_APPEARANCE,
		icon,
		title,
		description,
		linkComponent,
		onMouseOver,
		onFocus = noop,
		onMouseOut,
		onBlur = noop,
		onDismissed: onDismissedProp = noop,
		testId,
		id,
		analyticsContext,
		delayAnnouncement,
		headingLevel = 2,
	} = props;

	const [isDelayToAnnounce, setIsDelayToAnnounce] = useState(false);

	const { onDismissed: onDismissedFromFlagGroup, isDismissAllowed } = useFlagGroup();

	const onDismissed = useCallback(
		(id: string | number, analyticsEvent: UIAnalyticsEvent) => {
			onDismissedProp(id, analyticsEvent);
			onDismissedFromFlagGroup(id, analyticsEvent);
		},
		[onDismissedProp, onDismissedFromFlagGroup],
	);

	const [isExpanded, setIsExpanded] = useState(false);

	const onDismissedAnalytics = usePlatformLeafEventHandler({
		fn: onDismissed,
		action: 'dismissed',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});

	const isBold = appearance !== DEFAULT_APPEARANCE;

	const toggleExpand = useCallback(() => {
		setIsExpanded((previous) => !previous);
	}, []);

	const buttonActionCallback = useCallback(() => {
		if (isDismissAllowed) {
			onDismissedAnalytics(id);
		}
	}, [onDismissedAnalytics, id, isDismissAllowed]);

	useEffect(() => {
		// If buttons are removed as a prop, update isExpanded to be false
		if (isBold && isExpanded && !description && !actions.length) {
			setIsExpanded(false);
		}
	}, [actions.length, description, isBold, isExpanded]);

	useEffect(() => {
		if (!delayAnnouncement) {
			return;
		}
		setTimeout(() => {
			setIsDelayToAnnounce(true);
		}, delayAnnouncement);
	}, [delayAnnouncement]);

	const onFocusAnalytics = usePlatformLeafEventHandler({
		fn: onFocus,
		action: 'focused',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});

	const onBlurAnalytics = usePlatformLeafEventHandler({
		fn: onBlur,
		action: 'blurred',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});

	const autoDismissProps = {
		onMouseOver,
		onFocus: onFocusAnalytics,
		onMouseOut,
		onBlur: onBlurAnalytics,
	};

	const textColor = flagTextColor[appearance];
	const iconColor = flagIconColor[appearance];
	const iconGlyph = flagIconGlyph[appearance];
	const isDismissable = isBold || isDismissAllowed;
	const shouldRenderGap = (!isBold && (description || actions.length)) || isExpanded;
	// when delayAnnouncement is available we will use a hidden content for announcement
	const delayedAnnouncement = delayAnnouncement ? (
		<VisuallyHidden>
			{title}
			{description}
		</VisuallyHidden>
	) : undefined;

	return (
		<div role="alert" css={flagWrapperStyles} data-testid={testId} {...autoDismissProps}>
			<Box padding="space.200" backgroundColor={flagBackgroundColor[appearance]} xcss={styles.flag}>
				<Inline alignBlock="start" space="space.200">
					<div
						css={iconWrapperStyles}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ [CSS_VAR_ICON_COLOR]: iconColor } as CSSProperties}
						data-testid={testId && `${testId}-icon-container`}
					>
						{icon || iconGlyph}
					</div>
					<span css={transitionStyles}>
						<Stack
							space={shouldRenderGap ? 'space.100' : 'space.0'} // Gap exists even when not expanded due to Expander internals always being in the DOM
						>
							{/* if isDelayToAnnounce is true, we will use the hidden content for screen reader to announce */}
							{isDelayToAnnounce && delayedAnnouncement}
							<Inline alignBlock="stretch" space="space.100" spread="space-between">
								<Box
									paddingBlockStart="space.050"
									paddingBlockEnd="space.025"
									xcss={styles.overflowWrap}
								>
									<Heading as={`h${headingLevel}`} size="xsmall" color={textColor}>
										<span
											/* if isDelayToAnnounce is true, we will hide the content form screen reader to avoid duplicate announcement */
											aria-hidden={isDelayToAnnounce}
										>
											{title}
										</span>
									</Heading>
								</Box>
								{isDismissable
									? !(isBold && !description && !actions.length) && (
											<DismissButton
												testId={testId}
												appearance={appearance}
												isBold={isBold}
												isExpanded={isExpanded}
												onClick={isBold ? toggleExpand : buttonActionCallback}
											/>
										)
									: null}
							</Inline>
							{/* Normal appearance can't be expanded so isExpanded is always true */}
							<Expander isExpanded={!isBold || isExpanded} testId={testId}>
								{description && (
									<div
										// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
										style={{ color: flagTextColorToken[appearance] }}
										css={[
											fg('platform_ads_explicit_font_styles')
												? descriptionStyles
												: oldDescriptionStyles,
										]}
										data-testid={testId && `${testId}-description`}
										/* if isDelayToAnnounce is true, we will hide the content form screen reader to avoid duplicate announcement */
										aria-hidden={isDelayToAnnounce}
									>
										{description}
									</div>
								)}
								<Actions
									actions={actions}
									appearance={appearance}
									linkComponent={linkComponent}
									testId={testId}
								/>
							</Expander>
						</Stack>
					</span>
				</Inline>
			</Box>
		</div>
	);
};

export default Flag;
