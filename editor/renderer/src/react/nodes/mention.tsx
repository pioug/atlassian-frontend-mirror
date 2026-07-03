import React, { memo } from 'react';

import type { MentionUserType } from '@atlaskit/adf-schema';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { Mention } from '@atlaskit/editor-common/mention';
import { fg } from '@atlaskit/platform-feature-flags';
import { useInlineAnnotationProps } from '../../ui/annotations/element/useInlineAnnotationProps';
import type { MarkDataAttributes } from '../../ui/annotations/element/useInlineAnnotationProps';

export interface Props extends MarkDataAttributes {
	accessLevel?: string;
	eventHandlers?: EventHandlers;
	id: string;
	localId?: string;
	providers?: ProviderFactory;
	text: string;
	userType?: MentionUserType;
}

const _default_1: React.NamedExoticComponent<Props> = memo(function MentionItem(props: Props) {
	const { eventHandlers, id, providers, text, accessLevel, localId, userType } = props;
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
			userType={userType}
			eventHandlers={eventHandlers && eventHandlers.mention}
		/>
	);
});
export default _default_1;
