import { render, screen } from '@testing-library/react';
import React from 'react';
import { DEFAULT_LOCALE } from '@atlassian/embedded-confluence-common';
import { EditPage, type EditPageProps } from '../';

const defaultProps: EditPageProps = {
	locale: DEFAULT_LOCALE,
	contentId: '123',
	spaceKey: 'TEST',
	parentProduct: 'test',
	parentProductContentContainerId: '10000',
};

const mockDefaultHost = 'mock.host';
const mockDefaultProtocol = 'http:';

beforeEach(() => {
	jsdom.reconfigure({
		url: `${mockDefaultProtocol}//${mockDefaultHost}/wiki/spaces/TEST/pages/edit-embed/123`,
	});
});

it('should use the default locale to localize by if no locale was provided', async () => {
	render(<EditPage {...defaultProps} locale={undefined} />);

	const iframe = await screen.findByTestId('confluence-page-iframe');
	expect(iframe).toHaveAttribute(
		'src',
		`${mockDefaultProtocol}//${mockDefaultHost}/wiki/spaces/TEST/pages/edit-embed/123?parentProduct=test&parentProductContentContainerId=10000&locale=${DEFAULT_LOCALE}`,
	);
});

it('should localize by the locale provided', async () => {
	const locale = 'zh-CN';
	render(<EditPage {...defaultProps} locale={locale} />);

	const iframe = await screen.findByTestId('confluence-page-iframe');
	expect(iframe).toHaveAttribute(
		'src',
		`${mockDefaultProtocol}//${mockDefaultHost}/wiki/spaces/TEST/pages/edit-embed/123?parentProduct=test&parentProductContentContainerId=10000&locale=${locale}`,
	);
});
