/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useId, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { flushSync } from 'react-dom';

import Button from '@atlaskit/button/new';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

import { type SkipLinkData } from '../../context/skip-links/types';

import { focusElement } from './focus-element';
import { SkipLink } from './skip-link';

const contentStyles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
		paddingBlock: token('space.100'),
		paddingInline: token('space.200'),
		zIndex: 'calc(infinity)',
	},
	skipLinkList: {
		display: 'flex',
		flexDirection: 'column',
		listStylePosition: 'outside',
		listStyleType: 'none',
		marginBlockStart: token('space.0'),
		paddingInlineStart: token('space.0'),
	},
	label: {
		font: token('font.heading.xxsmall'),
		color: token('color.text.subtle'),
		paddingBlock: token('space.100'),
	},
});

const triggerStyles = cssMap({
	root: {
		position: 'fixed',
		insetInlineStart: token('space.150'),
		insetBlockStart: token('space.150'),
		zIndex: -1,
		opacity: 0,
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small'),
		borderStyle: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(:focus-visible)': {
			zIndex: 'calc(infinity)',
			opacity: 1,
		},
	},
	// When open we hide and push the trigger up, so the popup is now in the top left.
	isOpen: {
		opacity: 0,
		transform: 'translateY(-100%)',
	},
});

const popupOffset: [number, number] = [0, 0];

/**
 * Skip links shown behind `platform_dst_nav4_skip_link_a11y_1`: a single focus-revealed
 * control opens a dialog listing skip targets.
 */
export function SkipLinksPopup({
	label: title,
	triggerLabel,
	testId,
	links,
}: {
	label: string;
	triggerLabel: string;
	testId?: string;
	links: Array<SkipLinkData>;
}): JSX.Element {
	const titleId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLDivElement>(null);

	const openPopup = useCallback(() => {
		setIsOpen(true);
	}, []);

	/**
	 * Closes the popup.
	 *
	 * Uses `flushSync` to avoid issues with focus management.
	 * This ensures the popup's focus lock is fully released by the time skip links or our `onClose` try to move focus.
	 */
	const closePopup = useCallback(() => {
		flushSync(() => {
			setIsOpen(false);
		});
	}, []);

	/**
	 * Restores focus to the trigger on close, if it hasn't moved to another element, such as when Esc is pressed instead of a skip link.
	 *
	 * We need this because using the standard `shouldReturnFocus` on the popup would break the skip link focus behaviour,
	 * as focus would always move back to the trigger.
	 */
	const onClose = useCallback(() => {
		closePopup();

		// Focus on the body implies a skip link was not clicked
		if (document.activeElement === document.body) {
			triggerRef.current?.focus();
		}
	}, [closePopup]);

	return (
		<Popup
			isOpen={isOpen}
			onClose={onClose}
			placement="bottom-start"
			shouldRenderToParent
			shouldReturnFocus={false}
			role="dialog"
			titleId={titleId}
			testId={testId ? `${testId}--skip-links-container` : undefined}
			offset={popupOffset}
			content={() => (
				<div css={contentStyles.root}>
					<div
						css={contentStyles.label}
						data-testid={testId ? `${testId}--skip-links-container--label` : undefined}
						id={titleId}
					>
						{title}
					</div>
					<ol css={[contentStyles.skipLinkList]}>
						{links.map(({ id, label, navigate }) => (
							<SkipLink
								key={id}
								id={id}
								/**
								 * The popup always owns the navigation effect under the
								 * `platform_dst_nav4_skip_link_a11y_1` gate (the only path
								 * that renders `SkipLinksPopup`). It first closes itself
								 * synchronously so its focus lock is released, then either:
								 *
								 *  - delegates to the consumer's `navigate` (e.g. SideNav
								 *    expanding and focusing its first nav item), or
								 *  - falls back to focusing the slot element with `id`.
								 *
								 * This means `SkipLink`'s `onBeforeNavigate` hook is never
								 * needed under the gate and can be removed on cleanup.
								 */
								navigate={() => {
									closePopup();
									if (navigate) {
										navigate();
										return;
									}
									// Intentionally not using `document.querySelector` because many valid IDs are not valid selectors.
									const target = document.getElementById(id);
									if (target) {
										focusElement(target);
									}
								}}
							>
								{label}
							</SkipLink>
						))}
					</ol>
				</div>
			)}
			trigger={(triggerProps) => (
				<div css={[triggerStyles.root, isOpen && triggerStyles.isOpen]}>
					<Button
						{...triggerProps}
						ref={mergeRefs([triggerProps.ref, triggerRef])}
						appearance="primary"
						isSelected={isOpen}
						testId={testId ? `${testId}--skip-links-trigger` : undefined}
						onClick={openPopup}
					>
						{triggerLabel}
					</Button>
				</div>
			)}
		/>
	);
}
