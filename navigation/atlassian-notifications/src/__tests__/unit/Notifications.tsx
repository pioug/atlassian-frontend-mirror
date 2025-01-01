import React from 'react';
import { render, screen } from '@testing-library/react';

import { Notifications } from '../../Notifications';

describe('NotificationDrawerContents', () => {
	const testIframeUrl = async (src: string) => {
		const iframe = await screen.findByTestId('navigation-notifications');
		expect(iframe).toHaveAttribute('src', src);
	};

	it('should have no accessibility violations', async () => {
		const { container } = render(<Notifications testId="navigation-notifications" />);

		await expect(container).toBeAccessible();
	});

	it('should add the correct url to the iframe by default', async () => {
		render(<Notifications testId="navigation-notifications" />);
		await testIframeUrl('/home/notificationsDrawer/iframe.html');
	});

	it('should add the correct url to the iframe when a locale is provided', async () => {
		render(<Notifications locale="en" testId="navigation-notifications" />);
		await testIframeUrl('/home/notificationsDrawer/iframe.html?locale=en');
	});

	it('should add the correct url to the iframe when a product is provided', async () => {
		render(<Notifications product="jira" testId="navigation-notifications" />);
		await testIframeUrl('/home/notificationsDrawer/iframe.html?product=jira');
	});

	it('should add the correct url to the iframe when a locale and product is provided', async () => {
		render(<Notifications locale="en" product="jira" testId="navigation-notifications" />),
			await testIframeUrl('/home/notificationsDrawer/iframe.html?locale=en&product=jira');
	});

	it('should ignore subproduct in legacy experience', async () => {
		render(
			<Notifications
				locale="en"
				product="jira"
				subproduct="jira_software"
				testId="navigation-notifications"
			/>,
		),
			await testIframeUrl('/home/notificationsDrawer/iframe.html?locale=en&product=jira');
	});

	it('should add the correct url to the iframe when the new experience is enabled', async () => {
		render(
			<Notifications
				locale="en"
				product="jira"
				subproduct="software"
				isNewExperience
				testId="navigation-notifications"
			/>,
		),
			await testIframeUrl(
				'/home/notificationList/index.html?locale=en&product=jira&subproduct=software',
			);
	});

	it('should add override the default URL when passing the `_url` prop', async () => {
		render(
			<Notifications
				_url="http://example.com/foo.html?foo=bar&bar=baz"
				locale="en"
				product="jira"
				testId="navigation-notifications"
			/>,
		),
			await testIframeUrl('http://example.com/foo.html?foo=bar&bar=baz');
	});
});
