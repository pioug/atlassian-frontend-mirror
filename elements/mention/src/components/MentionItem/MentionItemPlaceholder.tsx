import React from 'react';
import { useIntl } from 'react-intl';

import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';

import { messages } from '../i18n';

import {
	AvatarSkeletonWrapper,
	AvatarStyle,
	MentionItemStyle,
	NameSectionStyle,
	RowStyle,
} from './styles';

type MentionItemPlaceholderProps = {
	forwardedRef?: React.Ref<HTMLDivElement>;
	height?: number;
	id: string;
};

/**
 * Non-interactive skeleton row rendered for a placeholder mention
 * (`mention.isPlaceholder`). Mirrors the avatar + name layout of a real
 * row so the list doesn't jump when the real items swap in, and exposes
 * an accessible loading label. Deliberately wires no selection/hover
 * handlers — it must not be clickable.
 *
 * Lives in its own module (lazy-loaded by `MentionItem`) so the
 * `@atlaskit/skeleton` dependency only enters the bundle when a
 * placeholder is actually rendered, not for every `@atlaskit/mention`
 * consumer.
 */
export default function MentionItemPlaceholder({
	height,
	forwardedRef,
	id,
}: MentionItemPlaceholderProps): React.JSX.Element {
	const { formatMessage } = useIntl();
	const label = formatMessage(messages.loadingPlaceholder);
	return (
		<MentionItemStyle
			height={height}
			data-mention-item
			data-testid={`mention-item-${id}`}
			data-mention-id={id}
			ref={forwardedRef}
			role="status"
			aria-label={label}
		>
			<RowStyle>
				<AvatarStyle>
					{/* 32px circle centered in a 36px wrapper mirrors the real
					    `MentionAvatar` (Avatar `size="medium"`: 32px image in a 36px
					    box), so the row footprint and text offset match on swap. */}
					<AvatarSkeletonWrapper>
						<Skeleton width={32} height={32} borderRadius={token('radius.full')} isShimmering />
					</AvatarSkeletonWrapper>
				</AvatarStyle>
				<NameSectionStyle>
					<Skeleton width={140} height={12} isShimmering />
				</NameSectionStyle>
			</RowStyle>
		</MentionItemStyle>
	);
}
