import React from 'react';
import { IntlProvider } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { token } from '@atlaskit/tokens';

import accessibleSites from '../src/mocks/accessibleSites';
import { catherineHirons } from '../src/mocks/users';
import StatefulInlineDialog from '../src/components/StatefulInlineDialog';
import {
	FocusedTaskCloseAccount,
	DeleteUserOverviewScreen,
	DeleteUserContentPreviewScreen,
} from '../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Controls = styled.div({
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'>': {
		paddingRight: token('space.050', '4px'),
	},
});

const submitButton = (
	<Button appearance="primary" onClick={() => null}>
		Delete account
	</Button>
);

export default class DeleteUserDrawerExample extends React.Component {
	state = {
		isCurrentUser: false,
		isOpen: false,
		isUserDeactivated: false,
	};

	openDrawer = () => this.setState({ isOpen: true });

	closeDrawer = () => this.setState({ isOpen: false });

	handleDeactivateUser = () => <React.Fragment />;

	handlePreferenceSelection = (name: string) => {
		// do nothing
	};

	toggleIsCurrentUser = (event: any) => this.setState({ isCurrentUser: event.target.checked });

	toggleIsUserDeactivated = (event: any) =>
		this.setState({ isUserDeactivated: event.target.checked });

	renderDeleteUserOverviewScreen = () => (
		<DeleteUserOverviewScreen
			accessibleSites={accessibleSites}
			isCurrentUser={this.state.isCurrentUser}
			user={catherineHirons}
			deactivateUserHandler={this.handleDeactivateUser}
			isUserDeactivated={this.state.isUserDeactivated}
		/>
	);

	renderDeleteUserContentPreviewScreen = () => (
		<DeleteUserContentPreviewScreen
			user={catherineHirons}
			isCurrentUser={this.state.isCurrentUser}
			preferenceSelection={this.handlePreferenceSelection}
		/>
	);

	render() {
		return (
			<IntlProvider locale="en">
				<React.Fragment>
					<Controls>
						<Button onClick={this.openDrawer}>Open drawer</Button>
						<Checkbox
							label={
								<StatefulInlineDialog
									placement="right"
									content="Toggles between 2nd and 3rd person text."
								>
									Is current user
								</StatefulInlineDialog>
							}
							onChange={this.toggleIsCurrentUser}
							name="toggle-is-current-user"
						/>
						<Checkbox
							label={
								<StatefulInlineDialog
									placement="right"
									content="Toggles between active and deactivated user."
								>
									Is user deactivated
								</StatefulInlineDialog>
							}
							onChange={this.toggleIsUserDeactivated}
							name="toggle-is-user-deactivated"
						/>
					</Controls>
					{this.state.isOpen && (
						<FocusedTaskCloseAccount
							onClose={this.closeDrawer}
							isOpen
							screens={[
								this.renderDeleteUserOverviewScreen(),
								this.renderDeleteUserContentPreviewScreen(),
							]}
							submitButton={submitButton}
							learnMoreLink={'https://hello.atlassian.net'}
						/>
					)}
				</React.Fragment>
			</IntlProvider>
		);
	}
}
