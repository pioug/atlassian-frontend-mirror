import React, { useState, useRef, useEffect } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	TRIGGER_METHOD,
} from '@atlaskit/editor-common/analytics';
import { findReplaceMessages as messages } from '@atlaskit/editor-common/messages';
import { ValidMessage } from '@atlaskit/form';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down--hipchat-chevron-down';
import ChevronUpIcon from '@atlaskit/icon/core/migration/chevron-up--hipchat-chevron-up';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Text, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { FindReplaceTooltipButton } from './FindReplaceTooltipButton';

const replaceContainerStyles = xcss({
	padding: 'space.100',
});

const replaceWithLabelStyle = xcss({
	paddingBottom: 'space.050',
});

const actionButtonContainerStyles = xcss({
	paddingTop: 'space.200',
});

const actionButtonParentInlineStyles = xcss({
	justifyContent: 'space-between',
	flexDirection: 'row-reverse',
});

const actionButtonParentInlineStylesNew = xcss({
	justifyContent: 'space-between',
	flexDirection: 'row-reverse',
	flexWrap: 'wrap',
});

const actionButtonInlineStyles = xcss({
	gap: 'space.075',
});

const closeButtonInlineStyles = xcss({
	marginRight: 'auto',
});

export type ReplaceProps = {
	canReplace: boolean;
	replaceText?: string;
	onReplace: ({
		triggerMethod,
		replaceText,
	}: {
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
		replaceText: string;
	}) => void;
	onReplaceAll: ({ replaceText }: { replaceText: string }) => void;
	onReplaceTextfieldRefSet: (ref: React.RefObject<HTMLInputElement>) => void;
	onArrowUp: () => void;
	onCancel: ({
		triggerMethod,
	}: {
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.TOOLBAR | TRIGGER_METHOD.BUTTON;
	}) => void;
	count: {
		index: number;
		total: number;
		totalReplaceable?: number;
	};
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
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	setFindTyped: (value: boolean) => void;
	findTyped: boolean;
	focusToolbarButton: () => void;
};

