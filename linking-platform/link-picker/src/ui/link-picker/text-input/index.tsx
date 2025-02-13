/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	Fragment,
	type KeyboardEvent,
	type MouseEvent,
	type MutableRefObject,
	useCallback,
	useRef,
} from 'react';

import { css, jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { ErrorMessage, Field } from '@atlaskit/form';
import Selectclear from '@atlaskit/icon/core/migration/cross-circle--select-clear';
import { fg } from '@atlaskit/platform-feature-flags';
import { Pressable } from '@atlaskit/primitives/compiled';
import Textfield, { type TextFieldProps } from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import {
	ConditionalSpotlightTargetWrapper,
	type ConditionalSpotlightTargetWrapperProps,
} from './conditional-spotlight-target-wrapper';
import { TextInputOld } from './old';
import { isRedoEvent, isUndoEvent } from './utils';

const styles = cssMap({
	clearTextButton: {
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		marginRight: token('space.050'),
		backgroundColor: token('color.background.neutral.subtle'),
		border: 'none',
		verticalAlign: 'middle',
	},
});

/**
 * Overriding text input margin top which design system provides as a default spacer
 * but it gets in the way of our layout
 */
const baseFieldStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		marginTop: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'& + &': {
		marginTop: token('space.200', '16px'),
	},
});

const newFieldStyles = css({
	font: token('font.heading.xxsmall'),
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

export const TextInputNew = ({
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
			<Pressable
				xcss={styles.clearTextButton}
				onClick={handleClear}
				testId={testIds.clearUrlButton}
			>
				<Selectclear
					LEGACY_size="medium"
					label={clearLabel || ''}
					color={token('color.icon.subtle')}
					spacing="spacious"
				/>
			</Pressable>
		</Tooltip>
	);

	return (
		<div css={[baseFieldStyles, fg('platform-linking-visual-refresh-v1') && newFieldStyles]}>
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

export const TextInput = (props: TextInputProps) => {
	if (fg('platform_bandicoots-link-picker-css')) {
		return <TextInputNew {...props} />;
	}
	return <TextInputOld {...props} />;
};
