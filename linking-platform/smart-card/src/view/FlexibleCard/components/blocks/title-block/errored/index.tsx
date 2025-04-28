import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { Box } from '@atlaskit/primitives/compiled';

import { SmartLinkAlignment, SmartLinkDirection } from '../../../../../../constants';
import { LinkIcon } from '../../../elements';
import Block from '../../block';
import ElementGroup from '../../element-group';
import { type TitleBlockViewProps } from '../types';

/**
 * Represents an Errored TitleBlock view.
 * This will render when a Smart Link did not successfully resolve.
 * This may be a result of a Smart Link not having the correct credentials,
 * or the backend response was errored or malformed.
 * @see TitleBlock
 */
const TitleBlockErroredView = ({
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
		<Block {...blockProps} testId={`${testId}-errored-view`}>
			{!hideIcon && <LinkIcon overrideIcon={icon} position={position} />}
			{title}
			{descriptor && (
				<ElementGroup direction={SmartLinkDirection.Horizontal} align={SmartLinkAlignment.Right}>
					{/* eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable */}
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

export default TitleBlockErroredView;
