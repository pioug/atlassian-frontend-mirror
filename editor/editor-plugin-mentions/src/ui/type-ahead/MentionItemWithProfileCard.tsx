import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { MentionAttributes, MentionUserType } from '@atlaskit/adf-schema/mention';
import { cssMap } from '@atlaskit/css';
import type { ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
import { MentionItem } from '@atlaskit/mention/item';
import type { MentionDescription } from '@atlaskit/mention/resource';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled';

import { ProfileCardComponent } from '../ProfileCardComponent';

import { isAgentMention } from './utils';

// Delay before mounting the card and fetching the profile data
const SHOW_DELAY_MS = 600;
const HIDE_DELAY_MS = 200;
// Gap between the typeahead row and the profile card
const CARD_GAP_PX = 8;

const styles = cssMap({
	placeholderContainer: {
		cursor: 'default',
	},
	placeholderContent: {
		pointerEvents: 'none',
	},
});

function getScrollbarWidth(row: HTMLElement): number {
	let node: HTMLElement | null = row;
	while (node) {
		const style = getComputedStyle(node);
		if (
			(style.overflowY === 'auto' || style.overflowY === 'scroll') &&
			node.scrollHeight > node.clientHeight
		) {
			return Math.max(0, node.offsetWidth - node.clientWidth);
		}
		node = node.parentElement;
	}
	return 0;
}

type Props = {
	height?: number;
	mention: MentionDescription;
	onSelection: () => void;
	profilecardProvider?: Promise<ProfilecardProvider>;
	selected?: boolean;
};

/**
 * Renders a mentions typeahead row that shows a (reduced) profile card
 * when hovered
 */
export function MentionItemWithProfileCard({
	mention,
	selected,
	onSelection,
	height,
	profilecardProvider,
}: Props): JSX.Element {
	const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
	const showTimerRef = useRef<ReturnType<typeof setTimeout>>();
	const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();

	const clearTimers = useCallback(() => {
		clearTimeout(showTimerRef.current);
		clearTimeout(hideTimerRef.current);
	}, []);

	useEffect(() => clearTimers, [clearTimers]);

	const isAgent = isAgentMention(mention);

	const handleMouseEnter = useCallback(
		(_mention: MentionDescription, event?: React.SyntheticEvent) => {
			// Currently showing profile cards for agents only
			if (mention.isPlaceholder || !mention.id || !profilecardProvider || !isAgent) {
				return;
			}

			const rowElement = event?.currentTarget;
			if (!(rowElement instanceof HTMLElement)) {
				return;
			}
			clearTimers();
			showTimerRef.current = setTimeout(() => {
				setReferenceElement(rowElement);
			}, SHOW_DELAY_MS);
		},
		[mention.isPlaceholder, mention.id, isAgent, profilecardProvider, clearTimers],
	);

	const scheduleHide = useCallback(() => {
		clearTimeout(hideTimerRef.current);
		hideTimerRef.current = setTimeout(() => {
			setReferenceElement(null);
		}, HIDE_DELAY_MS);
	}, []);

	const cancelHide = useCallback(() => {
		clearTimeout(hideTimerRef.current);
	}, []);

	const handleMouseLeave = useCallback(() => {
		clearTimeout(showTimerRef.current);
		scheduleHide();
	}, [scheduleHide]);

	const closeCard = useCallback(() => {
		clearTimers();
		setReferenceElement(null);
	}, [clearTimers]);

	const userType: MentionUserType | undefined = isAgent ? 'APP' : undefined;

	const activeMention = useMemo<{ attrs: MentionAttributes }>(
		() => ({
			attrs: {
				id: mention.id,
				text: mention.name,
				userType,
				accessLevel: mention.accessLevel,
			},
		}),
		[mention.id, mention.name, mention.accessLevel, userType],
	);

	// If there's a scrollbar, position the card with a gap to it
	const offset = useMemo<[number, number] | undefined>(() => {
		if (!referenceElement || !fg('platform_editor_typeahead_profilecard_scrollbar')) {
			return undefined;
		}
		return [0, CARD_GAP_PX + getScrollbarWidth(referenceElement)];
	}, [referenceElement]);

	if (mention.isPlaceholder && isExperimentEnabled('platform_editor_mention_search_order')) {
		return (
			<Box testId="mention-item-with-profile-card" xcss={styles.placeholderContainer}>
				<Box xcss={styles.placeholderContent}>
					<MentionItem
						mention={mention}
						selected={selected}
						onMouseEnter={handleMouseEnter}
						onSelection={onSelection}
						height={height}
					/>
				</Box>
			</Box>
		);
	}

	return (
		<Box
			testId="mention-item-with-profile-card"
			onMouseOver={cancelHide}
			onMouseOut={scheduleHide}
			onMouseLeave={handleMouseLeave}
			onBlur={handleMouseLeave}
		>
			<MentionItem
				mention={mention}
				selected={selected}
				onMouseEnter={handleMouseEnter}
				onSelection={onSelection}
				height={height}
			/>
			{referenceElement && profilecardProvider && (
				<ProfileCardComponent
					activeMention={activeMention}
					profilecardProvider={profilecardProvider}
					dom={referenceElement}
					closeComponent={closeCard}
					placement="right"
					offset={offset}
					disableFocusTrap
					hideActions
				/>
			)}
		</Box>
	);
}
