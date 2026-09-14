import React, { memo } from 'react';

import type { UserType as MentionUserType } from '@atlaskit/adf-schema/mention';
import { Mention, type MentionNodeDataProvider } from '@atlaskit/editor-common/mention';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { useInlineAnnotationProps } from '../../ui/annotations/element/useInlineAnnotationProps';
import type { MarkDataAttributes } from '../../ui/annotations/element/useInlineAnnotationProps';

export interface Props extends MarkDataAttributes {
	accessLevel?: string;
	eventHandlers?: EventHandlers;
	id: string;
	localId?: string;
	mentionNodeDataProvider?: MentionNodeDataProvider;
	providers?: ProviderFactory;
	text: string;
	userType?: MentionUserType;
}

const _default_1: React.NamedExoticComponent<Props> = memo(function MentionItem(props: Props) {
	const {
		eventHandlers,
		id,
		mentionNodeDataProvider,
		providers,
		text,
		accessLevel,
		localId,
		userType,
	} = props;
	const inlineAnnotationProps = useInlineAnnotationProps(props);

	if (fg('editor_inline_comments_on_inline_nodes')) {
		return (
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			<span {...inlineAnnotationProps}>
				<Mention
					id={id}
					text={text}
					accessLevel={accessLevel}
					providers={providers}
					localId={localId}
					mentionNodeDataProvider={mentionNodeDataProvider}
					userType={userType}
					eventHandlers={eventHandlers && eventHandlers.mention}
				/>
			</span>
		);
	}

	return (
		<Mention
			id={id}
			text={text}
			accessLevel={accessLevel}
			providers={providers}
			localId={localId}
			mentionNodeDataProvider={mentionNodeDataProvider}
			userType={userType}
			eventHandlers={eventHandlers && eventHandlers.mention}
		/>
	);
});
export default _default_1;
