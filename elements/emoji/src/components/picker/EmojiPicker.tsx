/** @jsx jsx */
import type { ComponentClass } from 'react';
import { jsx } from '@emotion/react';
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
import { emojiPicker } from './styles';
import { UfoErrorBoundary } from '../common/UfoErrorBoundary';
import { defaultEmojiPickerSize } from '../../util/constants';
import { EmojiCommonProvider } from '../../context/EmojiCommonProvider';

const emojiPickerModuleLoader = () =>
	import(/* webpackChunkName:"@atlaskit-internal_emojiPickerComponent" */ './EmojiPickerComponent');

const emojiPickerLoader: () => Promise<
	React.ComponentType<React.PropsWithChildren<ComponentProps>>
> = () => emojiPickerModuleLoader().then((module) => module.default);

export interface Props extends LoadingProps {
	/**
	 * Callback to be executed on emoji selection.
	 */
	onSelection?: OnEmojiEvent;
	/**
	 * Callback to handle picker reference.
	 */
	onPickerRef?: PickerRefHandler;
	/**
	 * Flag to disable tone selector.
	 */
	hideToneSelector?: boolean;
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
			<div css={emojiPicker()} ref={handlePickerRef}>
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
