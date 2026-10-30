import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { IconType, SmartLinkSize } from '../../../../../constants';
import { getLazyIconComponent } from '../../../../../utils/lazy-component';
import AtlaskitIcon from './index';

const mockGetLazyIconComponent = getLazyIconComponent as jest.Mock;

jest.mock('../../../../../utils/lazy-component', () => {
	const actual = jest.requireActual('../../../../../utils/lazy-component');
	return { ...actual, getLazyIconComponent: jest.fn(actual.getLazyIconComponent) };
});

const mockDocumentIconModuleLoaded = jest.fn();
const mockBlogIconModuleLoaded = jest.fn();
const mockLiveDocumentIconModuleLoaded = jest.fn();
var mockConfluenceIcon: jest.Mock;
var mockJiraIcon: jest.Mock;
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

jest.mock('@atlaskit/icon/icon-tile', () =>
	jest.fn(({ appearance }: { appearance: string }) => (
		<span data-testid="icon-tile" data-appearance={appearance} />
	)),
);

jest.mock('@atlaskit/icon/icon-tile', () =>
	jest.fn(({ appearance }: { appearance: string }) => (
		<span data-testid="icon-tile" data-appearance={appearance} />
	)),
);

jest.mock('@atlaskit/logo/confluence-icon', () => {
	mockConfluenceIcon = jest.fn(({ testId }: { testId?: string }) => <span data-testid={testId} />);

	return {
		...jest.requireActual('@atlaskit/logo/confluence-icon'),
		ConfluenceIcon: mockConfluenceIcon,
	};
});
jest.mock('@atlaskit/logo/jira-icon', () => {
	mockJiraIcon = jest.fn(({ testId }: { testId?: string }) => <span data-testid={testId} />);
	return {
		...jest.requireActual('@atlaskit/logo/jira-icon'),
		JiraIcon: mockJiraIcon,
	};
});

describe('AtlaskitIcon', () => {
	beforeEach(() => {
		mockDocumentIcon.mockClear();
		mockBlogIcon.mockClear();
		mockLiveDocumentIcon.mockClear();
		mockConfluenceIcon.mockClear();
		mockJiraIcon.mockClear();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<AtlaskitIcon icon={IconType.Document} testId="document-icon" size={SmartLinkSize.Medium} />,
		);

		await expect(container).toBeAccessible();
	});

	it('keeps synchronous rendering for document-like icon types', () => {
		render(
			<AtlaskitIcon icon={IconType.Document} testId="document-icon" size={SmartLinkSize.Medium} />,
		);
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

	it('passes an empty label to ConfluenceIcon and JiraIcon', () => {
		failGate('platform_sl_replace_react_loadable');
		render(
			<>
				<AtlaskitIcon icon={IconType.Confluence} testId="confluence-icon" />
				<AtlaskitIcon icon={IconType.Jira} testId="jira-icon" />
			</>,
		);

		expect(mockConfluenceIcon).toHaveBeenCalledWith(
			expect.objectContaining({ testId: 'confluence-icon', label: '' }),
			expect.anything(),
		);
		expect(mockJiraIcon).toHaveBeenCalledWith(
			expect.objectContaining({ testId: 'jira-icon', label: '' }),
			expect.anything(),
		);
	});

	describe.each([
		['on', passGate],
		['off', failGate],
	])('priority icons when platform_sl_replace_react_loadable is %s', (_, setGate) => {
		beforeEach(() => {
			setGate('platform_sl_replace_react_loadable');
		});

		it('renders priority icon directly at medium size without IconTile wrapper', async () => {
			render(
				<AtlaskitIcon
					icon={IconType.PriorityHigh}
					testId="priority-high-icon"
					label="Priority: High"
					size={SmartLinkSize.Medium}
				/>,
			);

			expect(await screen.findByTestId('priority-high-icon')).toBeInTheDocument();
			expect(screen.queryByTestId('icon-tile')).not.toBeInTheDocument();
		});

		it('renders priority icon directly at large size without wrapping in IconTile', async () => {
			render(
				<AtlaskitIcon
					icon={IconType.PriorityHigh}
					testId="priority-high-icon"
					label="Priority: High"
					size={SmartLinkSize.Large}
				/>,
			);

			expect(await screen.findByTestId('priority-high-icon')).toBeInTheDocument();
			expect(screen.queryByTestId('icon-tile')).not.toBeInTheDocument();
		});
	});

	describe('lazy loading', () => {
		it('uses the cached React.lazy icon when platform_sl_replace_react_loadable is on', async () => {
			passGate('platform_sl_replace_react_loadable');
			mockGetLazyIconComponent.mockClear();

			render(
				<AtlaskitIcon
					icon={IconType.PriorityHigh}
					testId="priority-high-icon"
					label="Priority: High"
					size={SmartLinkSize.Medium}
				/>,
			);

			expect(await screen.findByTestId('priority-high-icon')).toBeInTheDocument();
			expect(mockGetLazyIconComponent).toHaveBeenCalledTimes(1);
		});

		it('does not use the React.lazy icon when platform_sl_replace_react_loadable is off', () => {
			failGate('platform_sl_replace_react_loadable');
			mockGetLazyIconComponent.mockClear();

			render(
				<AtlaskitIcon
					icon={IconType.PriorityHigh}
					testId="priority-high-icon"
					label="Priority: High"
					size={SmartLinkSize.Medium}
				/>,
			);

			expect(screen.getByTestId('priority-high-icon')).toBeInTheDocument();
			expect(mockGetLazyIconComponent).not.toHaveBeenCalled();
		});

		it('keeps rendering the IconTile while the lazy icon inside it loads', () => {
			passGate('platform_sl_replace_react_loadable');

			render(<AtlaskitIcon icon={IconType.Comment} label="comment" size={SmartLinkSize.Large} />);

			expect(screen.getByTestId('icon-tile')).toBeInTheDocument();
		});
	});

	it('uses a non-bold gray tile for badge icons at large size when platform_lp_non_bold_large_sl_icon is on', () => {
		passGate('platform_lp_non_bold_large_sl_icon');
		failGate('platform_sl_replace_react_loadable');

		render(<AtlaskitIcon icon={IconType.Comment} label="comment" size={SmartLinkSize.Large} />);

		expect(screen.getByTestId('icon-tile')).toHaveAttribute('data-appearance', 'gray');
	});

	it('keeps the bold gray tile for badge icons at large size when platform_lp_non_bold_large_sl_icon is off', () => {
		failGate('platform_lp_non_bold_large_sl_icon');
		failGate('platform_sl_replace_react_loadable');

		render(<AtlaskitIcon icon={IconType.Comment} label="comment" size={SmartLinkSize.Large} />);

		expect(screen.getByTestId('icon-tile')).toHaveAttribute('data-appearance', 'grayBold');
	});
});
