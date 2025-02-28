/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';

import { css, jsx } from '@compiled/react';
import { type JsonLd } from 'json-ld-types';
import { useIntl } from 'react-intl-next';

import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import LegacyLockIcon from '@atlaskit/icon/glyph/lock';
import { extractProvider } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import Text from '../../FlexibleCard/components/elements/text';

import { NotFoundViewOld } from './NotFoundViewOld';
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
const NotFoundViewNew = ({
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
			{fg('platform-smart-card-icon-migration') ? (
				<LockLockedIcon
					label="not-found-lock-icon"
					color={token('color.icon.danger')}
					LEGACY_fallbackIcon={LegacyLockIcon}
					LEGACY_size="small"
					testId={`${testId}-lock-icon`}
				/>
			) : (
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19497
				<LegacyLockIcon
					label="not-found-lock-icon"
					size="small"
					primaryColor={token('color.icon.danger', R300)}
					testId={`${testId}-lock-icon`}
				/>
			)}
			<Text
				message={description}
				testId={`${testId}-message`}
				maxLines={3}
				css={[fg('platform-linking-visual-refresh-v1') && textStyles]}
			/>
		</UnresolvedView>
	);
};

const NotFoundView = (props: FlexibleBlockCardProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <NotFoundViewNew {...props} />;
	} else {
		return <NotFoundViewOld {...props} />;
	}
};
export default withFlexibleUIBlockCardStyle(NotFoundView);
