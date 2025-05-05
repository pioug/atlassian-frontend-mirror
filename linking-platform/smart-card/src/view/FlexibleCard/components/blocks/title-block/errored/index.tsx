import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';

import {
	InternalActionName,
	SmartLinkAlignment,
	SmartLinkDirection,
} from '../../../../../../constants';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { UnresolvedAction } from '../../../actions';
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
	hideRetry,
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

	const context = fg('platform-linking-flexible-card-unresolved-action')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFlexibleUiContext()
		: {};
	const showRetry = fg('platform-linking-flexible-card-unresolved-action')
		? !hideRetry && Boolean(context?.actions?.[InternalActionName.UnresolvedAction])
		: false;

	return (
		<Block {...blockProps} testId={`${testId}-errored-view`}>
			{!hideIcon && <LinkIcon overrideIcon={icon} position={position} />}
			{title}
			{showRetry && (
				<ElementGroup align={SmartLinkAlignment.Right}>
					<UnresolvedAction testId={testId} />
				</ElementGroup>
			)}
			{!fg('platform-linking-flexible-card-unresolved-action') && descriptor && (
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
