/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { SmartLinkAlignment, SmartLinkDirection } from '../../../../../../constants';
import { LinkIcon } from '../../../elements';
import Block from '../../block';
import ElementGroup from '../../element-group';
import { type TitleBlockViewProps } from '../types';

import TitleBlockErroredViewOld from './TitleBlockErroredViewOld';

/**
 * Represents an Errored TitleBlock view.
 * This will render when a Smart Link did not successfully resolve.
 * This may be a result of a Smart Link not having the correct credentials,
 * or the backend response was errored or malformed.
 * @see TitleBlock
 */
const TitleBlockErroredViewNew = ({
	actionGroup,
	retry,
	position,
	testId,
	title,
	icon,
	hideIcon,
	...blockProps
}: TitleBlockViewProps) => {
	const { descriptor, onClick, values } = retry || {};
	const hasAction = onClick !== undefined;

	return (
		<Block {...blockProps} css={titleBlockGapStyle} testId={`${testId}-errored-view`}>
			{!hideIcon && <LinkIcon overrideIcon={icon} position={position} />}
			{title}
			{descriptor && (
				<ElementGroup direction={SmartLinkDirection.Horizontal} align={SmartLinkAlignment.Right}>
					<Box
						onClick={onClick}
						testId={`${testId}-errored-view-message`}
						tabIndex={hasAction ? 0 : -1}
					>
						<FormattedMessage {...descriptor} values={values} />
					</Box>
				</ElementGroup>
			)}
			{actionGroup}
		</Block>
	);
};

export default TitleBlockErroredViewOld;
export { TitleBlockErroredViewNew };

const titleBlockGapStyle = css({
	gap: token('space.100'),
});
