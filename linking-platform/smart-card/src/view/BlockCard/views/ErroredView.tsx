import React, { useMemo } from 'react';

import WarningIcon from '@atlaskit/icon/core/migration/warning';
import LegacyWarningIcon from '@atlaskit/icon/glyph/warning';
import { fg } from '@atlaskit/platform-feature-flags';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import { type ActionItem } from '../../FlexibleCard/components/blocks/types';
import Text from '../../FlexibleCard/components/elements/text';
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
			{fg('platform-smart-card-icon-migration') ? (
				<WarningIcon
					label="errored-warning-icon"
					color={token('color.icon.warning')}
					LEGACY_size="small"
					testId={`${testId}-warning-icon`}
				/>
			) : (
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19497
				<LegacyWarningIcon
					label="errored-warning-icon"
					size="small"
					primaryColor={token('color.icon.warning', R300)}
					testId={`${testId}-warning-icon`}
				/>
			)}
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
