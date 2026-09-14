/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import type { ComponentClass } from 'react';

import { css, jsx } from '@compiled/react';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';
import { token } from '@atlaskit/tokens';

import type { EmojiProvider } from '../../api/EmojiResource';
import { EmojiCommonProvider } from '../../context/EmojiCommonProvider';
import { ufoExperiences } from '../../util/analytics/ufoExperiences';
import { defaultEmojiPickerSize } from '../../util/constants';
import { isTeamoji26RefreshEmojiPickerEnabled } from '../../util/teamoji26RefreshEmojiPicker';
import LoadingEmojiComponent, { type State as LoadingState } from '../common/LoadingEmojiComponent';
import { UfoErrorBoundary } from '../common/UfoErrorBoundary';
import type { Props } from './EmojiPicker';
import type { Props as ComponentProps } from './EmojiPickerComponent';
import { LoadingItem } from './LoadingItem';
import { emojiPickerLoader } from './emojiPickerLoader';

const isRefreshEmojiPickerEnabled = (): boolean => {
	return isTeamoji26RefreshEmojiPickerEnabled();
};

const emojiPicker = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	backgroundColor: token('elevation.surface.overlay'),
	border: `${token('color.border')} ${token('border.width')} solid`,
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay'),
	height: '375px',
	width: '350px',
	minWidth: '350px',
	minHeight: '340px',
	maxHeight: 'calc(80vh - 86px)', // ensure showing full picker in small device: mobile header is 40px (Jira) - 56px(Confluence and Atlas), reaction picker height is 24px with margin 6px,
});

const emojiPickerNew = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	backgroundColor: token('elevation.surface.overlay'),
	border: `${token('color.border')} ${token('border.width')} solid`,
	borderRadius: token('radius.large', '8px'),
	boxShadow: token('elevation.shadow.overlay'),
	height: '375px',
	width: '350px',
	minWidth: '350px',
	minHeight: '340px',
	maxHeight: 'calc(80vh - 86px)', // ensure showing full picker in small device: mobile header is 40px (Jira) - 56px(Confluence and Atlas), reaction picker height is 24px with margin 6px,
});

export class EmojiPickerInternal extends LoadingEmojiComponent<
	Props & WithAnalyticsEventsProps,
	LoadingState
> {
	// state initialised with static component to prevent
	// rerender when the module has already been loaded
	static AsyncLoadedComponent?: React.ComponentType<React.PropsWithChildren<ComponentProps>>;

	static defaultProps: {
		size: string;
	} = {
		size: defaultEmojiPickerSize,
	};

	state: {
		asyncLoadedComponent: React.ComponentType<React.PropsWithChildren<ComponentProps>> | undefined;
	} = {
		asyncLoadedComponent: EmojiPickerInternal.AsyncLoadedComponent,
	};

	constructor(props: Props) {
		super(props, {});
		ufoExperiences['emoji-picker-opened'].start();
	}

	asyncLoadComponent(): void {
		emojiPickerLoader().then((component) => {
			EmojiPickerInternal.AsyncLoadedComponent = component;
			this.setAsyncState(component);
		});
	}

	renderLoading(): JSX.Element | null {
		const item = new LoadingItem();
		const handlePickerRef = (ref: any) => {
			if (this.props.onPickerRef) {
				this.props.onPickerRef(ref);
			}
		};
		ufoExperiences['emoji-picker-opened'].markFMP();

		return isRefreshEmojiPickerEnabled() ? (
			<div css={emojiPickerNew} ref={handlePickerRef}>
				{item.renderItem()}
			</div>
		) : (
			<div css={emojiPicker} ref={handlePickerRef}>
				{item.renderItem()}
			</div>
		);
	}

	renderLoaded(
		loadedEmojiProvider: EmojiProvider,
		EmojiPickerComponent: ComponentClass<ComponentProps>,
	): JSX.Element {
		const { emojiProvider, ...otherProps } = this.props;
		return (
			<UfoErrorBoundary experiences={[ufoExperiences['emoji-picker-opened']]}>
				<EmojiCommonProvider emojiProvider={loadedEmojiProvider}>
					<EmojiPickerComponent {...otherProps} />
				</EmojiCommonProvider>
			</UfoErrorBoundary>
		);
	}
}
