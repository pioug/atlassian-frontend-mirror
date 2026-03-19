/**
 * Onboarding popover shown for new draggable smart links; explains how to drag them into the content tree.
 * Renders inside PopoverProvider/PopoverTarget (parent must wrap both trigger and this popover).
 */
import React from 'react';
import Image from '@atlaskit/image';
import {
	PopoverContent,
	type PopoverContentProps,
	SpotlightActions,
	SpotlightBody,
	SpotlightCard,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightMedia,
	SpotlightPrimaryAction,
	usePreloadMedia,
} from '@atlaskit/spotlight';
import { useIntl } from 'react-intl-next';
import { Text } from '@atlaskit/primitives/compiled';
import { smartLinkChangeboardMessages } from '@atlaskit/editor-common/messages';

import dragOnboardingGif from './assets/drag-onboarding.gif';

interface SmartLinkDraggableChangeboardPopoverProps {
	dismiss: PopoverContentProps['dismiss'];
	isVisible: PopoverContentProps['isVisible'];
	offset?: PopoverContentProps['offset'];
	placement?: PopoverContentProps['placement'];
}

/**
 * Changeboarding popover that displays a tooltip with a GIF demonstrating
 * how to drag smart links into the sidebar when the user hovers over them.
 *
 * Note: The PopoverProvider and PopoverTarget must be in the parent
 * component that contains both the target element and this popover.
 */
export function SmartLinkDraggableChangeboardPopover({
	dismiss,
	isVisible,
	placement = 'bottom-center',
	offset,
}: SmartLinkDraggableChangeboardPopoverProps): React.JSX.Element | null {
	const { formatMessage } = useIntl();

	usePreloadMedia(dragOnboardingGif, { mimetype: 'image/gif' });

	return (
		<PopoverContent
			dismiss={dismiss}
			isVisible={isVisible}
			placement={placement}
			offset={offset}
			testId="smart-link-draggable-changeboard-popover"
		>
			<SpotlightCard testId="smart-link-draggable-changeboard">
				<SpotlightHeader>
					<SpotlightHeadline>
						{formatMessage(smartLinkChangeboardMessages.headline)}
					</SpotlightHeadline>
					<SpotlightControls>
						<SpotlightDismissControl testId="smart-link-draggable-changeboard-dismiss-control" />
					</SpotlightControls>
				</SpotlightHeader>
				<SpotlightMedia>
					<Image
						src={dragOnboardingGif}
						alt={formatMessage(smartLinkChangeboardMessages.gifAlt)}
						width={295} // Per ADS guidelines, media must be 295px width X 135px height
						testId="smart-link-draggable-changeboard-gif"
					/>
				</SpotlightMedia>
				<SpotlightBody>
					<Text>{formatMessage(smartLinkChangeboardMessages.description)}</Text>
				</SpotlightBody>
				<SpotlightFooter>
					<SpotlightActions>
						<SpotlightPrimaryAction
							onClick={dismiss}
							testId="smart-link-draggable-changeboard-primary-action"
						>
							{formatMessage(smartLinkChangeboardMessages.dismiss)}
						</SpotlightPrimaryAction>
					</SpotlightActions>
				</SpotlightFooter>
			</SpotlightCard>
		</PopoverContent>
	);
}
