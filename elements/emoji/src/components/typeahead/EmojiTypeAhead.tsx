import React from 'react';
import type { ComponentClass } from 'react';
import type { EmojiProvider } from '../../api/EmojiResource';
import type { RelativePosition } from '../../types';
import debug from '../../util/logger';
import LoadingEmojiComponent, {
	type Props as LoadingProps,
	type State as LoadingState,
} from '../common/LoadingEmojiComponent';
import Popup from '../common/Popup';
import type EmojiTypeAheadComponent from './EmojiTypeAheadComponent';
import type { EmojiTypeAheadBaseProps, Props as ComponentProps } from './EmojiTypeAheadComponent';

const emojiTypeAheadModuleLoader = () =>
	import(
		/* webpackChunkName:"@atlaskit-internal_emojiTypeAheadComponent" */ './EmojiTypeAheadComponent'
	);

const emojiTypeAheadComponentLoader: () => Promise<ComponentClass<ComponentProps>> = () =>
	emojiTypeAheadModuleLoader().then((module) => module.default);

export interface Props extends EmojiTypeAheadBaseProps, LoadingProps {
	offsetX?: number;
	offsetY?: number;
	position?: RelativePosition;
	/** CSS selector, or target HTML element */
	target?: string | HTMLElement;
	zIndex?: number | string;
}

export default class EmojiTypeahead extends LoadingEmojiComponent<Props, LoadingState> {
	// state initialised with static component to prevent
	// rerender when the module has already been loaded
	static AsyncLoadedComponent?: ComponentClass<ComponentProps>;
	private typeAheadRef = React.createRef<EmojiTypeAheadComponent>();
	state = {
		asyncLoadedComponent: EmojiTypeahead.AsyncLoadedComponent,
	};

	constructor(props: Props) {
		super(props, {});
	}

	selectNext = (): void => {
		if (this.typeAheadRef.current) {
			this.typeAheadRef.current.selectNext();
		}
	};

	selectPrevious = (): void => {
		if (this.typeAheadRef.current) {
			this.typeAheadRef.current.selectPrevious();
		}
	};

	chooseCurrentSelection = (): void => {
		if (this.typeAheadRef.current) {
			this.typeAheadRef.current.chooseCurrentSelection();
		}
	};

	count = (): number => {
		if (this.typeAheadRef.current) {
			return this.typeAheadRef.current.count();
		}
		return 0;
	};

	asyncLoadComponent(): void {
		emojiTypeAheadComponentLoader().then((component) => {
			EmojiTypeahead.AsyncLoadedComponent = component;
			this.setAsyncState(component);
		});
	}

	renderLoaded(
		loadedEmojiProvider: EmojiProvider,
		TypeAheadComponent: ComponentClass<ComponentProps>,
	): React.JSX.Element | null {
		const { emojiProvider, target, position, zIndex, offsetX, offsetY, ...otherProps } = this.props;

		const typeAhead = (
			<TypeAheadComponent
				{...otherProps}
				emojiProvider={loadedEmojiProvider}
				ref={this.typeAheadRef}
			/>
		);

		if (position) {
			debug('target, position', target, position);
			if (target) {
				return (
					<Popup
						target={target}
						relativePosition={position}
						zIndex={zIndex}
						offsetX={offsetX}
						offsetY={offsetY}
						children={typeAhead}
					/>
				);
			}
			// don't show if we have a position, but no target yet
			return null;
		}

		return typeAhead;
	}
}
