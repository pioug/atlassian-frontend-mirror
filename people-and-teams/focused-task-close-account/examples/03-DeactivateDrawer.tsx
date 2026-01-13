import React from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button/new';

import accessibleSites from '../src/mocks/accessibleSites';
import { catherineHirons } from '../src/mocks/users';
import { FocusedTaskCloseAccount, DeactivateUserOverviewScreen } from '../src';

const submitButton = (
	<Button appearance="primary" onClick={() => null}>
		Deactivate account
	</Button>
);

const deactivateUserOverviewScreen = (
	<DeactivateUserOverviewScreen
		accessibleSites={accessibleSites}
		isCurrentUser={false}
		user={catherineHirons}
	/>
);

export default class DeactivateDrawerExample extends React.Component {
	state = {
		isOpen: false,
	};

	openDrawer = (): void => this.setState({ isOpen: true });

	closeDrawer = (): void => this.setState({ isOpen: false });

	render(): React.JSX.Element {
		return (
			<IntlProvider locale="en">
				<React.Fragment>
					<span>
						<Button onClick={this.openDrawer}>Open drawer</Button>
					</span>
					{this.state.isOpen && (
						<FocusedTaskCloseAccount
							onClose={this.closeDrawer}
							isOpen
							screens={[deactivateUserOverviewScreen]}
							submitButton={submitButton}
							learnMoreLink={'https://hello.atlassian.net'}
						/>
					)}
				</React.Fragment>
			</IntlProvider>
		);
	}
}
