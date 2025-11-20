import React from 'react';

import { SmartLinkStatus } from '../../../../../constants';
import {
	useFlexibleCardContext,
	useFlexibleUiContext,
	useFlexibleUiOptionContext,
} from '../../../../../state/flexible-ui-context';
import { useSmartLinkRenderers } from '../../../../../state/renderers';
import { Snippet } from '../../elements';
import { getMaxLines } from '../../utils';
import Block from '../block';

import { type SnippetBlockProps } from './types';

const DEFAULT_MAX_LINES = 3;
const MAXIMUM_MAX_LINES = 6;
const MINIMUM_MAX_LINES = 1;

/**
 * Represents a SnippetBlock, which is used to display longer form text content, like descriptions.
 * @public
 * @param {SnippetBlockProps} SnippetBlockProps
 * @see Block
 */
const SnippetBlock = ({
	maxLines = DEFAULT_MAX_LINES,
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
		DEFAULT_MAX_LINES,
		MAXIMUM_MAX_LINES,
		MINIMUM_MAX_LINES,
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

export default SnippetBlock;
