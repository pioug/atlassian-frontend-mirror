/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { defineMessages, FormattedMessage } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';
import { token } from '@atlaskit/tokens';

import { useAutomationMenu } from '../../menu-context';

import { AutomationModalExecutionStateOld } from './AutomationModalExecutionStateOld';

const styles = cssMap({
	messageStyling: {
		marginInline: token('space.300'),
		marginTop: token('space.100'),
		// The ModalFooter comes with a lot of built in margin, want to nudge the error message in to the footer a bit
		marginBottom: token('space.negative.100'),
	},
});

const i18n = defineMessages({
	ruleExecutionSuccessMessage: {
		id: 'automation-menu.success-state.message',
		defaultMessage: 'Your automation is in progress',
		description:
			'Message that is displayed when a users automation rule has been successfully queued.',
	},
	ruleExecutionErrorMessage: {
		id: 'automation-menu.modal.error.description',
		defaultMessage: 'Oops we ran into a problem',
		description: "Description for the error section shown when rules can't be executed",
	},
});

const AutomationModalExecutionStateNew = () => {
	const { ruleExecutionState } = useAutomationMenu();

	if (ruleExecutionState === 'FAILURE') {
		return (
			<Box xcss={styles.messageStyling}>
				<SectionMessage appearance="error">
					<FormattedMessage {...i18n.ruleExecutionErrorMessage} />
				</SectionMessage>
			</Box>
		);
	} else {
		return null;
	}
};

export const AutomationModalExecutionState = () => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <AutomationModalExecutionStateNew />;
	}
	return <AutomationModalExecutionStateOld />;
};
