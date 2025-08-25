import React, { memo } from 'react';

import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { Mention } from '@atlaskit/editor-common/mention';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	useInlineAnnotationProps,
	type MarkDataAttributes,
} from '../../ui/annotations/element/useInlineAnnotationProps';

export interface Props extends MarkDataAttributes {
	accessLevel?: string;
	eventHandlers?: EventHandlers;
	id: string;
	localId?: string;
	providers?: ProviderFactory;
	text: string;
}

export default memo(function MentionItem(props: Props) {
	const { eventHandlers, id, providers, text, accessLevel, localId } = props;
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
			eventHandlers={eventHandlers && eventHandlers.mention}
		/>
	);
});
