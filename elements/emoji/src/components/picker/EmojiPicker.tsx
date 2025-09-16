/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import type { ComponentClass } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N40 } from '@atlaskit/theme/colors';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { ufoExperiences } from '../../util/analytics';
import type { EmojiProvider } from '../../api/EmojiResource';
import type { OnEmojiEvent, PickerSize } from '../../types';
import LoadingEmojiComponent, {
	type Props as LoadingProps,
	type State as LoadingState,
} from '../common/LoadingEmojiComponent';
import type { PickerRefHandler, Props as ComponentProps } from './EmojiPickerComponent';
import { LoadingItem } from './EmojiPickerVirtualItems';
import { UfoErrorBoundary } from '../common/UfoErrorBoundary';
import { defaultEmojiPickerSize } from '../../util/constants';
import { EmojiCommonProvider } from '../../context/EmojiCommonProvider';

const emojiPicker = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	backgroundColor: token('elevation.surface.overlay', 'white'),
	border: `${token('color.border', N40)} ${token('border.width')} solid`,
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay', '0 3px 6px rgba(0, 0, 0, 0.2)'),
	height: '375px',
	width: '350px',
	minWidth: '350px',
	minHeight: '340px',
	maxHeight: 'calc(80vh - 86px)', // ensure showing full picker in small device: mobile header is 40px (Jira) - 56px(Confluence and Atlas), reaction picker height is 24px with margin 6px,
});

const emojiPickerModuleLoader = () =>
	import(/* webpackChunkName:"@atlaskit-internal_emojiPickerComponent" */ './EmojiPickerComponent');

const emojiPickerLoader: () => Promise<
	React.ComponentType<React.PropsWithChildren<ComponentProps>>
> = () => emojiPickerModuleLoader().then((module) => module.default);

export const preloadEmojiPicker = () => {
	emojiPickerLoader().then((component) => {
		EmojiPickerInternal.AsyncLoadedComponent = component;
	});
};

export interface Props extends LoadingProps {
	/**
	 * Flag to disable tone selector.
	 */
	hideToneSelector?: boolean;
	/**
	 * Callback to handle picker reference.
	 */
	onPickerRef?: PickerRefHandler;
	/**
	 * Callback to be executed on emoji selection.
	 */
	onSelection?: OnEmojiEvent;
	/**
	 * Size of Emoji Picker. default value is 'medium'.
	 */
	size?: PickerSize;
}

export class EmojiPickerInternal extends LoadingEmojiComponent<
	Props & WithAnalyticsEventsProps,
	LoadingState
> {
	// state initialised with static component to prevent
	// rerender when the module has already been loaded
	static AsyncLoadedComponent?: React.ComponentType<React.PropsWithChildren<ComponentProps>>;

	static defaultProps = {
		size: defaultEmojiPickerSize,
	};

	state = {
		asyncLoadedComponent: EmojiPickerInternal.AsyncLoadedComponent,
	};

	constructor(props: Props) {
		super(props, {});
		ufoExperiences['emoji-picker-opened'].start();
	}

	asyncLoadComponent() {
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

		return (
			<div css={emojiPicker} ref={handlePickerRef}>
				{item.renderItem()}
			</div>
		);
	}

	renderLoaded(
		loadedEmojiProvider: EmojiProvider,
		EmojiPickerComponent: ComponentClass<ComponentProps>,
	) {
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

const EmojiPicker = withAnalyticsEvents()<
	Props & WithAnalyticsEventsProps,
	React.ComponentType<Props & WithAnalyticsEventsProps>
>(EmojiPickerInternal as any);

export default EmojiPicker;
