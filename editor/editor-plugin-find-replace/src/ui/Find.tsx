/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';
import debounce from 'lodash/debounce';
import rafSchd from 'raf-schd';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { findReplaceMessages as messages } from '@atlaskit/editor-common/messages';
import { Label } from '@atlaskit/form';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import MatchCaseIcon from '@atlaskit/icon/glyph/emoji/keyboard';
import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import Textfield from '@atlaskit/textfield';

import type { MatchCaseProps } from '../types';

import { FindReplaceTooltipButton } from './FindReplaceTooltipButton';
import {
	afterInputSection,
	countStyles,
	countStylesAlternateStyles,
	countWrapperStyles,
	matchCaseSection,
	sectionWrapperStyles,
	sectionWrapperStylesAlternate,
	textFieldWrapper,
} from './styles';

export const FIND_DEBOUNCE_MS = 100;

export type FindProps = {
	findText?: string;
	count: { index: number; total: number };
	shouldFocus: boolean;
	onFindBlur: () => void;
	onFind: (findText?: string) => void;
	onFindNext: ({
		triggerMethod,
	}: {
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
	}) => void;
	onFindPrev: ({
		triggerMethod,
	}: {
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
	}) => void;
	onFindTextfieldRefSet: (ref: React.RefObject<HTMLInputElement>) => void;
	onCancel: ({
		triggerMethod,
	}: {
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.TOOLBAR | TRIGGER_METHOD.BUTTON;
	}) => void;
	onArrowDown: () => void;
	setFindTyped: (value: boolean) => void;
	findTyped: boolean;
} & MatchCaseProps;

