/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useContext, useEffect, useRef, useState } from 'react';

import { css, cssMap, jsx } from '@atlaskit/css';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { FieldId } from './field-id-context';

// Extracted styles for character counter message container
const messageContainerStyles = cssMap({
	root: {
		color: token('color.text.danger', '#AE2A19'),
		font: token('font.body.UNSAFE_small'),
		marginBlockStart: token('space.050', '4px'),
	},
});

// Extracted styles for error icon wrapper, need to use css to override the default height
const errorIconWrapperStyles = css({
	display: 'flex',
	height: '16px',
	alignItems: 'center',
});

// Error icon with wrapper for character count violations
const ErrorIconWithWrapper = () => (
	<span css={errorIconWrapperStyles}>
		<ErrorIcon label="error" size="small" />
	</span>
);

export interface CharacterCounterProps {
	/**
	 * Maximum number of characters allowed (optional)
	 */
	maxCharacters?: number;
	/**
	 * Minimum number of characters required (optional)
	 */
	minCharacters?: number;
	/**
	 * Current value of the input field
	 */
	currentValue?: string;
	/**
	 * Optional custom message to display when character limit is exceeded
	 */
	overMaximumMessage?: string;
	/**
	 * Optional custom message to display when character limit is not exceeded
	 */
	underMaximumMessage?: string;
	/**
	 * Optional custom message to display when minimum character requirement is not met
	 */
	underMinimumMessage?: string;
	/**
	 * Whether to style violations as errors (red text + icon).
	 * By default, violations are automatically styled as errors.
	 *
	 * In forms, set this to false to suppress error styling when
	 * the form hasn't flagged an error yet (e.g., field not touched).
	 *
	 * // Standalone: smart default (violations = errors)
	 * <CharacterCounter currentValue={value} maxCharacters={100} />
	 *
	 * // Form: align with final-form error state
	 * <CharacterCounter
	 *   currentValue={value}
	 *   maxCharacters={100}
	 *   shouldShowAsError={isCharacterCountViolation}
	 * />
	 */
	shouldShowAsError?: boolean;
	/**
	 * ID of the associated input for accessibility.
	 * Not needed if the character counter is used within CharacterCounterField.
	 * When provided, the character counter will have an ID of `${inputId}-character-counter`
	 * which should be referenced in the input's `aria-describedby` attribute.
	 * If not provided, will attempt to use InputId context from Form.
	 */
	inputId?: string;
	/**
	 * A testId prop is provided for specified elements, which is a unique string
	 * that appears as a data attribute data-testid in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
}

// Helper to pluralise "character(s)"
const pluralize = (count: number) => `character${count !== 1 ? 's' : ''}`;

/**
 * __Character Counter__
 *
 * A character counter component that displays remaining characters for text input.
 * Displays messages for over or under the maximum or minimum character limits.
 */
const CharacterCounter = ({
	maxCharacters,
	minCharacters,
	currentValue,
	overMaximumMessage,
	underMaximumMessage,
	underMinimumMessage,
	shouldShowAsError = true,
	inputId,
	testId,
}: CharacterCounterProps) => {
	const [announcementText, setAnnouncementText] = useState('');
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Resolve the field ID from context (form use) or inputId prop (standalone use)
	const contextFieldId = useContext(FieldId);
	const resolvedFieldId = contextFieldId || inputId;

	const currentLength = currentValue?.length || 0;

	// Check if character count violates limits
	const isTooShort = minCharacters !== undefined && currentLength < minCharacters;
	const isTooLong = maxCharacters !== undefined && currentLength > maxCharacters;

	// Determine what to display based on the current value, the maximum and minimum character limits, and any custom messages
	const getMessage = (): string | null => {
		// Below minimum so show custom message or default
		if (isTooShort) {
			const needed = minCharacters! - currentLength;
			return underMinimumMessage || `${needed} more ${pluralize(needed)} needed`;
		}

		// Over maximum so show custom message or default
		if (isTooLong) {
			const over = currentLength - maxCharacters!;
			return overMaximumMessage || `${over} ${pluralize(over)} too many`;
		}

		// Within limits - show remaining count (if max is defined)
		if (maxCharacters) {
			const remaining = maxCharacters! - currentLength;
			return underMaximumMessage || `${remaining} ${pluralize(remaining)} remaining`;
		}

		// No message to show (min only limit satisfied)
		return null;
	};

	const displayText = getMessage();

	// Determine if the current character count violates limits
	const displayAsError = (isTooShort || isTooLong) && shouldShowAsError;

	// Debounce screen reader announcements so that it only reads the message when it input has settled
	useEffect(() => {
		// Debounce by 1 second to avoid announcing every keystroke
		debounceTimeoutRef.current = setTimeout(() => {
			setAnnouncementText(displayText || '');
		}, 1000);

		// Cleanup function clears the timeout when displayText changes or component unmounts
		return () => {
			clearTimeout(debounceTimeoutRef.current!);
		};
	}, [displayText]);

	// Don't render if there's no message to display (min only limit satisfied)
	if (!displayText) {
		return null;
	}

	return (
		<Flex testId={testId}>
			<Flex gap="space.075" xcss={messageContainerStyles.root}>
				{displayAsError && <ErrorIconWithWrapper />}
				<Text
					color={displayAsError ? 'color.text.danger' : 'color.text.subtlest'}
					size="small"
					id={resolvedFieldId ? `${resolvedFieldId}-character-counter` : undefined}
				>
					{displayText}
				</Text>
			</Flex>
			{/* Screen reader announcements with debounced updates */}
			<VisuallyHidden>
				<div aria-live="polite">{announcementText}</div>
			</VisuallyHidden>
		</Flex>
	);
};

export default CharacterCounter;
