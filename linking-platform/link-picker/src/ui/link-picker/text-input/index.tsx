/** @jsx jsx */
import {
	Fragment,
	type KeyboardEvent,
	type MouseEvent,
	type MutableRefObject,
	useCallback,
	useRef,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { ErrorMessage, Field } from '@atlaskit/form';
import Selectclear from '@atlaskit/icon/glyph/select-clear';
import { Pressable, xcss } from '@atlaskit/primitives';
import Textfield, { type TextFieldProps } from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import {
	ConditionalSpotlightTargetWrapper,
	type ConditionalSpotlightTargetWrapperProps,
} from './conditional-spotlight-target-wrapper';
import { isRedoEvent, isUndoEvent } from './utils';

/**
 * Overidding text input margin top which design system provides as a default spacer
 * but it gets in the way of our layout
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const fieldStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		marginTop: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'& + &': {
		marginTop: token('space.200', '16px'),
	},
});

export type TextInputProps = Omit<TextFieldProps, 'name' | 'value'> &
	Pick<ConditionalSpotlightTargetWrapperProps, 'spotlightTargetName'> & {
		name: string;
		value: string;
		label?: string;
		// overrides default browser undo behaviour (cmd/ctrl + z) with that function
		onUndo?: Function;
		// overrides default browser redo behaviour (cm + shift + z / ctrl + y) with that function
		onRedo?: Function;
		onClear?: (name: string) => void;
		clearLabel?: string;
		error?: string | null;
	};

export const testIds = {
	urlError: 'link-error',
	clearUrlButton: 'clear-text',
};
const clearTextButtonStyles = xcss({
	padding: 'space.0',
	marginRight: 'space.050',
	backgroundColor: 'color.background.neutral.subtle',
	border: 'none',
});

export const TextInput = ({
	name,
	label,
	autoFocus,
	onRedo,
	onUndo,
	onKeyDown,
	onClear,
	clearLabel,
	error,
	spotlightTargetName,
	...restProps
}: TextInputProps) => {
	const inputRef: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

	const handleRef = useCallback(
		(input: HTMLInputElement | null) => {
			if (input) {
				inputRef.current = input;
				if (autoFocus) {
					// Need this to prevent jumping when we render TextInput inside Portal @see ED-2992
					input.focus({ preventScroll: true });
				}
			}
		},
		[autoFocus],
	);

	const handleKeydown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (typeof onUndo === 'function' && isUndoEvent(e)) {
				e.preventDefault();
				onUndo();
			} else if (typeof onRedo === 'function' && isRedoEvent(e)) {
				e.preventDefault();
				onRedo();
			}

			if (onKeyDown) {
				onKeyDown(e);
			}
		},
		[onUndo, onRedo, onKeyDown],
	);

	const handleClear = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			e.stopPropagation();
			onClear?.(name);
			inputRef.current?.focus();
		},
		[name, onClear],
	);

	const clearText = restProps.value !== '' && (
		<Tooltip content={clearLabel}>
			<Pressable xcss={clearTextButtonStyles} onClick={handleClear} testId={testIds.clearUrlButton}>
				<Selectclear
					size="medium"
					label={clearLabel || ''}
					primaryColor={token('color.icon.subtle')}
				/>
			</Pressable>
		</Tooltip>
	);

	return (
		<div css={fieldStyles}>
			<Field label={label} name={name}>
				{({ fieldProps }) => {
					return (
						<ConditionalSpotlightTargetWrapper spotlightTargetName={spotlightTargetName}>
							<Fragment>
								<Textfield
									{...fieldProps}
									{...restProps}
									onKeyDown={handleKeydown}
									ref={handleRef}
									elemAfterInput={clearText}
									isInvalid={!!error}
								/>
								{error && <ErrorMessage testId={testIds.urlError}>{error}</ErrorMessage>}
							</Fragment>
						</ConditionalSpotlightTargetWrapper>
					);
				}}
			</Field>
		</div>
	);
};
