import React from 'react';

import { render } from '@atlassian/testing-library';

import { IconType, SmartLinkSize } from '../../../../../constants';

import AtlaskitIcon from './index';

const mockDocumentIconModuleLoaded = jest.fn();
const mockBlogIconModuleLoaded = jest.fn();
const mockLiveDocumentIconModuleLoaded = jest.fn();
const mockDocumentIcon = jest.fn(({ testId }: { testId?: string }) => (
	<span data-testid={testId} />
));
const mockBlogIcon = jest.fn(({ testId }: { testId?: string }) => <span data-testid={testId} />);
const mockLiveDocumentIcon = jest.fn(({ testId }: { testId?: string }) => (
	<span data-testid={testId} />
));
jest.mock('react-loadable', () =>
	jest.fn(() => ({ testId }: { testId?: string }) => <span data-testid={testId} />),
);

jest.mock('../../../../../common/ui/icons/page-icon', () => {
	mockDocumentIconModuleLoaded();
	return {
		__esModule: true,
		default: mockDocumentIcon,
	};
});

jest.mock('../../../../../common/ui/icons/blog-icon', () => {
	mockBlogIconModuleLoaded();
	return {
		__esModule: true,
		default: mockBlogIcon,
	};
});

jest.mock('../../../../../common/ui/icons/live-document-icon', () => {
	mockLiveDocumentIconModuleLoaded();
	return {
		__esModule: true,
		default: mockLiveDocumentIcon,
	};
});

describe('AtlaskitIcon', () => {
	beforeEach(() => {
		mockDocumentIcon.mockClear();
		mockBlogIcon.mockClear();
		mockLiveDocumentIcon.mockClear();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<AtlaskitIcon icon={IconType.Document} testId="document-icon" size={SmartLinkSize.Medium} />,
		);

		await expect(container).toBeAccessible();
	});

	it('keeps synchronous rendering for document-like icon types', () => {
		render(<AtlaskitIcon icon={IconType.Document} testId="document-icon" size={SmartLinkSize.Medium} />);
		render(<AtlaskitIcon icon={IconType.Blog} testId="blog-icon" size={SmartLinkSize.Medium} />);
		render(
			<AtlaskitIcon
				icon={IconType.LiveDocument}
				testId="live-document-icon"
				size={SmartLinkSize.Medium}
			/>,
		);

		expect(mockDocumentIcon).toHaveBeenCalledWith(
			expect.objectContaining({ testId: 'document-icon', size: SmartLinkSize.Medium }),
			expect.anything(),
		);
		expect(mockBlogIcon).toHaveBeenCalledWith(
			expect.objectContaining({ testId: 'blog-icon', size: SmartLinkSize.Medium }),
			expect.anything(),
		);
		expect(mockLiveDocumentIcon).toHaveBeenCalledWith(
			expect.objectContaining({ testId: 'live-document-icon', size: SmartLinkSize.Medium }),
			expect.anything(),
		);
	});
});
