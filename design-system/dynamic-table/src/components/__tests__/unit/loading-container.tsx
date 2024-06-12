import React from 'react';

import { render, screen } from '@testing-library/react';

import { CSS_VAR_CONTENTS_OPACITY } from '../../../styled/loading-container';
import LoadingContainer from '../../loading-container';

describe('LoadingContainer', () => {
	const testId = 'dynamic--table--test--id';
	const Contents = () => <div data-testid={`${testId}--contents`}>Contents</div>;

	it('should always wrap contents into the container with a relative position so absolute positioned elements inside the children behave consistently despite the loading mode', () => {
		const { rerender } = render(
			<LoadingContainer testId={testId} isLoading>
				<Contents />
			</LoadingContainer>,
		);

		let container = screen.getByTestId(`${testId}--container`);
		expect(container).toBeInTheDocument();

		rerender(
			<LoadingContainer testId={testId} isLoading={false}>
				<Contents />
			</LoadingContainer>,
		);

		container = screen.getByTestId(`${testId}--container`);
		expect(container).toBeInTheDocument();
	});

	describe('when loading is disabled', () => {
		it('should render children as is right inside the container', () => {
			render(
				<LoadingContainer testId={testId} isLoading={false}>
					<Contents />
				</LoadingContainer>,
			);

			let contents = screen.getByTestId(`${testId}--contents`);
			expect(contents).toBeInTheDocument();
		});

		it('should not render the spinner container', () => {
			render(
				<LoadingContainer testId={testId} isLoading={false}>
					<Contents />
				</LoadingContainer>,
			);
			const spinnerContainer = screen.queryByTestId(`${testId}--spinner--container`);
			expect(spinnerContainer).not.toBeInTheDocument();
		});
	});

	describe('when loading is enabled', () => {
		it('should render with a proper default values', () => {
			render(
				<LoadingContainer testId={testId}>
					<Contents />
				</LoadingContainer>,
			);

			const loadingSpinner = screen.getByTestId(`${testId}--loadingSpinner`);
			const contentsContainer = screen.getByTestId(`${testId}--contents--container`);
			const computedStyle = getComputedStyle(contentsContainer);
			const contentsOpacity = computedStyle.getPropertyValue(CSS_VAR_CONTENTS_OPACITY);

			expect(loadingSpinner).toBeInTheDocument();
			expect(loadingSpinner).toHaveAttribute('width', '48');

			expect(contentsContainer).toBeInTheDocument();
			expect(contentsOpacity).toBe('0.22');
		});

		it('should wrap children into another container with a specified opacity', () => {
			render(
				<LoadingContainer testId={testId} contentsOpacity={0.5}>
					<Contents />
				</LoadingContainer>,
			);

			const contents = screen.getByTestId(`${testId}--contents`);
			const contentsContainer = screen.getByTestId(`${testId}--contents--container`);
			const computedStyle = getComputedStyle(contentsContainer);
			const contentsOpacity = computedStyle.getPropertyValue(CSS_VAR_CONTENTS_OPACITY);

			expect(contents).toBeInTheDocument();
			expect(contentsOpacity).toBe('0.5');
		});

		it('should render the spinner of a given size', () => {
			const { rerender } = render(
				<LoadingContainer testId={testId} spinnerSize="xlarge">
					<Contents />
				</LoadingContainer>,
			);
			let loadingSpinner = screen.getByTestId(`${testId}--loadingSpinner`);
			expect(loadingSpinner).toHaveAttribute('width', '96');

			rerender(
				<LoadingContainer testId={testId} spinnerSize="medium">
					<Contents />
				</LoadingContainer>,
			);
			loadingSpinner = screen.getByTestId(`${testId}--loadingSpinner`);
			expect(loadingSpinner).toHaveAttribute('width', '24');

			rerender(
				<LoadingContainer testId={testId} spinnerSize="small">
					<Contents />
				</LoadingContainer>,
			);
			loadingSpinner = screen.getByTestId(`${testId}--loadingSpinner`);
			expect(loadingSpinner).toHaveAttribute('width', '16');
		});

		it('should have default accessible name', () => {
			render(
				<LoadingContainer testId={testId}>
					<Contents />
				</LoadingContainer>,
			);

			const loadingSpinner = screen.getByRole('img');
			expect(loadingSpinner).toHaveAccessibleName('Loading table');
		});

		it('should accept a label for accessible name', () => {
			const label = 'Table loading';
			render(
				<LoadingContainer testId={testId} loadingLabel={label}>
					<Contents />
				</LoadingContainer>,
			);

			const loadingSpinner = screen.getByRole('img');
			expect(loadingSpinner).toHaveAccessibleName(label);
		});
	});
});
