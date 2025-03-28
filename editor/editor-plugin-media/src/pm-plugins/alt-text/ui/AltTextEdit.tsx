/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { KeyboardEvent } from 'react';
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import type {
	FireAnalyticsCallback,
	MediaAltTextActionType,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	fireAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { escape, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { altTextMessages as messages } from '@atlaskit/editor-common/media';
import {
	RECENT_SEARCH_WIDTH_IN_PX as CONTAINER_WIDTH_IN_PX,
	FloatingToolbarButton as Button,
	ErrorMessage,
	PanelTextInput,
} from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import CrossCircleIcon from '@atlaskit/icon/core/migration/cross-circle';
import ChevronLeftLargeIcon from '@atlaskit/icon/utility/migration/chevron-left--chevron-left-large';
import { N200, N30, N80, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { closeMediaAltTextMenu, closeMediaAltTextMenuAndSave } from '../commands';

export const MAX_ALT_TEXT_LENGTH = 510; // double tweet length

const supportTextStyles = css({
	color: token('color.text.subtlest', N200),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: relativeFontSizeToBase16(12),
	padding: `${token('space.150', '12px')} ${token('space.500', '40px')}`,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '20px',
	borderTop: `1px solid ${token('color.border', N30)}`,
	margin: 0,
});

const containerStyles = css({
	// eslint-disable-next-line  @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${CONTAINER_WIDTH_IN_PX}px`,
	display: 'flex',
	flexDirection: 'column',
	overflow: 'auto',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 2,
});

const inputWrapperStyles = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 0,
	padding: `${token('space.075', '6px')} 0`,
	alignItems: 'center',
});

const validationWrapperStyles = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 0,
	padding: `${token('space.150', '12px')} ${token('space.300', '24px')} ${token(
		'space.150',
		'12px',
	)} 0`,
	margin: `0 ${token('space.150', '12px')} 0 ${token('space.500', '40px')}`,
	borderTop: `1px solid ${token('color.border.danger', R400)}`,
	alignItems: 'start',
	flexDirection: 'column',
});

const buttonWrapperStyles = css({
	display: 'flex',
	padding: `${token('space.050', '4px')} ${token('space.100', '8px')}`,
});

const clearTextStyles = css({
	color: token('color.icon.subtle', N80),
});

type Props = {
	view: EditorView;
	nodeType: 'mediaSingle' | 'mediaInline';
	mediaType: 'file' | 'image' | 'external';
	value?: string;
	altTextValidator?: (value: string) => string[];
	onEscape?: () => void;
} & WrappedComponentProps &
	WithAnalyticsEventsProps;

