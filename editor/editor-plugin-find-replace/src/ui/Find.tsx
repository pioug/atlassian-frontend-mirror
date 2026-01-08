/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import debounce from 'lodash/debounce';
import rafSchd from 'raf-schd';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { findReplaceMessages as messages } from '@atlaskit/editor-common/messages';
import { Label } from '@atlaskit/form';
import TextLetterCaseIcon from '@atlaskit/icon-lab/core/text-letter-case';
import MatchCaseIcon from '@atlaskit/icon/core/text-style';
import type { IconProps } from '@atlaskit/icon/types';
import Textfield from '@atlaskit/textfield';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { MatchCaseProps } from '../types';

import { FindReplaceTooltipButton } from './FindReplaceTooltipButton';
import {
	afterInputSection,
	countStyles,
	countStylesAlternateStyles,
	matchCaseSection,
	sectionWrapperStyles,
	sectionWrapperStylesAlternate,
	textFieldWrapper,
} from './ui-styles';

export const FIND_DEBOUNCE_MS = 100;

export type FindProps = {
	count: { index: number; total: number };
	findText?: string;
	findTyped: boolean;
	onArrowDown: () => void;
	onCancel: ({
		triggerMethod,
	}: {
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.TOOLBAR | TRIGGER_METHOD.BUTTON;
	}) => void;
	onFind: (findText?: string) => void;
	onFindBlur: () => void;
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
	setFindTyped: (value: boolean) => void;
	shouldFocus: boolean;
} & MatchCaseProps;

type State = {
	localFindText: string;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
class Find extends React.Component<FindProps & WrappedComponentProps, State> {
	private findTextfieldRef = React.createRef<HTMLInputElement>();
	private isComposing = false;

	private find: string;
	private noResultsFound: string;
	private matchCase: string;

	constructor(props: FindProps & WrappedComponentProps) {
		super(props);

		const {
			intl: { formatMessage },
		} = props;

		this.find = formatMessage(messages.find);
		this.noResultsFound = formatMessage(messages.noResultsFound);
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
			// Wait for findTextfieldRef to become available then focus
			setTimeout(() => {
				this.focusFindTextfield();
			}, 100);
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
		if (this.props.findText !== prevProps.findText && this.props.shouldFocus) {
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

	handleFindNextClick = () => {
		if (this.isComposing) {
			return;
		}
		this.props.onFindNext({ triggerMethod: TRIGGER_METHOD.BUTTON });
	};

	handleFindPrevClick = () => {
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

	handleMatchCaseClick = () => {
		if (this.props.onToggleMatchCase) {
			this.props.onToggleMatchCase();
			this.props.onFind(this.props.findText);
		}
	};

	matchCaseIconEle = (iconProps: IconProps) => {
		return expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true) ? (
			<TextLetterCaseIcon label={iconProps.label} size="small" />
		) : (
			<MatchCaseIcon label={this.matchCase} />
		);
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

		const elemAfterInput = (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<div css={afterInputSection}>
				<div aria-live="polite">
					{findText && (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						<span data-testid="textfield-count" css={[countStyles, countStylesAlternateStyles]}>
							{count.total === 0 ? this.noResultsFound : resultsCount}
						</span>
					)}
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<div css={matchCaseSection}>
					<FindReplaceTooltipButton
						title={this.matchCase}
						appearance="default"
						icon={this.matchCaseIconEle}
						iconLabel={this.matchCase}
						onClick={this.handleMatchCaseClick}
						isPressed={shouldMatchCase}
					/>
				</div>
			</div>
		);

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<div css={[sectionWrapperStyles, sectionWrapperStylesAlternate]}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<div css={textFieldWrapper}>
					<Label htmlFor="find-text-field">{this.find}</Label>
					<Textfield
						name="find"
						id="find-text-field"
						testId="find-field"
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
	}
}

export default injectIntl(Find);
