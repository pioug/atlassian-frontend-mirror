import React from 'react';

import { render } from '@testing-library/react';

import { IFrame } from '../../IFrame';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(() => true),
}));

jest.mock('../../../../../hooks/useConfluencePageData', () => ({
	useConfluencePageData: jest.fn(),
}));

const mockPage = jest.fn((_props: any) => null);
jest.mock('@atlaskit/embedded-confluence', () => ({
	Page: (props: any) => mockPage(props),
}));

describe('IFrame', () => {
	const onLoad = jest.fn();
	const onMouseEnter = jest.fn();
	const onMouseLeave = jest.fn();
	const childRef = React.createRef<HTMLIFrameElement>();

	const renderComponent = () => {
		const { useConfluencePageData } = require('../../../../../hooks/useConfluencePageData');
		(useConfluencePageData as jest.Mock).mockReturnValue({
			hostname: 'mock.host',
			spaceKey: 'ABC',
			contentId: '123',
			parentProduct: 'TestProduct',
			hash: '',
			mode: 'testMode',
			locale: 'en-US',
			allowedFeatures: { view: ['edit'], edit: ['template-browser'] },
			themeStateObject: { colorMode: 'dark' },
			userInfo: { userId: 'testUser', userIdType: 'atlassianAccount' },
		});

		const { container } = render(
			<IFrame
				childRef={childRef}
				onLoad={onLoad}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				sandbox="allow-scripts allow-same-origin"
				src="https://example.com/wiki/spaces/ABC/pages/123"
				extensionKey="confluence.page"
			/>,
		);

		return { container };
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderComponent();
		await expect(container).toBeAccessible();
	});

	it('should render Page with expected props when platform_deprecate_lp_cc_embed on', async () => {
		renderComponent();

		expect(mockPage).toHaveBeenCalledTimes(1);
		const props = (mockPage as jest.Mock).mock.calls[0][0];

		expect(props).toMatchObject({
			hostname: 'mock.host',
			spaceKey: 'ABC',
			contentId: '123',
			parentProduct: 'TestProduct',
			hash: '',
			mode: 'testMode',
			locale: 'en-US',
			allowedFeatures: { view: ['edit'], edit: ['template-browser'] },
			themeState: { colorMode: 'dark' },
			userInfo: { userId: 'testUser', userIdType: 'atlassianAccount' },
			sandbox: 'allow-scripts allow-same-origin',
			onLoad,
			onMouseEnter,
			onMouseLeave,
		});

		expect(props.iframeRef).toBe(childRef);
	});
});