const Replace = ({
	canReplace,
	replaceText: initialReplaceText,
	onReplace,
	onReplaceAll,
	onReplaceTextfieldRefSet,
	onArrowUp,
	onCancel,
	count,
	onFindNext,
	onFindPrev,
	dispatchAnalyticsEvent,
	setFindTyped,
	findTyped,
	focusToolbarButton,
	intl: { formatMessage },
}: ReplaceProps & WrappedComponentProps) => {
	const [replaceText, setReplaceText] = useState(initialReplaceText || '');
	const [isComposing, setIsComposing] = useState(false);
	const [isHelperMessageVisible, setIsHelperMessageVisible] = useState(false);
	const [fakeSuccessReplacementMessageUpdate, setFakeSuccessReplacementMessageUpdate] =
		useState(false);
	const [replaceCount, setReplaceCount] = useState(0);

	const replaceTextfieldRef = useRef<HTMLInputElement>(null);
	const successReplacementMessageRef = useRef<HTMLDivElement>(null);

	const replaceWith = formatMessage(messages.replaceWith);
	const replaceAll = formatMessage(messages.replaceAll);
	const findPrevious = formatMessage(messages.findPrevious);
	const closeFindReplaceDialog = formatMessage(messages.closeFindReplaceDialog);

	useEffect(() => {
		onReplaceTextfieldRefSet(replaceTextfieldRef);
	}, [onReplaceTextfieldRefSet]);

	useEffect(() => {
		setReplaceText(initialReplaceText || '');
	}, [initialReplaceText]);

	const skipWhileComposing = (fn: () => void) => {
		if (!isComposing) {
			fn();
		}
	};

	const triggerSuccessReplacementMessageUpdate = (currentReplaceCount: number) => {
		if (replaceCount === currentReplaceCount) {
			setFakeSuccessReplacementMessageUpdate(!fakeSuccessReplacementMessageUpdate);
		}
		if (successReplacementMessageRef.current) {
			const ariaLiveRegion =
				successReplacementMessageRef.current.querySelector('[aria-live="polite"]');
			ariaLiveRegion?.removeAttribute('aria-live');
			ariaLiveRegion?.setAttribute('aria-live', 'polite');
		}
	};

	const handleReplaceClick = () =>
		skipWhileComposing(() => {
			onReplace({ triggerMethod: TRIGGER_METHOD.BUTTON, replaceText });
			triggerSuccessReplacementMessageUpdate(1);
			setIsHelperMessageVisible(true);
			setReplaceCount(1);
			setFindTyped(false);
		});

	const handleReplaceChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		skipWhileComposing(() => {
			updateReplaceValue(event.target.value);
		});

	const updateReplaceValue = (text: string) => {
		if (dispatchAnalyticsEvent) {
			dispatchAnalyticsEvent({
				eventType: EVENT_TYPE.TRACK,
				action: ACTION.CHANGED_REPLACEMENT_TEXT,
				actionSubject: ACTION_SUBJECT.FIND_REPLACE_DIALOG,
			});
		}
		setReplaceText(text);
	};

	const handleReplaceKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) =>
		skipWhileComposing(() => {
			if (event.key === 'Enter') {
				onReplace({ triggerMethod: TRIGGER_METHOD.KEYBOARD, replaceText });
			} else if (event.key === 'ArrowUp') {
				onArrowUp();
			}
		});

	const handleReplaceAllClick = () =>
		skipWhileComposing(() => {
			onReplaceAll({ replaceText });
			setIsHelperMessageVisible(true);
			if (
				count.totalReplaceable &&
				expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true)
			) {
				triggerSuccessReplacementMessageUpdate(count.totalReplaceable);
				setReplaceCount(count.totalReplaceable);
			} else {
				triggerSuccessReplacementMessageUpdate(count.total);
				setReplaceCount(count.total);
			}
			setFindTyped(false);
		});

	const handleCompositionStart = () => {
		setIsComposing(true);
	};

	const handleCompositionEnd = (event: React.CompositionEvent<HTMLInputElement>) => {
		setIsComposing(false);
		updateReplaceValue(event.currentTarget.value);
	};

	const clearSearch = () => {
		onCancel({ triggerMethod: TRIGGER_METHOD.BUTTON });
		focusToolbarButton();
	};

	const handleFindNextClick = () => {
		if (!isComposing) {
			onFindNext({ triggerMethod: TRIGGER_METHOD.BUTTON });
		}
	};

	const handleFindPrevClick = () => {
		if (!isComposing) {
			onFindPrev({ triggerMethod: TRIGGER_METHOD.BUTTON });
		}
	};

	const resultsReplace = formatMessage(messages.replaceSuccess, {
		numberOfMatches: replaceCount,
	});

	return (
		<Box xcss={replaceContainerStyles}>
			<Box xcss={replaceWithLabelStyle}>
				<Text id="replace-text-field-label" size="medium" weight="bold" color="color.text.subtle">
					{replaceWith}
				</Text>
			</Box>
			<Textfield
				name="replace"
				aria-labelledby="replace-text-field-label"
				testId="replace-field"
				appearance="standard"
				defaultValue={replaceText}
				ref={replaceTextfieldRef}
				autoComplete="off"
				onChange={handleReplaceChange}
				onKeyDown={handleReplaceKeyDown}
				onCompositionStart={handleCompositionStart}
				onCompositionEnd={handleCompositionEnd}
			/>
			{isHelperMessageVisible && !findTyped && (
				<div ref={successReplacementMessageRef}>
					<ValidMessage testId="message-success-replacement">
						{fakeSuccessReplacementMessageUpdate
							? // @ts-ignore - TS1501 TypeScript 5.9.2 upgrade
								resultsReplace.replace(/ /u, '\u00a0')
							: resultsReplace}
					</ValidMessage>
				</div>
			)}
			<Box xcss={actionButtonContainerStyles}>
				<Inline
					xcss={
						expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true) &&
						fg('platform_editor_find_and_replace_improvements_1')
							? [actionButtonInlineStyles, actionButtonParentInlineStylesNew]
							: [actionButtonInlineStyles, actionButtonParentInlineStyles]
					}
				>
					<Inline xcss={actionButtonInlineStyles}>
						<FindReplaceTooltipButton
							title={formatMessage(messages.findNext)}
							icon={(iconProps) => <ChevronDownIcon label={iconProps.label} size="small" />}
							iconLabel={formatMessage(messages.findNext)}
							keymapDescription={'Enter'}
							onClick={handleFindNextClick}
							disabled={count.total <= 1}
						/>
						<FindReplaceTooltipButton
							title={findPrevious}
							icon={(iconProps) => <ChevronUpIcon label={iconProps.label} size="small" />}
							iconLabel={findPrevious}
							keymapDescription={'Shift Enter'}
							onClick={handleFindPrevClick}
							disabled={count.total <= 1}
						/>
						<Button
							testId={'Replace'}
							id="replace-button"
							onClick={handleReplaceClick}
							isDisabled={!canReplace}
						>
							{formatMessage(messages.replace)}
						</Button>
						<Button
							appearance="primary"
							testId={replaceAll}
							id="replaceAll-button"
							onClick={handleReplaceAllClick}
							isDisabled={
								expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true)
									? count.totalReplaceable === 0
									: !canReplace
							}
						>
							{replaceAll}
						</Button>
					</Inline>
					{expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true) &&
					fg('platform_editor_find_and_replace_improvements_1') ? (
						<Inline xcss={closeButtonInlineStyles}>
							<Button appearance="subtle" testId={closeFindReplaceDialog} onClick={clearSearch}>
								{closeFindReplaceDialog}
							</Button>
						</Inline>
					) : (
						<Button appearance="subtle" testId={closeFindReplaceDialog} onClick={clearSearch}>
							{closeFindReplaceDialog}
						</Button>
					)}
				</Inline>
			</Box>
		</Box>
	);
};

export default injectIntl(Replace);
