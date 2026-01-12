import React, { useMemo } from 'react';

import WarningIcon from '@atlaskit/icon/core/status-warning';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import { type ActionItem } from '../../FlexibleCard/components/blocks/types';
import Text from '../../FlexibleCard/components/elements/common/base-text-element';
import { RetryAction } from '../actions/RetryAction';

import { type FlexibleBlockCardProps } from './types';
import UnresolvedView from './unresolved-view';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

/**
 * This view represents a Block Card with an 'Errored' status.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const ErroredView = ({ testId = 'smart-block-errored-view', ...props }: FlexibleBlockCardProps) => {
	const actions = useMemo<ActionItem[]>(
		() => (props.onAuthorize ? [RetryAction(props.onAuthorize)] : []),
		[props.onAuthorize],
	);

	return (
		<UnresolvedView {...props} actions={actions} testId={testId}>
			<WarningIcon
				label="errored-warning-icon"
				color={token('color.icon.warning')}
				testId={`${testId}-warning-icon`}
			/>
			<Text
				maxLines={3}
				message={{
					descriptor: messages.could_not_load_link,
				}}
			/>
		</UnresolvedView>
	);
};

export default withFlexibleUIBlockCardStyle(ErroredView);
