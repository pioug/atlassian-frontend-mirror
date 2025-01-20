/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { ComponentPropsWithoutRef } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import {
	SmartLinkAlignment,
	SmartLinkDirection,
	SmartLinkPosition,
	SmartLinkWidth,
} from '../../../../../../constants';
import { LinkIcon } from '../../../elements';
import Block from '../../block';
import { ElementGroupNew as ElementGroup } from '../../element-group';
import { renderElementItems } from '../../utils';
import { type TitleBlockViewProps } from '../types';

import TitleBlockResolvedViewOld from './TitleBlockResolvedViewOld';

const style = css({
	gap: token('space.050', '0.25rem'),
});

const titleBlockGapStyle = css({
	gap: token('space.100'),
});

export const BlockFeatureGated = ({
	className,
	...props
}: ComponentPropsWithoutRef<typeof Block>) => {
	if (fg('platform-smart-card-icon-migration')) {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- This will be deleted when cleaning the gate
		return <Block {...props} className={className} />;
	}

	return <Block {...props} />;
};

/**
 * This renders a fully resolved TitleBlock.
 * This should render when a Smart Link returns a valid response.
 * @see TitleBlock
 */
const TitleBlockResolvedViewNew = ({
	actionGroup,
	metadata = [],
	position,
	subtitle = [],
	testId,
	text,
	icon,
	title,
	metadataPosition,
	hideIcon,
	...blockProps
}: TitleBlockViewProps) => {
	const { size } = blockProps;
	const metadataElements = renderElementItems(metadata);
	const subtitleElements = renderElementItems(subtitle);

	return (
		// TODO Replace BlockFeatureGated by Block when cleaning platform-smart-card-icon-migration
		<BlockFeatureGated {...blockProps} css={titleBlockGapStyle} testId={`${testId}-resolved-view`}>
			{!hideIcon && (
				<LinkIcon
					overrideIcon={icon}
					position={position}
					{...(fg('platform-smart-card-icon-migration') && {
						size,
					})}
				/>
			)}
			<ElementGroup
				direction={SmartLinkDirection.Vertical}
				width={SmartLinkWidth.Flexible}
				css={style}
				size={blockProps.size}
			>
				{title}
				{subtitleElements && (
					<ElementGroup direction={SmartLinkDirection.Horizontal}>{subtitleElements}</ElementGroup>
				)}
			</ElementGroup>
			{metadataElements && (
				<ElementGroup
					direction={SmartLinkDirection.Horizontal}
					align={SmartLinkAlignment.Right}
					position={metadataPosition ?? SmartLinkPosition.Center}
					size={blockProps.size}
				>
					{metadataElements}
				</ElementGroup>
			)}
			{actionGroup}
		</BlockFeatureGated>
	);
};

export default TitleBlockResolvedViewOld;
export { TitleBlockResolvedViewNew };
