import React, { useEffect } from 'react';
import { CardErrorBoundary } from '../../../../react/nodes/fallback';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Loadable from 'react-loadable';

describe('Renderer - React/Nodes/Fallback', () => {
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
			<CardErrorBoundary
				url={url}
				unsupportedComponent={MockedUnsupportedInline}
				isDatasource={true}
			>
				<MockedChildren />
				<FakeExplodingComponent />
			</CardErrorBoundary>,
		);

		await act(async () => {
			await Loadable.preloadAll();
		});

		expect(isSafeUrl(url)).toBe(true);

		await waitFor(() =>
			expect(
				screen.getByRole('link', {
					name: url,
				}),
			).toBeInTheDocument(),
		);
	});

	it('should render blue link if error occurs, when url is present and isDatasource is true and isSafeUrl is false', async () => {
		const unsafeUrl = 'javascript:alert(1)';
		render(
			<CardErrorBoundary
				url={unsafeUrl}
				unsupportedComponent={MockedUnsupportedInline}
				isDatasource={true}
			>
				<MockedChildren />
				<FakeExplodingComponent />
			</CardErrorBoundary>,
		);

		expect(isSafeUrl(unsafeUrl)).toBe(false);

		await waitFor(() =>
			expect(
				screen.getByRole('link', {
					name: unsafeUrl,
				}),
			).toBeInTheDocument(),
		);
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
});
