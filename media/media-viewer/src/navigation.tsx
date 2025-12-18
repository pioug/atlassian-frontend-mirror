/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { Component } from 'react';
import { type Identifier } from '@atlaskit/media-client';
import ArrowLeftCircleIcon from '@atlaskit/icon/core/chevron-left';
import ArrowRightCircleIcon from '@atlaskit/icon/core/chevron-right';
import { hideControlsClassName } from '@atlaskit/media-ui';
import { Shortcut } from '@atlaskit/media-ui';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { ArrowsWrapper, RightWrapper, LeftWrapper, Arrow } from './styleWrappers';
import { getSelectedIndex } from './utils';
import { createNavigatedEvent } from './analytics/events/ui/navigated';
import { fireAnalytics } from './analytics';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Pressable, xcss } from '@atlaskit/primitives';
import { type NewCoreIconProps } from '@atlaskit/icon';

export type NavigationDirection = 'prev' | 'next';

export type NavigationProps = Readonly<{
	items: Identifier[];
	selectedItem: Identifier;
	onChange: (item: Identifier) => void;
	isArchiveSideBarVisible?: boolean;
}> &
	WithAnalyticsEventsProps;

export const nextNavButtonId = 'media-viewer-navigation-next';
export const prevNavButtonId = 'media-viewer-navigation-prev';

export type NavigationSource = 'keyboard' | 'mouse';

const wrapperStyles = xcss({
	width: '40px',
	height: '40px',
	borderRadius: 'radius.full',
	padding: 'space.0',
	// @ts-ignore
	backgroundColor: '#9FADBC',
	// @ts-ignore
	color: '#161A1D',
	boxSizing: 'border-box',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',

	':hover': {
		// @ts-ignore
		backgroundColor: '#B6C2CF',
	},
});

const iconRightStyles = xcss({
	marginRight: 'space.100',
});

const iconLeftStyles = xcss({
	marginLeft: 'space.100',
});

type IconProps = {
	label: string;
	clickHandler: (source: NavigationSource) => () => void;
	testId: string;
};

const withIconWrapper = (Component: React.ComponentType<NewCoreIconProps>) => {
	return ({ label, clickHandler, testId }: IconProps) => (
		<Pressable
			xcss={[wrapperStyles, label === 'Next' ? iconRightStyles : iconLeftStyles]}
			onClick={clickHandler('mouse')}
			testId={testId}
		>
			<Component
				label={label}
				LEGACY_size="xlarge"
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
				LEGACY_primaryColor="#9FADBC"
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
				LEGACY_secondaryColor="#161A1D"
				color="currentColor"
				size="small"
			/>
		</Pressable>
	);
};

const NextIcon = withIconWrapper(ArrowRightCircleIcon);
const PreviousIcon = withIconWrapper(ArrowLeftCircleIcon);

export class NavigationBase extends Component<NavigationProps, {}> {
	private navigate(direction: NavigationDirection, source: NavigationSource) {
		return () => {
			const { onChange, items, createAnalyticsEvent } = this.props;
			const { selectedIndex } = this;
			const newItem = direction === 'next' ? items[selectedIndex + 1] : items[selectedIndex - 1];

			if (newItem) {
				fireAnalytics(createNavigatedEvent(direction, source, newItem), createAnalyticsEvent);
				onChange(newItem);
			}
		};
	}

	get selectedIndex() {
		const { items, selectedItem } = this.props;
		return getSelectedIndex(items, selectedItem);
	}

	render(): React.JSX.Element | null {
		const { items, isArchiveSideBarVisible } = this.props;
		const { selectedIndex } = this;

		if (selectedIndex === -1) {
			return null;
		}

		const isLeftVisible = selectedIndex > 0;
		const isRightVisible = selectedIndex < items.length - 1;

		const prev = (source: NavigationSource) => this.navigate('prev', source);
		const next = (source: NavigationSource) => this.navigate('next', source);

		return (
			<ArrowsWrapper>
				<LeftWrapper isArchiveSideBarVisible={!!isArchiveSideBarVisible}>
					{isLeftVisible ? (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						<Arrow className={hideControlsClassName}>
							<Shortcut code={'ArrowLeft'} handler={prev('keyboard')} eventType={'keyup'} />
							<PreviousIcon label="Previous" clickHandler={prev} testId={prevNavButtonId} />
						</Arrow>
					) : null}
				</LeftWrapper>

				<RightWrapper>
					{isRightVisible ? (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						<Arrow className={hideControlsClassName}>
							<Shortcut code={'ArrowRight'} handler={next('keyboard')} eventType={'keyup'} />
							<NextIcon label="Next" clickHandler={next} testId={nextNavButtonId} />
						</Arrow>
					) : null}
				</RightWrapper>
			</ArrowsWrapper>
		);
	}
}

export const Navigation = withAnalyticsEvents({})(NavigationBase);
