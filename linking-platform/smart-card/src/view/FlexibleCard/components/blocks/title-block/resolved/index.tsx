/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import {
	SmartLinkAlignment,
	SmartLinkDirection,
	SmartLinkPosition,
	SmartLinkWidth,
} from '../../../../../../constants';
import { LinkIcon } from '../../../elements';
import Block from '../../block';
import ElementGroup from '../../element-group';
import { renderElementItems } from '../../utils';
import { type TitleBlockViewProps } from '../types';

const style = css({
	gap: token('space.050'),
});

const styles = cssMap({
	titleBox: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
	},
});

/**
 * This renders a fully resolved TitleBlock.
 * This should render when a Smart Link returns a valid response.
 * @see TitleBlock
 */
const TitleBlockResolvedView = ({
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
	CompetitorPrompt,
	url,
	...blockProps
}: TitleBlockViewProps) => {
	const { size } = blockProps;
	const metadataElements = renderElementItems(metadata);
	const subtitleElements = renderElementItems(subtitle);

	return (
		<Block {...blockProps} testId={`${testId}-resolved-view`}>
			{!hideIcon && <LinkIcon overrideIcon={icon} position={position} size={size} />}
			<ElementGroup
				direction={SmartLinkDirection.Vertical}
				width={SmartLinkWidth.Flexible}
				css={style}
				size={blockProps.size}
			>
				{CompetitorPrompt && url && fg('prompt_whiteboard_competitor_link_gate') ? (
					<Box xcss={styles.titleBox}>
						{title}
						<CompetitorPrompt sourceUrl={url} linkType={'card'} />
					</Box>
				) : (
					title
				)}
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
		</Block>
	);
};

export default TitleBlockResolvedView;
