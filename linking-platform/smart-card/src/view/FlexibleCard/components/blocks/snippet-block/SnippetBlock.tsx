import React from 'react';

import { SmartLinkStatus } from '../../../../../constants';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context/useFlexibleCardContext';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context/useFlexibleUiContext';
import { useFlexibleUiOptionContext } from '../../../../../state/flexible-ui-context/useFlexibleUiOptionContext';
import { useSmartLinkRenderers } from '../../../../../state/renderers';
import { default as Snippet } from '../../elements/snippet-element';
import { getMaxLines } from '../../getMaxLines';
import Block from '../block';
import { SNIPPET_BLOCK_CONSTANTS } from './constants';
import { type SnippetBlockProps } from './types';

/**
 * Represents a SnippetBlock, which is used to display longer form text content, like descriptions.
 * @public
 * @param {SnippetBlockProps} SnippetBlockProps
 * @see Block
 */
export const SnippetBlock = ({
	maxLines = SNIPPET_BLOCK_CONSTANTS.DEFAULT_MAX_LINES,
	testId = 'smart-block-snippet',
	text,
	isHidden = false,
	showFooter = true,
	...blockProps
}: SnippetBlockProps): React.JSX.Element | null => {
	const context = useFlexibleUiContext();
	const renderers = useSmartLinkRenderers();
	const enableSnippetRenderer = useFlexibleUiOptionContext()?.enableSnippetRenderer;
	const cardContext = useFlexibleCardContext();

	if (cardContext?.status !== SmartLinkStatus.Resolved && !text) {
		return null;
	}

	const snippetMaxLines = getMaxLines(
		maxLines,
		SNIPPET_BLOCK_CONSTANTS.DEFAULT_MAX_LINES,
		SNIPPET_BLOCK_CONSTANTS.MAXIMUM_MAX_LINES,
		SNIPPET_BLOCK_CONSTANTS.MINIMUM_MAX_LINES,
	);
	const statusTestId = !text ? 'resolved' : 'non-resolved';

	const snippet = <Snippet maxLines={snippetMaxLines} content={text} />;

	if (!enableSnippetRenderer) {
		return (
			<Block
				{...blockProps}
				size={blockProps.size ?? cardContext?.ui?.size}
				testId={`${testId}-${statusTestId}-view`}
			>
				{snippet}
			</Block>
		);
	}

	const SnippetReplacement = renderers?.snippet;
	return (
		<Block
			{...blockProps}
			size={blockProps.size ?? cardContext?.ui?.size}
			testId={`${testId}-${statusTestId}-view`}
		>
			{SnippetReplacement ? (
				<SnippetReplacement
					fallbackText={(text || context?.snippet) ?? ''}
					fallbackComponent={snippet}
					contentId={context?.meta?.objectId ?? ''}
					contentType={context?.meta?.resourceType ?? ''}
					cloudId={context?.meta?.tenantId ?? ''}
					maxLines={snippetMaxLines}
					isHidden={isHidden}
					showFooter={showFooter}
				/>
			) : (
				snippet
			)}
		</Block>
	);
};
