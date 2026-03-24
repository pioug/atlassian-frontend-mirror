/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import { ButtonItem, Section } from '@atlaskit/menu';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const buttonStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button:focus': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
});

type Props = {
	ariaLabel?: string;
	iconBefore?: React.ReactNode;
	isFocused: boolean;
	lastInputMethodRef?: React.MutableRefObject<'mouse' | 'keyboard'>;
	onClick: () => void;
	title: string;
};

export const MoreOptions = ({
	onClick,
	isFocused,
	title,
	ariaLabel,
	iconBefore,
	lastInputMethodRef,
}: Props): jsx.JSX.Element => {
	const ref = useRef<HTMLElement>(null);
	const isSafari = getBrowserInfo().safari;

	useEffect(() => {
		if (isFocused && ref.current) {
			const skipFocusOnSafariHover =
				isSafari &&
				lastInputMethodRef?.current === 'mouse' &&
				expValEquals('platform_safari_cursor_typeahead_fix', 'isEnabled', true);

			if (!skipFocusOnSafariHover) {
				ref.current.focus();
			}
		}
	}, [isFocused, lastInputMethodRef, isSafari]);

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		const { current: element } = ref;

		const handleEnter = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				onClick();
				// Prevent keydown listener in TypeaheadList from handling Enter pressed
				e.stopPropagation();
			} else if (
				e.key === 'Tab' &&
				!expValEquals('platform_editor_a11y_typeahead_tab_keypress', 'isEnabled', true)
			) {
				// TypeaheadList will try to insert selected item on Tab press
				// hence stop propagation to prevent that and treat this as noop
				e.stopPropagation();
				e.preventDefault();
			}
		};

		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		element?.addEventListener('keydown', handleEnter);
		return () => {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			element?.removeEventListener('keydown', handleEnter);
		};
	});
	return (
		<Section hasSeparator>
			<span css={buttonStyles}>
				<ButtonItem
					ref={ref}
					/* eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed) */
					onMouseDown={(e: React.MouseEvent) => {
						if (
							isSafari &&
							expValEquals('platform_safari_cursor_typeahead_fix', 'isEnabled', true)
						) {
							e.preventDefault();
						}
					}}
					onClick={onClick}
					iconBefore={iconBefore}
					aria-label={ariaLabel}
					testId="type-ahead-more-options-button"
				>
					{title}
				</ButtonItem>
			</span>
		</Section>
	);
};
