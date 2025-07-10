/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';

import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import LegacyLockIcon from '@atlaskit/icon/glyph/lock';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import Text from '../../FlexibleCard/components/elements/common/base-text-element';

import { type FlexibleBlockCardProps } from './types';
import UnresolvedView from './unresolved-view';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

const textStyles = css({
	color: token('color.text'),
});

/**
 * This view represents a Block Card with a 'Not_Found' status.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const NotFoundView = ({
	testId = 'smart-block-not-found-view',
	...props
}: FlexibleBlockCardProps) => {
	const intl = useIntl();

	const {
		cardState: { details },
	} = props;

	const product = useMemo(() => {
		const provider = extractSmartLinkProvider(details);
		return provider?.text ?? '';
	}, [details]);

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
			<LockLockedIcon
				label="not-found-lock-icon"
				color={token('color.icon.danger')}
				LEGACY_fallbackIcon={LegacyLockIcon}
				LEGACY_size="small"
				testId={`${testId}-lock-icon`}
			/>
			<Text message={description} testId={`${testId}-message`} maxLines={3} css={[textStyles]} />
		</UnresolvedView>
	);
};

export default withFlexibleUIBlockCardStyle(NotFoundView);
