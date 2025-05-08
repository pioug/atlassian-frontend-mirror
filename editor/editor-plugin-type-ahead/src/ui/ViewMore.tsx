/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/migration/show-more-horizontal--editor-more';
import { ButtonItem, Section } from '@atlaskit/menu';
import { fg } from '@atlaskit/platform-feature-flags';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const buttonStylesNoOutline = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N30),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button:focus': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N30),
		outline: 'none',
	},
});

const buttonStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N30),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button:focus': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N30),
	},
});

export const ViewMore = ({ onClick, isFocused }: { onClick: () => void; isFocused: boolean }) => {
	const { formatMessage } = useIntl();
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		if (isFocused && ref.current) {
			ref.current.focus();
		}
	}, [isFocused]);

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
			} else if (e.key === 'Tab') {
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
			<span css={fg('platform_editor_controls_patch_8') ? buttonStyles : buttonStylesNoOutline}>
				<ButtonItem
					ref={ref}
					onClick={onClick}
					iconBefore={<ShowMoreHorizontalIcon label="" />}
					aria-describedby={
						fg('platform_editor_refactor_view_more') ? undefined : formatMessage(messages.viewMore)
					}
					aria-label={
						fg('platform_editor_refactor_view_more')
							? formatMessage(messages.viewMoreAriaLabel)
							: undefined
					}
					data-testid="quick-insert-view-more-elements-item"
				>
					{formatMessage(messages.viewMore)}
				</ButtonItem>
			</span>
		</Section>
	);
};
