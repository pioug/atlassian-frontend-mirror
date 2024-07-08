import React, { memo } from 'react';
import { Status as AkStatus, type Color } from '@atlaskit/status/element';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	useInlineAnnotationProps,
	type MarkDataAttributes,
} from '../../ui/annotations/element/useInlineAnnotationProps';

export interface Props extends MarkDataAttributes {
	text: string;
	color: Color;
	localId?: string;
}

export default memo(function Status(props: Props) {
	const { text, color, localId } = props;
	const inlineAnnotationProps = useInlineAnnotationProps(props);

	if (fg('editor_inline_comments_on_inline_nodes')) {
		return (
			<span {...inlineAnnotationProps}>
				<FabricElementsAnalyticsContext
					data={{
						userContext: 'document',
					}}
				>
					<AkStatus text={text} color={color} localId={localId} role="presentation" />
				</FabricElementsAnalyticsContext>
			</span>
		);
	}

	return (
		<FabricElementsAnalyticsContext
			data={{
				userContext: 'document',
			}}
		>
			<AkStatus text={text} color={color} localId={localId} role="presentation" />
		</FabricElementsAnalyticsContext>
	);
});
