/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import type { FormEvent } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { css, jsx } from '@atlaskit/css';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { dateMessages as messages } from '@atlaskit/editor-common/messages';
import { ErrorMessage } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import type { DateType } from '../../types';

import { formatDateType, parseDateType } from './utils/formatParse';
import { adjustDate, findDateSegmentByPosition, isDatePossiblyValid } from './utils/internal';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const dateTextFieldWrapper = css({
	// TODO: EDF-2517 - should use token here
	// @ts-expect-error
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingTop: '22px',
	paddingBottom: token('space.150', '12px'),
	// TODO: EDF-2517 - should use token here
	// @ts-expect-error
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingLeft: '22px',
	// TODO: EDF-2517 - should use token here
	// @ts-expect-error
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingRight: '22px',
});

export interface InputProps {
	/** Locale code string (eg. "en-AU") */
	locale: string;
	date: DateType;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	onNewDate: (date: DateType) => void;
	onSubmitDate: (date: DateType | null) => void;
	onEmptySubmit: () => void;
	/** Automatically focus the text field */
	autoFocus?: boolean;
	/** Automatically select all text in the field. Requires autoFocus to be true. */
	autoSelectAll?: boolean;
}

export interface InputState {
	inputText: string;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class DatePickerInput extends React.Component<InputProps & WrappedComponentProps, InputState> {
	private inputRef: HTMLInputElement | undefined;
	private setInputSelectionPos: number | undefined;
	private autofocusTimeout: NodeJS.Timeout | undefined;
	private autoSelectAllTimeout: NodeJS.Timeout | undefined;

	constructor(props: InputProps & WrappedComponentProps) {
		super(props);
		const { date } = props;
		this.setInputSelectionPos = undefined;
		const inputText = formatDateType(date, this.props.locale);
		this.state = {
			inputText,
		};
	}

	render() {
		const {
			locale,
			intl: { formatMessage },
		} = this.props;
		const { inputText } = this.state;

		const possiblyValid = isDatePossiblyValid(inputText);
		const attemptedDateParse = parseDateType(inputText, locale);

		// Don't display an error for an empty input.
		const displayError: boolean =
			(attemptedDateParse === null || !possiblyValid) && inputText !== '';
		return (
			<div css={dateTextFieldWrapper}>
				<TextField
					name="datetextfield"
					value={inputText}
					ref={this.handleInputRef}
					onChange={this.handleChange}
					onKeyPress={this.handleKeyPress}
					onKeyDown={this.handleKeyDown}
					spellCheck={false}
					autoComplete="off"
					isInvalid={displayError}
					aria-label={formatMessage(messages.onKeyUpDownText)}
				/>
				{displayError && <ErrorMessage>{formatMessage(messages.invalidDateError)}</ErrorMessage>}
			</div>
		);
	}

	componentDidUpdate() {
		const setInputSelectionPos = this.setInputSelectionPos;
		if (this.inputRef && setInputSelectionPos !== undefined) {
			this.inputRef.setSelectionRange(setInputSelectionPos, setInputSelectionPos);
			this.setInputSelectionPos = undefined;
		}

		if (this.inputRef && this.props.autoFocus) {
			this.focusInput();
		}

		// Don't select all text here - would seleect text on each keystroke
	}

	/**
	 * Focus the input textfield
	 */
	private focusInput = (): void => {
		if (!this.inputRef) {
			return;
		}
		// Defer to prevent editor scrolling to top (See FS-3227, also ED-2992)
		this.autofocusTimeout = setTimeout(() => {
			this.inputRef?.focus();
		});
	};
	/**
	 * Select all the input text
	 */
	private selectInput = (): void => {
		if (!this.inputRef) {
			return;
		}
		// Defer to prevent editor scrolling to top (See FS-3227, also ED-2992)
		this.autoSelectAllTimeout = setTimeout(() => {
			this.inputRef?.select();
		});
	};

	private handleInputRef = (ref?: HTMLInputElement) => {
		const { autoFocus, autoSelectAll } = this.props;
		if (ref) {
			this.inputRef = ref;
		}

		if (ref && autoFocus) {
			this.focusInput();
		}

		if (autoSelectAll) {
			this.selectInput();
		}
	};

	componentWillUnmount() {
		if (this.autofocusTimeout !== undefined) {
			clearTimeout(this.autofocusTimeout);
		}
		if (this.autoSelectAllTimeout !== undefined) {
			clearTimeout(this.autoSelectAllTimeout);
		}
	}

	private handleChange = (evt: FormEvent<HTMLInputElement>) => {
		const textFieldValue: string = (evt.target as HTMLInputElement).value;
		const { locale, dispatchAnalyticsEvent } = this.props;

		const newDate = parseDateType(textFieldValue, locale);
		if (newDate !== undefined && newDate !== null) {
			this.setState({
				inputText: textFieldValue,
			});
			this.props.onNewDate(newDate);
			if (dispatchAnalyticsEvent) {
				dispatchAnalyticsEvent({
					eventType: EVENT_TYPE.TRACK,
					action: ACTION.TYPING_FINISHED,
					actionSubject: ACTION_SUBJECT.DATE,
				});
			}
		} else {
			// if invalid, just update state text (to rerender textfield)
			this.setState({
				inputText: textFieldValue,
			});
		}
	};

	private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const { locale, dispatchAnalyticsEvent } = this.props;
		const textFieldValue: string = (event.target as HTMLInputElement).value;

		// Fire event on every keypress (textfield not necessarily empty)
		if (dispatchAnalyticsEvent && event.key !== 'Enter' && event.key !== 'Backspace') {
			dispatchAnalyticsEvent({
				eventType: EVENT_TYPE.TRACK,
				action: ACTION.TYPING_STARTED,
				actionSubject: ACTION_SUBJECT.DATE,
			});
		}
		if (event.key !== 'Enter') {
			return;
		}

		if (textFieldValue === '') {
			this.props.onEmptySubmit();
			return;
		}

		const newDate = parseDateType(textFieldValue, locale);

		this.props.onSubmitDate(newDate);
	};

