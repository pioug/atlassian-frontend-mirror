/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	forwardRef,
	type Ref,
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
} from 'react';

import { jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import { cssMap } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { token } from '@atlaskit/tokens';

import { useAnimatedVisibility } from '../internal/use-animated-visibility';
import { useFocusWrap } from '../internal/use-focus-wrap';

import { type TDialogProps } from './types';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- dialog reset requires values not in cssMap's type union
const styles = cssMap({
	dialog: {
		// Reset browser defaults
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
		border: 'none',
		// @ts-expect-error -- cssMap types do not include 'none'
		maxWidth: 'none',
		// @ts-expect-error -- cssMap types do not include 'none'
		maxHeight: 'none',
		// Positioning
		margin: 'auto',
		// Override UA background: canvas — the dialog primitive is unopinionated;
		// consumers provide their own background on a child element.
		backgroundColor: 'transparent',
		// Backdrop
		'&::backdrop': {
			// @ts-expect-error -- cssMap types do not include blanket token
			backgroundColor: token('color.blanket'),
		},
	},
});

/**
 * Low-level `<dialog>` primitive. No visual opinions — no width, height,
 * background, border-radius, or layout. Consumers provide their own styling.
 *
 * Visibility is controlled declaratively via `isOpen`:
 * - `isOpen={true}` calls `.showModal()` (entry animation via `@starting-style`)
 * - `isOpen={false}` calls `.close()` (exit animation via `allow-discrete`)
 *
 * Handles native `cancel` event (Escape) and backdrop click detection.
 *
 * Close flow: we never call `dialog.close()` from event handlers. We always call
 * `onClose`; the consumer decides whether to set `isOpen={false}`.
 */
export const Dialog: React.ForwardRefExoticComponent<TDialogProps & React.RefAttributes<HTMLDialogElement>> = forwardRef<HTMLDialogElement, TDialogProps>(function Dialog(
	{
		children,
		isOpen,
		onClose,
		onExitFinish,
		animate,
		style,
		testId,
		id: providedId,
		label,
		labelledBy,
		shouldHideBackdrop,
	}: TDialogProps,
	ref,
) {
	const generatedId = useId();
	const dialogId = providedId ?? generatedId;
	const ownRef = useRef<HTMLDialogElement>(null);
	const combinedRef = mergeRefs([ownRef, ref as Ref<HTMLDialogElement>]);

	// ── Animation lifecycle ──
	const { showChildren, preset } = useAnimatedVisibility({
		isOpen,
		animate,
		elementRef: ownRef,
		onExitFinish,
	});

	// ── Focus wrap ──
	// Native <dialog>.showModal() traps focus but wraps through <body> at
	// the boundary (A → B → C → body → A). This hook intercepts Tab to
	// wrap directly (A → B → C → A), matching the WAI-ARIA APG pattern.
	useFocusWrap({ elementRef: ownRef, role: 'dialog' });

	// Show/hide the dialog in response to isOpen changes.
	useLayoutEffect(() => {
		const dialog = ownRef.current;
		if (!dialog) {
			return;
		}

		if (isOpen) {
			if (!dialog.open) {
				dialog.showModal();
			}
			return () => {
				if (dialog.open) {
					dialog.close();
				}
			};
		}

		if (dialog.open) {
			dialog.close();
		}

	}, [isOpen]);

	// ── Handle native Escape (cancel event) ──
	const handleCancel = useCallback(
		(event: React.SyntheticEvent<HTMLDialogElement>) => {
			event.preventDefault();
			onClose({ reason: 'escape' });
		},
		[onClose],
	);

	// ── Handle backdrop click ──
	// Attached via bind-event-listener rather than a React prop so we avoid
	// a11y lint suppressions on the <dialog> element.
	// Keyboard dismiss is already handled natively (Escape → onCancel above).
	useEffect(() => {
		const dialog = ownRef.current;
		if (!dialog) {
			return;
		}

		return bind(dialog, {
			type: 'click',
			listener(event) {
				if (event.target === event.currentTarget) {
					onClose({ reason: 'overlay-click' });
				}
			},
		});
	}, [onClose]);

	// Atomic CSS (Compiled) deduplicates ::backdrop { background-color }
	// into a single class, making it impossible to toggle between two values
	// via cssMap entries. An ID-scoped <style> has higher specificity than
	// any atomic class, so the override always wins.
	const escapedId = CSS.escape(dialogId);

	return (
		<dialog
			ref={combinedRef}
			id={dialogId}
			aria-label={label}
			aria-labelledby={label ? undefined : labelledBy}
			css={styles.dialog}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={style}
			onCancel={handleCancel}
			data-testid={testId}
			{...(preset ? { [`data-ds-${preset.name}`]: '' } : undefined)}
		>
		{/* Use an ID-scoped <style> to make the backdrop transparent because
			atomic CSS (Compiled) deduplicates the ::backdrop rule into a single
			shared class — so we can't conditionally override it with cssMap.
			The ID selector has higher specificity and always wins. */}
		{shouldHideBackdrop && (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
			<style>{`#${escapedId}::backdrop{background-color:transparent}`}</style>
		)}
		{showChildren ? children : null}
	</dialog>
	);
});
