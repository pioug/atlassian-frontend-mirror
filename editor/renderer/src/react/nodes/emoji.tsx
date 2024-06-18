/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type EmojiAttributes } from '@atlaskit/adf-schema';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { type EmojiResourceConfig } from '@atlaskit/emoji/resource';
import { memo } from 'react';
import { type ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { Emoji } from '@atlaskit/editor-common/emoji';
import {
	useInlineAnnotationProps,
	type MarkDataAttributes,
} from '../../ui/annotations/element/useInlineAnnotationProps';

export interface EmojiProps extends EmojiAttributes, MarkDataAttributes {
	providers?: ProviderFactory;
	resourceConfig?: EmojiResourceConfig;
	fitToHeight?: number;
}

function EmojiItem(props: EmojiProps) {
	const { id, providers, shortName, text, fitToHeight, resourceConfig } = props;

	const inlineAnnotationProps = useInlineAnnotationProps(props, { isInlineCard: false });

	if (getBooleanFF('platform.editor.allow-inline-comments-for-inline-nodes-round-2_ctuxz')) {
		return (
			<span {...inlineAnnotationProps}>
				<Emoji
					allowTextFallback={true}
					id={id}
					shortName={shortName}
					fallback={text}
					providers={providers}
					fitToHeight={fitToHeight}
					resourceConfig={resourceConfig}
				/>
			</span>
		);
	}

	return (
		<Emoji
			allowTextFallback={true}
			id={id}
			shortName={shortName}
			fallback={text}
			providers={providers}
			fitToHeight={fitToHeight}
			resourceConfig={resourceConfig}
		/>
	);
}

// Working around an issue with pre existing tests using react-test-renderer
// https://github.com/facebook/react/issues/17301#issuecomment-557765213
EmojiItem.defaultProps = {};

export default memo(EmojiItem);
