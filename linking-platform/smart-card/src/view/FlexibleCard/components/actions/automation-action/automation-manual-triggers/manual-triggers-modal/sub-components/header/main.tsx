/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { defineMessages, useIntl } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import LegacyManualTriggerIcon from '@atlaskit/legacy-custom-icons/manual-trigger-icon';
import { ModalHeader, useModal } from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { G50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useAutomationMenu } from '../../menu-context';

const styles = cssMap({
	iconStyle: {
		marginRight: token('space.150'),
		borderRadius: token('radius.small'),
		paddingInline: token('space.050'),
		paddingBlock: token('space.025'),
	},
	modalDescriptionStyle: {
		marginTop: token('space.150'),
	},
});

const i18n = defineMessages({
	modalHeaderIconLabel: {
		id: 'automation-menu.modal.header.icon.label',
		defaultMessage: 'Automation modal header icon',
		description: 'A label for the icon in the header of the automation modal.',
	},
});

type AutomationModalHeaderProps = {
	modalDescription?: React.ReactNode;
	modalTitle?: React.ReactNode;
};

export const AutomationModalHeader = ({
	modalTitle,
	modalDescription,
}: AutomationModalHeaderProps) => {
	const { formatMessage } = useIntl();

	const { initialised, rules } = useAutomationMenu();
	const { titleId } = useModal();

	const showDescription = initialised && rules.length > 0 && !!modalDescription;

	return (
		<ModalHeader hasCloseButton={fg('navx-1483-a11y-close-button-in-modal-updates')}>
			<Stack>
				<Inline alignBlock="center">
					<Box
						xcss={styles.iconStyle}
						// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
						backgroundColor="color.background.accent.green.subtlest"
					>
						{/* TODO: no-custom-icons- https://product-fabric.atlassian.net/browse/DSP-21444 */}
						<LegacyManualTriggerIcon
							size="small"
							label={formatMessage(i18n.modalHeaderIconLabel)}
							primaryColor={token('color.icon.accent.green', G50)}
						/>
					</Box>
					<Heading size="medium" id={titleId}>
						{modalTitle}
					</Heading>
				</Inline>
				{showDescription && <Box xcss={styles.modalDescriptionStyle}>{modalDescription}</Box>}
			</Stack>
		</ModalHeader>
	);
};