type State = {
	localFindText: string;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
class Find extends React.Component<FindProps & WrappedComponentProps, State> {
	private findTextfieldRef = React.createRef<HTMLInputElement>();
	private isComposing = false;

	private find: string;
	private closeFindReplaceDialog: string;
	private noResultsFound: string;
	private findNext: string;
	private findPrevious: string;
	private matchCase: string;

	constructor(props: FindProps & WrappedComponentProps) {
		super(props);

		const {
			intl: { formatMessage },
		} = props;

		this.find = formatMessage(messages.find);
		this.closeFindReplaceDialog = formatMessage(messages.closeFindReplaceDialog);
		this.noResultsFound = formatMessage(messages.noResultsFound);
		this.findNext = formatMessage(messages.findNext);
		this.findPrevious = formatMessage(messages.findPrevious);
		this.matchCase = formatMessage(messages.matchCase);

		// We locally manage the value of the input inside this component in order to support compositions.
		// This requires some additional work inside componentDidUpdate to ensure we support changes that
		// occur to this value which do not originate from this component.
		this.state = { localFindText: '' };
	}

	componentDidMount() {
		this.props.onFindTextfieldRefSet(this.findTextfieldRef);

		// focus initially on dialog mount if there is no find text provided
		if (!this.props.findText) {
			this.focusFindTextfield();
		}
		this.syncFindText(() => {
			// focus after input is synced if find text provided
			if (this.props.findText) {
				this.focusFindTextfield();
			}
		});
	}

	componentDidUpdate(prevProps: FindProps) {
		// focus on update if find text did not change
		if (this.props.findText === this.state?.localFindText) {
			this.focusFindTextfield();
		}
		if (this.props.findText !== prevProps.findText) {
			this.syncFindText(() => {
				// focus after input is synced if find text provided
				if (this.props.findText) {
					this.focusFindTextfield();
				}
			});
		}
	}

	componentWillUnmount() {
		this.debouncedFind.cancel();
		this.handleFindKeyDownThrottled.cancel();
	}

	syncFindText = (onSynced?: Function) => {
		// If the external prop findText changes and we aren't in a composition we should update to
		// use the external prop value.
		//
		// An example of where this may happen is when a find occurs through the user selecting some text
		// and pressing Mod-f.
		if (!this.isComposing && this.props.findText !== this.state?.localFindText) {
			this.updateFindValue(this.props.findText || '', onSynced);
		}
	};

	focusFindTextfield = () => {
		const input = this.findTextfieldRef.current;
		if (this.props.shouldFocus && input) {
			input.select();
		}
	};

	handleFindChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.updateFindValue(event.target.value);
	};

	// debounce (vs throttle) to not block typing inside find input while onFind runs
	private debouncedFind = debounce((value) => {
		this.props.onFind(value);
	}, FIND_DEBOUNCE_MS);

	updateFindValue = (value: string, onSynced?: Function) => {
		this.setState({ localFindText: value }, () => {
			if (this.isComposing) {
				return;
			}
			onSynced && onSynced();
			this.debouncedFind(value);
		});
		this.props.setFindTyped(true);
	};

	// throtlle between animation frames gives better experience on Enter compared to arbitrary value
	// it adjusts based on performance (and document size)
	private handleFindKeyDownThrottled = rafSchd((event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			if (event.shiftKey) {
				this.props.onFindPrev({ triggerMethod: TRIGGER_METHOD.KEYBOARD });
			} else {
				this.props.onFindNext({ triggerMethod: TRIGGER_METHOD.KEYBOARD });
			}
		} else if (event.key === 'ArrowDown') {
			// we want to move focus between find & replace texfields when user hits up/down arrows
			this.props.onArrowDown();
		}
	});

	handleFindKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (this.isComposing) {
			return;
		}
		event.persist();
		this.handleFindKeyDownThrottled(event);
	};

	handleFindKeyUp = () => {
		this.handleFindKeyDownThrottled.cancel();
	};

	handleFindNextClick = (ref: React.RefObject<HTMLElement>) => {
		if (this.isComposing) {
			return;
		}
		this.props.onFindNext({ triggerMethod: TRIGGER_METHOD.BUTTON });
	};

	handleFindPrevClick = (ref: React.RefObject<HTMLElement>) => {
		if (this.isComposing) {
			return;
		}
		this.props.onFindPrev({ triggerMethod: TRIGGER_METHOD.BUTTON });
	};

	handleCompositionStart = () => {
		this.isComposing = true;
	};

	handleCompositionEnd = (event: React.CompositionEvent<HTMLInputElement>) => {
		this.isComposing = false;
		// type for React.CompositionEvent doesn't set type for target correctly
		this.updateFindValue((event.target as HTMLInputElement).value);
	};

	clearSearch = () => {
		this.props.onCancel({ triggerMethod: TRIGGER_METHOD.BUTTON });
	};

	handleMatchCaseClick = (buttonRef: React.RefObject<HTMLButtonElement>) => {
		if (this.props.onToggleMatchCase) {
			this.props.onToggleMatchCase();
			this.props.onFind(this.props.findText);
		}
	};

	render() {
		const {
			findText,
			count,
			shouldMatchCase,
			intl: { formatMessage },
		} = this.props;

		const resultsCount = formatMessage(messages.resultsCount, {
			selectedMatchPosition: count.index + 1,
			totalResultsCount: count.total,
		});

		if (getBooleanFF('platform.editor.a11y-find-replace')) {
			const elemAfterInput = (
				<div css={afterInputSection}>
					<div aria-live="polite">
						{findText && (
							<span data-testid="textfield-count" css={[countStyles, countStylesAlternateStyles]}>
								{count.total === 0 ? this.noResultsFound : resultsCount}
							</span>
						)}
					</div>
					<div css={matchCaseSection}>
						<FindReplaceTooltipButton
							title={this.matchCase}
							appearance="default"
							icon={MatchCaseIcon}
							iconLabel={this.matchCase}
							iconSize={getBooleanFF('platform.editor.a11y-find-replace') ? 'small' : undefined}
							onClick={this.handleMatchCaseClick}
							isPressed={shouldMatchCase}
						/>
					</div>
				</div>
			);

			return (
				<div css={[sectionWrapperStyles, sectionWrapperStylesAlternate]}>
					<div css={textFieldWrapper}>
						<Label htmlFor="find-text-field">{this.find}</Label>
						<Textfield
							name="find"
							id="find-text-field"
							appearance="standard"
							value={this.state.localFindText}
							ref={this.findTextfieldRef}
							autoComplete="off"
							onChange={this.handleFindChange}
							onKeyDown={this.handleFindKeyDown}
							onKeyUp={this.handleFindKeyUp}
							onBlur={this.props.onFindBlur}
							onCompositionStart={this.handleCompositionStart}
							onCompositionEnd={this.handleCompositionEnd}
							elemAfterInput={elemAfterInput}
						/>
					</div>
				</div>
			);
		} else {
			return (
				<div css={sectionWrapperStyles}>
					<Textfield
						name="find"
						appearance="none"
						placeholder={this.find}
						value={this.state.localFindText}
						ref={this.findTextfieldRef}
						autoComplete="off"
						onChange={this.handleFindChange}
						onKeyDown={this.handleFindKeyDown}
						onKeyUp={this.handleFindKeyUp}
						onBlur={this.props.onFindBlur}
						onCompositionStart={this.handleCompositionStart}
						onCompositionEnd={this.handleCompositionEnd}
					/>
					<div css={countWrapperStyles} aria-live="polite">
						{findText && (
							<span data-testid="textfield-count" css={countStyles}>
								{count.total === 0 ? this.noResultsFound : resultsCount}
							</span>
						)}
					</div>
					<FindReplaceTooltipButton
						title={this.matchCase}
						icon={MatchCaseIcon}
						iconLabel={this.matchCase}
						iconSize={getBooleanFF('platform.editor.a11y-find-replace') ? 'small' : undefined}
						onClick={this.handleMatchCaseClick}
						isPressed={shouldMatchCase}
					/>
					<FindReplaceTooltipButton
						title={this.findNext}
						icon={ChevronDownIcon}
						iconLabel={this.findNext}
						keymapDescription={'Enter'}
						onClick={this.handleFindNextClick}
						disabled={count.total <= 1}
					/>
					<FindReplaceTooltipButton
						title={this.findPrevious}
						icon={ChevronUpIcon}
						iconLabel={this.findPrevious}
						keymapDescription={'Shift Enter'}
						onClick={this.handleFindPrevClick}
						disabled={count.total <= 1}
					/>
					<FindReplaceTooltipButton
						title={this.closeFindReplaceDialog}
						icon={EditorCloseIcon}
						iconLabel={this.closeFindReplaceDialog}
						keymapDescription={'Escape'}
						onClick={this.clearSearch}
					/>
				</div>
			);
		}
	}
}

export default injectIntl(Find);
