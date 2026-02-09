import React, { useEffect } from 'react';
import { CardErrorBoundary } from '../../../../react/nodes/fallback';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Loadable from 'react-loadable';
import { fg } from '@atlaskit/platform-feature-flags';

// Mock the platform feature flags
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/Fallback', () => {
	const mockFg = fg as jest.MockedFunction<typeof fg>;

	beforeEach(() => {
		mockFg.mockReset();
	});

	const FakeExplodingComponent = () => {
		useEffect(() => {
			throw new Error('KABOOOM!');
		}, []);

		return <></>;
	};
	const MockedUnsupportedInline = () => <div>Unsupported Inline</div>;
	const MockedChildren = () => <div>Rendered Children</div>;
	const url = 'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424';

	beforeEach(() => {
		global.console.error = jest.fn();
	});

	it('should render children if no error', () => {
		render(
			<CardErrorBoundary url={url} unsupportedComponent={MockedUnsupportedInline}>
				<MockedChildren />
			</CardErrorBoundary>,
		);

		expect(screen.getByText('Rendered Children')).toBeVisible();
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('should render url if error occurs when datasource is not present and url is present', () => {
		render(
			<CardErrorBoundary
				url={url}
				unsupportedComponent={MockedUnsupportedInline}
				isDatasource={false}
			>
				<MockedChildren />
				<FakeExplodingComponent />
			</CardErrorBoundary>,
		);

		expect(
			screen.getByRole('link', {
				name: url,
			}),
		).toBeVisible();
		expect(screen.queryByText('Rendered Children')).not.toBeInTheDocument();
	});

	it('should render unsupportedComponent if error occurs, when url is not present', () => {
		render(
			<CardErrorBoundary unsupportedComponent={MockedUnsupportedInline}>
				<MockedChildren />
				<FakeExplodingComponent />
			</CardErrorBoundary>,
		);

		expect(screen.getByText('Unsupported Inline')).toBeVisible();
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('should render InlineCard if error occurs, when url is present and isDatasource is true and isSafeUrl is true', async () => {
		render(
			<Provider client={new Client('staging')}>
				<CardErrorBoundary
					url={url}
					unsupportedComponent={MockedUnsupportedInline}
					isDatasource={true}
				>
					<MockedChildren />
					<FakeExplodingComponent />
				</CardErrorBoundary>
			</Provider>,
		);

		await act(async () => {
			await Loadable.preloadAll();
		});

		expect(isSafeUrl(url)).toBe(true);

		await screen.findByRole('link', {
			name: url,
		});
	});

	it('should render blue link if error occurs, when url is present and isDatasource is true and isSafeUrl is false', async () => {
		const unsafeUrl = 'javascript:alert(1)';
		render(
			<Provider client={new Client('staging')}>
				<CardErrorBoundary
					url={unsafeUrl}
					unsupportedComponent={MockedUnsupportedInline}
					isDatasource={true}
				>
					<MockedChildren />
					<FakeExplodingComponent />
				</CardErrorBoundary>
			</Provider>,
		);

		expect(isSafeUrl(unsafeUrl)).toBe(false);

		await screen.findByRole('link', {
			name: unsafeUrl,
		});
		expect(screen.queryByText('Rendered Children')).not.toBeInTheDocument();
	});

	it('should render url if error occurs and click on anchor should trigger onClick callback, when url is present', async () => {
		const mockedOnClick = jest.fn();
		render(
			<CardErrorBoundary
				onClick={mockedOnClick}
				url={url}
				unsupportedComponent={MockedUnsupportedInline}
			>
				<MockedChildren />
				<FakeExplodingComponent />
			</CardErrorBoundary>,
		);

		await userEvent.click(
			screen.getByRole('link', {
				name: url,
			}),
		);

		expect(mockedOnClick).toHaveBeenCalledTimes(1);
	});

	it('should render Link component', () => {
		mockFg.mockImplementation(
			(flag: string) => flag === 'dst-a11y__replace-anchor-with-link__editor',
		);

		render(
			<CardErrorBoundary url={url} unsupportedComponent={MockedUnsupportedInline}>
				<MockedChildren />
				<FakeExplodingComponent />
			</CardErrorBoundary>,
		);

		const link = screen.getByRole('link', { name: url });
		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', url);
	});

	it('should render anchor element with explicit props when dst-a11y__replace-anchor-with-link__editor FG is disabled', () => {
		mockFg.mockReturnValue(false);

		render(
			<CardErrorBoundary url={url} unsupportedComponent={MockedUnsupportedInline}>
				<MockedChildren />
				<FakeExplodingComponent />
			</CardErrorBoundary>,
		);

		const link = screen.getByRole('link', { name: url });
		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', url);
		expect(link.tagName).toBe('A');
	});

	describe('Link External Icon rendering for fallback link', () => {
		it('should set target and rel attributes when onSetLinkTarget returns _blank when FG is enabled', () => {
			mockFg.mockImplementation(
				(flag: string) =>
					flag === 'rovo_chat_deep_linking_enabled' ||
					flag === 'dst-a11y__replace-anchor-with-link__editor',
			);

			const mockOnSetLinkTarget = jest.fn().mockReturnValue('_blank');

			render(
				<CardErrorBoundary
					url={url}
					onSetLinkTarget={mockOnSetLinkTarget}
					unsupportedComponent={MockedUnsupportedInline}
				>
					<MockedChildren />
					<FakeExplodingComponent />
				</CardErrorBoundary>,
			);

			const link = screen.getByRole('link');
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noreferrer noopener');
			expect(mockOnSetLinkTarget).toHaveBeenCalledWith(url);
		});

		it('should not set target and rel attributes when onSetLinkTarget returns _blank and FG is OFF', () => {
			mockFg.mockImplementation(
				(flag: string) => flag === 'dst-a11y__replace-anchor-with-link__editor',
			);

			const mockOnSetLinkTarget = jest.fn().mockReturnValue('_blank');

			render(
				<CardErrorBoundary
					url={url}
					onSetLinkTarget={mockOnSetLinkTarget}
					unsupportedComponent={MockedUnsupportedInline}
				>
					<MockedChildren />
					<FakeExplodingComponent />
				</CardErrorBoundary>,
			);

			const link = screen.getByRole('link');
			expect(link).not.toHaveAttribute('target');
			expect(link).not.toHaveAttribute('rel');
			expect(mockOnSetLinkTarget).not.toHaveBeenCalled();
		});

		it('should not set target and rel attributes when onSetLinkTarget returns undefined', () => {
			mockFg.mockImplementation(
				(flag: string) =>
					flag === 'rovo_chat_deep_linking_enabled' ||
					flag === 'dst-a11y__replace-anchor-with-link__editor',
			);

			const mockOnSetLinkTarget = jest.fn().mockReturnValue(undefined);

			render(
				<CardErrorBoundary
					url={url}
					onSetLinkTarget={mockOnSetLinkTarget}
					unsupportedComponent={MockedUnsupportedInline}
				>
					<MockedChildren />
					<FakeExplodingComponent />
				</CardErrorBoundary>,
			);

			const link = screen.getByRole('link', { name: url });
			expect(link).not.toHaveAttribute('target');
			expect(link).not.toHaveAttribute('rel');
		});

		it('should handle onSetLinkTarget throwing error gracefully', () => {
			mockFg.mockImplementation(
				(flag: string) =>
					flag === 'rovo_chat_deep_linking_enabled' ||
					flag === 'dst-a11y__replace-anchor-with-link__editor',
			);

			const mockOnSetLinkTarget = jest.fn().mockImplementation(() => {
				throw new Error('URL parsing failed');
			});

			render(
				<CardErrorBoundary
					url={url}
					onSetLinkTarget={mockOnSetLinkTarget}
					unsupportedComponent={MockedUnsupportedInline}
				>
					<MockedChildren />
					<FakeExplodingComponent />
				</CardErrorBoundary>,
			);

			const link = screen.getByRole('link', { name: url });
			expect(link).toBeVisible();
			expect(link).not.toHaveAttribute('target');
			expect(link).not.toHaveAttribute('rel');
		});
	});
});
