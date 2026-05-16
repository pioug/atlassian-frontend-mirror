import React from 'react';

import { ffTest } from '@atlassian/feature-flags-test-utils';
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
		mockDocumentIconModuleLoaded.mockClear();
		mockDocumentIcon.mockClear();
		mockBlogIconModuleLoaded.mockClear();
		mockLiveDocumentIconModuleLoaded.mockClear();
		mockBlogIcon.mockClear();
		mockLiveDocumentIcon.mockClear();
	});

	ffTest.on('platform_sl_icons_refactor', 'when icon refactor is enabled', () => {
		it('does not load synchronous fallback icon modules', () => {
			render(
				<AtlaskitIcon
					icon={IconType.Document}
					testId="document-icon"
					size={SmartLinkSize.Medium}
				/>,
			);
			render(<AtlaskitIcon icon={IconType.Blog} testId="blog-icon" size={SmartLinkSize.Medium} />);
			render(
				<AtlaskitIcon
					icon={IconType.LiveDocument}
					testId="live-document-icon"
					size={SmartLinkSize.Medium}
				/>,
			);

			expect(mockDocumentIconModuleLoaded).not.toHaveBeenCalled();
			expect(mockBlogIconModuleLoaded).not.toHaveBeenCalled();
			expect(mockLiveDocumentIconModuleLoaded).not.toHaveBeenCalled();
			expect(mockDocumentIcon).not.toHaveBeenCalled();
			expect(mockBlogIcon).not.toHaveBeenCalled();
			expect(mockLiveDocumentIcon).not.toHaveBeenCalled();
		});
	});

	ffTest.off('platform_sl_icons_refactor', 'when icon refactor is disabled', () => {
		it('keeps synchronous fallback rendering', () => {
			render(
				<AtlaskitIcon
					icon={IconType.Document}
					testId="document-icon"
					size={SmartLinkSize.Medium}
				/>,
			);
			render(<AtlaskitIcon icon={IconType.Blog} testId="blog-icon" size={SmartLinkSize.Medium} />);
			render(
				<AtlaskitIcon
					icon={IconType.LiveDocument}
					testId="live-document-icon"
					size={SmartLinkSize.Medium}
				/>,
			);

			expect(mockDocumentIconModuleLoaded).toHaveBeenCalledTimes(1);
			expect(mockBlogIconModuleLoaded).toHaveBeenCalledTimes(1);
			expect(mockLiveDocumentIconModuleLoaded).toHaveBeenCalledTimes(1);
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
});
