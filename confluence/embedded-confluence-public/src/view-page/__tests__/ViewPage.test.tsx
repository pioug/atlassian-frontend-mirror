import { render, screen } from '@testing-library/react';
import React from 'react';
import { DEFAULT_LOCALE } from '@atlassian/embedded-confluence-common';

import { ViewPage, type ViewPageProps } from '../';

const defaultProps: ViewPageProps = {
	locale: DEFAULT_LOCALE,
	contentId: '123',
	spaceKey: 'TEST',
	parentProduct: 'test',
	parentProductContentContainerId: '10000',
};

const mockDefaultHost = 'mock.host';
const mockDefaultProtocol = 'http:';
const originalLocation: Location = window.location;

beforeEach(() => {
	jsdom.reconfigure({
		url: `${mockDefaultProtocol}//${mockDefaultHost}`,
	});
});

afterEach(() => {
	// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
	window.location = originalLocation;
});

it('should use default locale to localize by if no locale was provided', async () => {
	render(<ViewPage {...defaultProps} locale={undefined} />);

	const iframe = await screen.findByTestId('confluence-page-iframe');
	expect(iframe).toHaveAttribute(
		'src',
		`${mockDefaultProtocol}//${mockDefaultHost}/wiki/spaces/TEST/pages/123?parentProduct=test&parentProductContentContainerId=10000&locale=${DEFAULT_LOCALE}`,
	);
});

it('should localize by the locale provided', async () => {
	const locale = 'zh-CN';
	render(<ViewPage {...defaultProps} locale={locale} />);

	const iframe = await screen.findByTestId('confluence-page-iframe');
	expect(iframe).toHaveAttribute(
		'src',
		`${mockDefaultProtocol}//${mockDefaultHost}/wiki/spaces/TEST/pages/123?parentProduct=test&parentProductContentContainerId=10000&locale=${locale}`,
	);
});
