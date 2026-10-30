import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';

import type { ObjectReference } from '@atlaskit/linking-types/datasource';
import { Anchor, type AnchorProps } from '@atlaskit/primitives/compiled/anchor';
import { useSmartLinkDestinationUrl } from '@atlaskit/smart-card/hook/use-smart-link-destination-url';
import { HoverCard } from '@atlaskit/smart-card/hover';
import AvatarTag from '@atlaskit/tag/avatar-tag';
import TeamAvatar, { type TeamAvatarProps } from '@atlaskit/teams-avatar/teams-avatar';

import { messages } from '../link/messages';

interface ObjectReferenceProps extends ObjectReference {
	testId?: string;
}

export const OBJECT_REFERENCE_TYPE_TEST_ID = 'link-datasource-render-type--object-reference';

/**
 * Renders an `objectReference` datasource value as an avatar tag that links to the referenced
 * object. Behaves like the `link` render type (opens in a new tab, shows a Smart Link hover card,
 * honours cross-product URL wrapping) but with the look and feel of an `AvatarTag`.
 */
const ObjectReferenceRenderType = ({
	url,
	text,
	avatarUrl,
	testId = OBJECT_REFERENCE_TYPE_TEST_ID,
}: ObjectReferenceProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const destinationUrl = useSmartLinkDestinationUrl(url);
	const newWindowLabel = formatMessage(messages.opensInNewTab);

	// `AvatarTag` provides the controlled avatar props (size, appearance, border colour); we only
	// supply the image source and accessible name.
	const avatar = useMemo(
		() =>
			(props: TeamAvatarProps): React.JSX.Element => (
				<TeamAvatar {...props} src={avatarUrl} name={text} testId={`${testId}--avatar`} />
			),
		[avatarUrl, text, testId],
	);

	const linkComponent = useMemo(
		() =>
			(props: AnchorProps): React.JSX.Element => (
				<Anchor
					{...props}
					target="_blank"
					rel="noopener noreferrer"
					newWindowLabel={newWindowLabel}
				/>
			),
		[newWindowLabel],
	);

	// url can be undefined before data is fetched whilst adding a new column to display
	if (!url) {
		return null;
	}

	return (
		<HoverCard url={url}>
			<AvatarTag
				type="other"
				text={text}
				href={destinationUrl}
				isRemovable={false}
				avatar={avatar}
				linkComponent={linkComponent}
				testId={testId}
			/>
		</HoverCard>
	);
};

const _default_1: React.MemoExoticComponent<
	({ url, text, avatarUrl, testId }: ObjectReferenceProps) => React.JSX.Element | null
> = React.memo(ObjectReferenceRenderType);
export default _default_1;
