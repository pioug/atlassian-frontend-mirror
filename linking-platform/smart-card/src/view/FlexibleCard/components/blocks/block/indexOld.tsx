/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import { ElementName, SmartLinkDirection, SmartLinkSize } from '../../../../../constants';
import { type BlockProps } from '../types';
import { getBaseStyles, getGapSize, highlightRemoveStyles, renderChildren } from '../utils';

const getBlockStyles = (
	direction: SmartLinkDirection,
	size: SmartLinkSize,
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
): SerializedStyles => css`
	${getBaseStyles(direction, size)}
	${highlightRemoveStyles}
  justify-content: flex-start;
	[data-separator] + [data-separator]:before {
		content: '•';
		margin-right: ${getGapSize(size)}rem;
	}
	// Pull request elements: source branch → target branch
	[data-smart-element='${ElementName.SourceBranch}']
		+ [data-smart-element='${ElementName.TargetBranch}']:before {
		content: '→';
	}
	// Pull request elements: target branch ← source branch
	[data-smart-element='${ElementName.TargetBranch}']
		+ [data-smart-element='${ElementName.SourceBranch}']:before {
		content: '←';
	}
`;

/**
 * A block represents a collection of elements and actions that are arranged
 * in a row. All elements and actions should be contained within a Block.
 * @internal
 * @param {ActionGroupProps} ActionGroupProps
 * @see Action
 */
const Block = ({
	children,
	direction = SmartLinkDirection.Horizontal,
	size = SmartLinkSize.Medium,
	testId = 'smart-block',
	overrideCss,
	blockRef,
	onRender,
	onTransitionEnd,
}: BlockProps) => {
	useEffect(() => {
		onRender && onRender();
	}, [onRender]);

	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[getBlockStyles(direction, size), overrideCss]}
			data-smart-block
			data-testid={testId}
			onTransitionEnd={onTransitionEnd}
			ref={blockRef}
		>
			{renderChildren(children, size)}
		</div>
	);
};

export default Block;
