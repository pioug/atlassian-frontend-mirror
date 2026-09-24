/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl';

import type { DispatchAnalyticsEvent, TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { findReplaceMessages as messages } from '@atlaskit/editor-common/messages';

import type { MatchCaseProps } from '../types';
import Find from './Find';
import Replace from './Replace';
import { ruleStyles, wrapperPaddingStyles, wrapperStyles } from './ui-styles';

// Magic number taken from ./FindReplaceToolbarButton.tsx
const dropdownWidth = 382;

// Without replace the find row is the widest row, so the popup would size to it and
// change width as the match counter appears. Pin it to the width the dropdown reserves.
const findOnlyWidthStyles = css({
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${dropdownWidth}px`,
	maxWidth: '100%',
});

export type FindReplaceProps = {
	/**
	 * When `false`, the dialog offers find only: the replace label, field, replacement
	 * count message and both replace buttons are not rendered.
	 */
	allowReplace?: boolean;
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

	setFindTyped = (value: boolean): void => {
		this.setState({ findTyped: value });
	};

	setFindTextfieldRef = (findTextfieldRef: React.RefObject<HTMLInputElement>): void => {
		this.findTextfield = findTextfieldRef.current;
	};

	setReplaceTextfieldRef = (replaceTextfieldRef: React.RefObject<HTMLInputElement>): void => {
		this.replaceTextfield = replaceTextfieldRef.current;
	};

	setFocusToFind = (): void => {
		if (this.findTextfield) {
			this.findTextfield.focus();
		}
	};

	setFocusToReplace = (): void => {
		if (this.replaceTextfield) {
			this.replaceTextfield.focus();
		}
	};

	render(): jsx.JSX.Element {
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
			allowReplace = true,
		} = this.props;

		const focusToolbarButton = this.props.focusToolbarButton || (() => {});

		return (
			<div
				role={'dialog'}
				aria-label={intl?.formatMessage(
					allowReplace ? messages.findReplaceDialogAriaLabel : messages.findDialogAriaLabel,
				)}
				aria-modal={false}
				ref={this.modalRef}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={[wrapperStyles, wrapperPaddingStyles, !allowReplace && findOnlyWidthStyles]}
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
				{allowReplace && (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					<hr role="presentation" css={ruleStyles} id="replace-hr-element" />
				)}
				<Replace
					allowReplace={allowReplace}
					canReplace={!!isReplaceable}
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
