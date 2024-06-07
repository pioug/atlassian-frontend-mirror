import LockIcon from '@atlaskit/icon/glyph/lock';
import { extractProvider } from '@atlaskit/link-extractors';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { type JsonLd } from 'json-ld-types';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl-next';
import { messages } from '../../../../messages';
import Text from '../../../FlexibleCard/components/elements/text';
import { type FlexibleBlockCardProps } from './types';
import UnresolvedView from './unresolved-view';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

/**
 * This view represents a Block Card with a 'Not_Found' status.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleNotFoundView = ({
	testId = 'smart-block-not-found-view',
	...props
}: FlexibleBlockCardProps) => {
	const intl = useIntl();

	const { cardState } = props;

	const product = useMemo(() => {
		const provider = extractProvider(cardState?.details?.data as JsonLd.Data.BaseData);
		return provider?.text ?? '';
	}, [cardState?.details?.data]);

	const title = useMemo(
		() =>
			intl.formatMessage(messages.not_found_title, {
				product,
			}),
		[intl, product],
	);

	const description = useMemo(
		() => ({
			descriptor: messages.not_found_description,
		}),
		[],
	);

	return (
		<UnresolvedView {...props} testId={testId} title={title}>
			<LockIcon
				label="not-found-lock-icon"
				size="small"
				primaryColor={token('color.icon.danger', R300)}
				testId={`${testId}-lock-icon`}
			/>
			<Text message={description} testId={`${testId}-message`} maxLines={3} />
		</UnresolvedView>
	);
};

export default withFlexibleUIBlockCardStyle(FlexibleNotFoundView);
