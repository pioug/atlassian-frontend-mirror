import React from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import LegacyManualTriggerIcon from '@atlaskit/legacy-custom-icons/manual-trigger-icon';
import { ModalHeader, useModal } from '@atlaskit/modal-dialog';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { G50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useAutomationMenu } from '../../menu-context';

const i18n = defineMessages({
	modalHeaderIconLabel: {
		id: 'automation-menu.modal.header.icon.label',
		defaultMessage: 'Automation modal header icon',
		description: 'A label for the icon in the header of the automation modal.',
	},
});

const iconStyle = xcss({
	marginRight: 'space.150',
	backgroundColor: 'color.background.accent.green.subtlest',
	borderRadius: 'border.radius',
});

const modalDescriptionStyle = xcss({
	marginTop: 'space.150',
});

type AutomationModalHeaderProps = {
	modalTitle?: React.ReactNode;
	modalDescription?: React.ReactNode;
};

export const AutomationModalHeaderOld = ({
	modalTitle,
	modalDescription,
}: AutomationModalHeaderProps) => {
	const { formatMessage } = useIntl();

	const { initialised, rules } = useAutomationMenu();
	const { titleId } = useModal();

	const showDescription = initialised && rules.length > 0 && !!modalDescription;

	return (
		<ModalHeader>
			<Stack>
				<Inline alignBlock="center">
					<Box xcss={iconStyle} paddingInline="space.050" paddingBlock="space.025">
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
				{showDescription && <Box xcss={modalDescriptionStyle}>{modalDescription}</Box>}
			</Stack>
		</ModalHeader>
	);
};
