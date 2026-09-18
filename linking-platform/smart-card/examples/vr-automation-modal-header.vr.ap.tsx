import React from 'react';

import { IntlProvider } from 'react-intl';

import Modal from '@atlaskit/modal-dialog/modal-dialog';

import { AutomationMenuProvider } from '../src/view/FlexibleCard/components/actions/automation-action/automation-manual-triggers/manual-triggers-modal/menu-context/AutomationMenuProvider';
import { AutomationModalHeader } from '../src/view/FlexibleCard/components/actions/automation-action/automation-manual-triggers/manual-triggers-modal/sub-components/header/main';

const mockMenuContext = {
	triggerFetch: async () => {},
	initialised: false,
	rules: [],
	invokingRuleId: null,
	invokeRuleOrShowDialog: () => {},
	analyticsSource: 'vr',
	baseAutomationUrl: '/wiki',
	canManageAutomation: false,
	fetchError: null,
	objectAri: 'ari:cloud:confluence:test:page/1',
	ruleExecutionState: 'NONE' as const,
};

export default function AutomationModalHeaderOpen(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<AutomationMenuProvider value={mockMenuContext}>
				<Modal onClose={() => {}}>
					<AutomationModalHeader modalTitle="Automate" />
				</Modal>
			</AutomationMenuProvider>
		</IntlProvider>
	);
}
