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
import { jsx } from '@emotion/react';

import { ErrorMessage, Field } from '@atlaskit/form';
import Selectclear from '@atlaskit/icon/glyph/select-clear';
import Textfield, { type TextFieldProps } from '@atlaskit/textfield';
import Tooltip from '@atlaskit/tooltip';

import {
	ConditionalSpotlightTargetWrapper,
	type ConditionalSpotlightTargetWrapperProps,
} from './conditional-spotlight-target-wrapper';
import { clearTextButtonStyles, fieldStyles } from './styled';
import { isRedoEvent, isUndoEvent } from './utils';

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
			<button
				type="button"
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={clearTextButtonStyles}
				onClick={handleClear}
				data-testid={testIds.clearUrlButton}
			>
				<Selectclear size="medium" label={clearLabel || ''} />
			</button>
		</Tooltip>
	);

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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