	// arrow keys are only triggered by onKeyDown, not onKeyPress
	private handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const dateString: string = (event.target as HTMLInputElement).value;
		const { locale } = this.props;
		let adjustment: number | undefined;
		if (event.key === 'ArrowUp') {
			adjustment = 1;
		} else if (event.key === 'ArrowDown') {
			adjustment = -1;
		}
		if (adjustment === undefined) {
			return;
		}

		const { dispatchAnalyticsEvent } = this.props;
		const cursorPos = this.inputRef?.selectionStart;
		if (cursorPos === null || cursorPos === undefined) {
			return;
		}

		const activeSegment = findDateSegmentByPosition(cursorPos, dateString, locale);
		if (activeSegment === undefined) {
			return;
		}

		let dateSegment:
			| ACTION_SUBJECT_ID.DATE_DAY
			| ACTION_SUBJECT_ID.DATE_MONTH
			| ACTION_SUBJECT_ID.DATE_YEAR;
		switch (activeSegment) {
			case 'day':
				dateSegment = ACTION_SUBJECT_ID.DATE_DAY;
				break;
			case 'month':
				dateSegment = ACTION_SUBJECT_ID.DATE_MONTH;
				break;
			default:
				dateSegment = ACTION_SUBJECT_ID.DATE_YEAR;
		}
		if (dispatchAnalyticsEvent) {
			dispatchAnalyticsEvent({
				eventType: EVENT_TYPE.TRACK,
				action: adjustment > 0 ? ACTION.INCREMENTED : ACTION.DECREMENTED,
				actionSubject: ACTION_SUBJECT.DATE_SEGMENT,
				attributes: { dateSegment },
			});
		}
		const oldDateType = parseDateType(dateString, locale);
		if (oldDateType === undefined || oldDateType === null) {
			return;
		}

		const newDateType = adjustDate(oldDateType, activeSegment, adjustment);

		this.setState({
			inputText: formatDateType(newDateType, locale),
		});
		this.props.onNewDate(newDateType);
		this.setInputSelectionPos = Math.min(cursorPos, dateString.length);
		event.preventDefault();
	};
}

export default injectIntl(DatePickerInput);
