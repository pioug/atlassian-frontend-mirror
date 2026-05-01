/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import { token } from '@atlaskit/tokens';

import { messages } from '../../../../../messages';
import RovoHexLogo from '../../../assets/rovo-hex-logo';

const sectionHeaderStyles = css({
	display: 'flex',
	flexDirection: 'column',
	gap: token('space.150'),
	marginBottom: token('space.100'),
	marginLeft: token('space.025'),
	width: '100%',
	alignSelf: 'stretch',
});

const sectionHeaderDividerStyles = css({
	height: '1px',
	width: '100%',
	backgroundColor: token('color.border'),
});

const sectionHeaderRowStyles = css({
	display: 'flex',
	alignItems: 'center',
	gap: token('space.050'),
	paddingLeft: token('space.050'),
});

const sectionHeaderLabelStyles = css({
	font: token('font.body.small'),
	color: token('color.text.subtle'),
	fontWeight: token('font.weight.medium'),
});

interface RovoSectionHeaderProps {
	testId?: string;
}

/**
 * "Ask Rovo" section header rendered above the prompt action pill buttons in
 * the rovogrowth-640-inline-action-nudge-exp pill variant.
 *
 * Renders a full-width 1px divider followed by a row containing the colourful
 * Rovo hex logo and the "Ask Rovo" label.
 */
const AskRovoSectionHeader = ({ testId }: RovoSectionHeaderProps): JSX.Element => {
	const intl = useIntl();

	return (
		<div
			css={sectionHeaderStyles}
			data-testid={testId}
		>
			<div css={sectionHeaderDividerStyles} role="separator" aria-orientation="horizontal" />
			<div css={sectionHeaderRowStyles}>
				<RovoHexLogo />
				<span css={sectionHeaderLabelStyles}>
					{intl.formatMessage(messages.rovo_chat_action_section_header)}
				</span>
			</div>
		</div>
	);
};

export default AskRovoSectionHeader;
