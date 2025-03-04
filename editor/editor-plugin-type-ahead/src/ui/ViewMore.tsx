/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/migration/show-more-horizontal--editor-more';
import { ButtonItem, Section } from '@atlaskit/menu';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const buttonStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N30),
	},
});

export const ViewMore = ({
	onClick,
}: {
	onClick: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
}) => {
	const { formatMessage } = useIntl();
	return (
		<Section hasSeparator>
			<span css={buttonStyles}>
				<ButtonItem
					onClick={onClick}
					iconBefore={<ShowMoreHorizontalIcon label="" />}
					aria-describedby={formatMessage(messages.viewMore)}
					data-testid="quick-insert-view-more-elements-item"
				>
					{formatMessage(messages.viewMore)}
				</ButtonItem>
			</span>
		</Section>
	);
};
