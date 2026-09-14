import React from 'react';

import { IntlProvider, type IntlShape } from 'react-intl';

import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';
import { Text } from '@atlaskit/primitives/compiled';

import {
	type ErrorCallback,
	type InfoCallback,
	type MentionProvider,
	type MentionStats,
} from '../../api/MentionResource';
import { type MentionDescription } from '../../types';
import { fireAnalyticsMentionTypeaheadEvent } from '../../util/fire-analytics-mention-typeahead-event';
import uniqueId from '../../util/id';
import debug from '../../util/logger';
import Popup from '../Popup';
import ResourcedMentionList from '../ResourcedMentionList';
import type { Props, State } from './index';
import { MentionPickerInfoStyle, MentionPickerStyle } from './styles';

/**
 * @class MentionPicker
 */
export class MentionPicker extends React.PureComponent<
	Props & WithAnalyticsEventsProps & { intl: IntlShape },
	State
> {
	private subscriberKey: string;
	private mentionListRef?: ResourcedMentionList | null;

	static defaultProps = {
		onSelection: (): void => {},
		onOpen: (): void => {},
		onClose: (): void => {},
	};

	constructor(props: Props & WithAnalyticsEventsProps & { intl: IntlShape }) {
		super(props);
		this.subscriberKey = uniqueId('ak-mention-picker');
		this.state = {
			visible: false,
		};
		this.applyPropChanges({} as Props, props);
	}

	componentDidMount(): void {
		this.subscribeResourceProvider(this.props.resourceProvider);
	}
	UNSAFE_componentWillReceiveProps(nextProps: Props & WithAnalyticsEventsProps): void {
		this.applyPropChanges(this.props, nextProps);
	}

	componentWillUnmount(): void {
		this.unsubscribeResourceProvider(this.props.resourceProvider);
	}

	selectNext = (): void => {
		if (this.mentionListRef) {
			this.mentionListRef.selectNext();
		}
	};

	selectPrevious = (): void => {
		if (this.mentionListRef) {
			this.mentionListRef.selectPrevious();
		}
	};

	selectIndex = (index: number, callback?: () => any): void => {
		if (this.mentionListRef) {
			this.mentionListRef.selectIndex(index, callback);
		}
	};

	selectId = (id: string, callback?: () => any): void => {
		if (this.mentionListRef) {
			this.mentionListRef.selectId(id, callback);
		}
	};

	chooseCurrentSelection = (): void => {
		if (this.mentionListRef) {
			this.mentionListRef.chooseCurrentSelection();
		}
	};

	mentionsCount = (): number => {
		if (this.mentionListRef) {
			return this.mentionListRef.mentionsCount();
		}

		return 0;
	};

	// Internal
	private applyPropChanges(prevProps: Props, nextProps: Props) {
		const oldResourceProvider = prevProps.resourceProvider;
		const newResourceProvider = nextProps.resourceProvider;

		const resourceProviderChanged = oldResourceProvider !== newResourceProvider;

		// resource provider
		if (resourceProviderChanged) {
			this.unsubscribeResourceProvider(oldResourceProvider);
			this.subscribeResourceProvider(newResourceProvider);
		}
	}

	private subscribeResourceProvider(resourceProvider?: MentionProvider) {
		if (resourceProvider) {
			resourceProvider.subscribe(
				this.subscriberKey,
				this.filterChange,
				this.filterError,
				this.filterInfo,
				undefined,
			);
		}
	}

	private unsubscribeResourceProvider(resourceProvider?: MentionProvider) {
		if (resourceProvider) {
			resourceProvider.unsubscribe(this.subscriberKey);
		}
	}

	/**
	 * Called after the 'visible' state is changed to decide whether the onOpen or onClose
	 * handlers should be called.
	 *
	 * It should be noted that the visible state of the component is not considered in
	 * this function. Instead the old state and new state should be passed as parameters.
	 */
	private onFilterVisibilityChange = (oldVisibility: boolean, newVisibility: boolean) => {
		if (oldVisibility !== newVisibility) {
			if (newVisibility) {
				if (this.props.onOpen) {
					this.props.onOpen();
				}
			} else {
				if (this.props.onClose) {
					this.props.onClose();
				}
			}
		}
	};

	// internal, used for callbacks
	private filterChange = (mentions: MentionDescription[], query?: string, stats?: MentionStats) => {
		debug('ak-mention-picker.filterChange', mentions.length);
		const wasVisible = this.state.visible;
		const visible = mentions.length > 0;
		this.setState({
			visible,
		});

		this.onFilterVisibilityChange(wasVisible, visible);

		fireAnalyticsMentionTypeaheadEvent(this.props)(
			'rendered',
			stats && stats.duration,
			mentions.map((mention) => mention.id),
			query,
		);
	};

	private filterError: ErrorCallback = (error) => {
		debug('ak-mention-picker.filterError', error);
		const wasVisible = this.state.visible;
		this.setState({
			visible: true,
			info: undefined,
		});

		this.onFilterVisibilityChange(wasVisible, true);
	};

	private filterInfo: InfoCallback = (info) => {
		debug('ak-mention-picker.filterInfo', info);
		this.setState({
			info,
		} as State);
	};

	private handleMentionListRef = (ref: ResourcedMentionList | null) => {
		this.mentionListRef = ref;
	};

	render(): React.JSX.Element {
		const {
			resourceProvider,
			presenceProvider,
			onSelection,
			query,
			target,
			position,
			zIndex,
			offsetX,
			offsetY,
			intl,
		} = this.props;
		const { visible, info } = this.state;

		const resourceMentionList = (
			<ResourcedMentionList
				resourceProvider={resourceProvider}
				presenceProvider={presenceProvider}
				onSelection={onSelection}
				query={query}
				ref={this.handleMentionListRef}
			/>
		);

		const infoContent =
			info && !visible ? (
				<MentionPickerInfoStyle>
					<Text as="p">{info}</Text>
				</MentionPickerInfoStyle>
			) : null;

		let content;

		if (position) {
			debug('target, position', target, position);
			if (target) {
				content = (
					<Popup
						target={target}
						relativePosition={position}
						zIndex={zIndex}
						offsetX={offsetX}
						offsetY={offsetY}
					>
						{/* Popup can be portalled outside of an intl context so providing
						an intl provider here*/}
						<IntlProvider locale={intl?.locale || 'en'}>
							<div>
								{resourceMentionList}
								{infoContent}
							</div>
						</IntlProvider>
					</Popup>
				);
			} else {
				// don't show if we have a position, but no target yet
				content = null;
			}
		} else {
			content = (
				<div>
					{resourceMentionList}
					{infoContent}
				</div>
			);
		}

		return (
			/* old classnames are essential for Confluence tests */
			<MentionPickerStyle
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="ak-mention-picker"
				visible={visible || info}
			>
				{content}
			</MentionPickerStyle>
		);
	}
}