export type AltTextEditComponentState = {
	showClearTextButton: boolean;
	validationErrors: string[] | undefined;
	lastValue: string | undefined;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class AltTextEditComponent extends React.Component<Props, AltTextEditComponentState> {
	private fireCustomAnalytics?: FireAnalyticsCallback;
	private errorsListRef;
	state = {
		showClearTextButton: Boolean(this.props.value),
		validationErrors: this.props.value ? this.getValidationErrors(this.props.value) : [],
		lastValue: this.props.value,
	};

	constructor(props: Props) {
		super(props);

		const { createAnalyticsEvent } = props;
		this.fireCustomAnalytics = fireAnalyticsEvent(createAnalyticsEvent);
		this.errorsListRef = React.createRef<HTMLElement>();
	}

	prevValue: string | undefined;

	componentDidMount() {
		this.prevValue = this.props.value;
	}

	componentWillUnmount() {
		this.fireAnalytics(ACTION.CLOSED);
		if (!this.prevValue && this.state.lastValue) {
			this.fireAnalytics(ACTION.ADDED);
		}
		if (this.prevValue && !this.state.lastValue) {
			this.fireAnalytics(ACTION.CLEARED);
		}
		if (this.prevValue && this.prevValue !== this.state.lastValue) {
			this.fireAnalytics(ACTION.EDITED);
		}
	}

	private getValidationErrors(value: string): string[] {
		const { altTextValidator } = this.props;
		if (value && typeof altTextValidator === 'function') {
			return altTextValidator(value) || [];
		}
		return [];
	}

	render() {
		const {
			intl: { formatMessage },
		} = this.props;
		const { showClearTextButton } = this.state;

		const backButtonMessage = formatMessage(messages.back);
		const backButtonMessageComponent = (
			<ToolTipContent description={backButtonMessage} keymap={escape} shortcutOverride="Esc" />
		);

		const errorsList = (this.state.validationErrors || []).map(function (error, index) {
			// Ignored via go/ees005
			// eslint-disable-next-line react/no-array-index-key
			return <ErrorMessage key={index}>{error}</ErrorMessage>;
		});
		const hasErrors = !!errorsList.length;

		return (
			<div css={containerStyles}>
				<section css={inputWrapperStyles}>
					<div css={buttonWrapperStyles}>
						<Button
							title={formatMessage(messages.back)}
							icon={<ChevronLeftLargeIcon label={formatMessage(messages.back)} />}
							tooltipContent={backButtonMessageComponent}
							onClick={this.closeMediaAltTextMenu}
						/>
					</div>
					<PanelTextInput
						testId="alt-text-input"
						ariaLabel={formatMessage(messages.placeholder)}
						describedById={`${hasErrors ? 'errors-list' : ''} support-text`}
						placeholder={formatMessage(messages.placeholder)}
						defaultValue={this.state.lastValue}
						onCancel={this.dispatchCancelEvent}
						onChange={this.handleOnChange}
						onBlur={this.handleOnBlur}
						onSubmit={this.closeMediaAltTextMenu}
						maxLength={MAX_ALT_TEXT_LENGTH}
						ariaRequired={true}
						ariaInvalid={hasErrors}
						autoFocus
					/>
					{showClearTextButton && (
						<div css={buttonWrapperStyles}>
							<Button
								testId="alt-text-clear-button"
								title={formatMessage(messages.clear)}
								icon={
									<span css={clearTextStyles}>
										<CrossCircleIcon label={formatMessage(messages.clear)} />
									</span>
								}
								tooltipContent={formatMessage(messages.clear)}
								onClick={this.handleClearText}
							/>
						</div>
					)}
				</section>
				{hasErrors && (
					<section
						id="errors-list"
						ref={this.errorsListRef}
						aria-live="assertive"
						css={validationWrapperStyles}
					>
						{errorsList}
					</section>
				)}
				{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
				<p css={supportTextStyles} id="support-text">
					{formatMessage(messages.supportText)}
				</p>
			</div>
		);
	}

	private closeMediaAltTextMenu = () => {
		const { view } = this.props;

		if (this.state.validationErrors.length === 0) {
			closeMediaAltTextMenuAndSave(this.state.lastValue || '')(view.state, view.dispatch);
		} else {
			closeMediaAltTextMenu(view.state, view.dispatch);
		}
	};

	private fireAnalytics(actionType: MediaAltTextActionType) {
		const { createAnalyticsEvent, nodeType, mediaType } = this.props;
		if (createAnalyticsEvent && this.fireCustomAnalytics) {
			this.fireCustomAnalytics({
				payload: {
					action: actionType,
					actionSubject: ACTION_SUBJECT.MEDIA,
					actionSubjectId: ACTION_SUBJECT_ID.ALT_TEXT,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						type: nodeType,
						mediaType,
					},
				},
			});
		}
	}

	private dispatchCancelEvent = (event: KeyboardEvent) => {
		const { view, onEscape } = this.props;

		// We need to pass down the ESCAPE keymap
		// because when we focus on the Toolbar, Prosemirror blur,
		// making all keyboard shortcuts not working
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		view.someProp('handleKeyDown', (fn: any) => fn(view, event));
		onEscape?.();
	};

	private handleOnChange = (newAltText: string) => {
		const validationErrors = this.getValidationErrors(newAltText);

		if (this.state?.validationErrors?.length !== validationErrors?.length) {
			// If number of errors was changed we need to reset attribute to get new SR announcement

			if (this.errorsListRef) {
				const errorsArea = this.errorsListRef?.current;
				errorsArea?.removeAttribute('aria-live');
				errorsArea?.setAttribute('aria-live', 'assertive');
			}
		}
		this.setState({
			showClearTextButton: Boolean(newAltText),
			validationErrors,
			lastValue: newAltText,
		});
	};

	private handleOnBlur = (e: FocusEvent) => {
		// prevent other selection transaction gets triggered
		e.stopPropagation();
		this.closeMediaAltTextMenu();
	};

	private handleClearText = () => {
		this.handleOnChange('');
	};
}

export default withAnalyticsEvents()(injectIntl(AltTextEditComponent));
