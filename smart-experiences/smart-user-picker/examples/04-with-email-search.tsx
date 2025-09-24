import React from 'react';
import { IntlProvider } from 'react-intl-next';
import SmartUserPicker from '../src';
import { useEndpointMocks } from '../example-helpers/mock-endpoints-for-emails';
import '../example-helpers/mock-ufo';

const ExampleWithEmailSearch = () => {
	useEndpointMocks();

	const baseProps = {
		fieldId: 'assignee',
		productKey: 'confluence',
		siteId: 'example-site-id',
		maxOptions: 10,
	};

	return (
		<IntlProvider locale="en">
			<div>
				<h2>Smart User Picker with Email Props</h2>
				<div>
					<h3>displayEmailInByline is enabled</h3>
					<p>Displays email in byline when available</p>
					<SmartUserPicker
						{...baseProps}
						displayEmailInByline={true}
						placeholder="Search by name"
					/>
				</div>

				<div>
					<h3>enableEmailSearch is enabled</h3>
					<p>Allows searching by email</p>
					<SmartUserPicker
						{...baseProps}
						displayEmailInByline={true}
						enableEmailSearch={true}
						placeholder="Search by name or email"
					/>
				</div>

				<div>
					<h3>enableEmailSearch is enabled, allowEmail is enabled</h3>
					<p>Allows searching by & selection of emails</p>
					<SmartUserPicker
						{...baseProps}
						displayEmailInByline={true}
						enableEmailSearch={true}
						allowEmail={true}
						placeholder="Search by name or enter email"
					/>
				</div>

				<div>
					<h3>enableEmailSearch is enabled, allowEmail is enabled, allowEmailSelectionWhenEmailMatched is disabled</h3>
					<p>Allows searching by & selection of emails, email selection disabled on email match</p>
					<SmartUserPicker
						{...baseProps}
						displayEmailInByline={true}
						enableEmailSearch={true}
						allowEmail={true}
						allowEmailSelectionWhenEmailMatched={false}
						placeholder="Search by name or enter email"
					/>
				</div>
			</div>

		</IntlProvider>
	);
};

export default ExampleWithEmailSearch;
