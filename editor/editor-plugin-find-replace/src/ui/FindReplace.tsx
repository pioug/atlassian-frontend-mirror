/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';

import type { DispatchAnalyticsEvent, TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { findReplaceMessages as messages } from '@atlaskit/editor-common/messages';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { MatchCaseProps } from '../types';

import Find from './Find';
import Replace from './Replace';
import { ruleStyles, wrapperPaddingStyles, wrapperStyles } from './ui-styles';

export type FindReplaceProps = {
	count: { index: number; total: number; totalReplaceable?: number };
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	findText?: string;
	focusToolbarButton?: () => void;
	intl?: IntlShape;
	isReplaceable?: boolean;
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
	onReplace: ({
		triggerMethod,
		replaceText,
	}: {
		replaceText: string;
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
	}) => void;
	onReplaceAll: ({ replaceText }: { replaceText: string }) => void;
	replaceText?: string;
	shouldFocus: boolean;
} & MatchCaseProps;
// eslint-disable-next-line @repo/internal/react/no-class-components
class FindReplace extends React.PureComponent<FindReplaceProps> {
	private findTextfield: HTMLInputElement | null = null;
	private replaceTextfield?: HTMLInputElement | null = null;
	private modalRef: React.RefObject<HTMLDivElement>;

	constructor(props: FindReplaceProps) {
		super(props);
		this.modalRef = React.createRef();
	}

	state = { findTyped: false };

	setFindTyped = (value: boolean) => {
		this.setState({ findTyped: value });
	};

	setFindTextfieldRef = (findTextfieldRef: React.RefObject<HTMLInputElement>) => {
		this.findTextfield = findTextfieldRef.current;
	};

	setReplaceTextfieldRef = (replaceTextfieldRef: React.RefObject<HTMLInputElement>) => {
		this.replaceTextfield = replaceTextfieldRef.current;
	};

	setFocusToFind = () => {
		if (this.findTextfield) {
			this.findTextfield.focus();
		}
	};

	setFocusToReplace = () => {
		if (this.replaceTextfield) {
			this.replaceTextfield.focus();
		}
	};

	render() {
		const {
			findText,
			count,
			isReplaceable,
			shouldFocus,
			onFind,
			onFindBlur,
			onFindNext,
			onFindPrev,
			onCancel,
			replaceText,
			onReplace,
			onReplaceAll,
			dispatchAnalyticsEvent,
			allowMatchCase,
			shouldMatchCase,
			onToggleMatchCase,
			intl,
		} = this.props;

		const focusToolbarButton = this.props.focusToolbarButton || (() => {});

		return (
			<div
				role={'dialog'}
				aria-label={fg('platform_editor_dec_a11y_fixes')
					? intl?.formatMessage(messages.findReplaceDialogAriaLabel)
					: 'Find and Replace'}
				aria-modal={false}
				ref={this.modalRef}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={[wrapperStyles, wrapperPaddingStyles]}
			>
				<Find
					allowMatchCase={allowMatchCase}
					shouldMatchCase={shouldMatchCase}
					onToggleMatchCase={onToggleMatchCase}
					findText={findText}
					count={count}
					shouldFocus={shouldFocus}
					onFind={onFind}
					onFindBlur={onFindBlur}
					onFindPrev={onFindPrev}
					onFindNext={onFindNext}
					onFindTextfieldRefSet={this.setFindTextfieldRef}
					onCancel={onCancel}
					onArrowDown={this.setFocusToReplace}
					findTyped={this.state.findTyped}
					setFindTyped={this.setFindTyped}
				/>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<hr role="presentation" css={ruleStyles} id="replace-hr-element" />
				{/* Delete the Replace element and rename ReplaceNext to Replace
						on cleanup of editor_a11y_refactor_find_replace_style */}
				<Replace
					canReplace={
						expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true)
							? !!isReplaceable
							: count.total > 0
					}
					replaceText={replaceText}
					onReplace={onReplace}
					onReplaceAll={onReplaceAll}
					onReplaceTextfieldRefSet={this.setReplaceTextfieldRef}
					onArrowUp={this.setFocusToFind}
					onCancel={onCancel}
					count={count}
					onFindPrev={onFindPrev}
					onFindNext={onFindNext}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					findTyped={this.state.findTyped}
					setFindTyped={this.setFindTyped}
					focusToolbarButton={focusToolbarButton}
				/>
			</div>
		);
	}
}

export default FindReplace;
