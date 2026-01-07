import React, { type Ref } from 'react';

import { render, screen } from '@testing-library/react';
// import ReactDOM from 'react-dom';

import LoadingContainerAdvanced from '../../loading-container-advanced'; // LoadingContainerAdvancedProps,

const testId = 'dynamic--table--test--id';
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('LoadingContainerAdvanced', () => {
	// let wrappers: Array<
	//   | ReactWrapper<LoadingContainerAdvancedProps, {}, LoadingContainerAdvanced>
	//   | ShallowWrapper<LoadingContainerAdvancedProps>
	// >;

	// beforeEach(() => {
	//   wrappers = [];
	// });

	it('should always wrap contents into the container with a relative position so absolute positioned elements inside the children behave consistently despite the loading mode', () => {
		const { rerender } = render(
			<LoadingContainerAdvanced testId={testId} isLoading>
				<div />
			</LoadingContainerAdvanced>,
		);

		let container = screen.getByTestId(`${testId}--loading--container--advanced`);
		expect(container).toBeInTheDocument();

		rerender(
			<LoadingContainerAdvanced testId={testId} isLoading={false}>
				<div />
			</LoadingContainerAdvanced>,
		);

		container = screen.getByTestId(`${testId}--loading--container--advanced`);
		expect(container).toBeInTheDocument();
	});

	it('should always render children as is right inside the container', () => {
		const { rerender } = render(
			<LoadingContainerAdvanced testId={testId} isLoading>
				<div data-testid={`${testId}--contents`} />
			</LoadingContainerAdvanced>,
		);

		let contents = screen.getByTestId(`${testId}--contents`);
		expect(contents).toBeInTheDocument();

		rerender(
			<LoadingContainerAdvanced testId={testId} isLoading={false}>
				<div data-testid={`${testId}--contents`} />
			</LoadingContainerAdvanced>,
		);

		contents = screen.getByTestId(`${testId}--contents`);
		expect(contents).toBeInTheDocument();
	});

	it('should not render the spinner container when the loading mode is off', () => {
		render(
			<LoadingContainerAdvanced testId={testId} isLoading={false}>
				<div />
			</LoadingContainerAdvanced>,
		);
		const spinnerBackdrop = screen.queryByTestId(`${testId}--spinner-backdrop`);
		expect(spinnerBackdrop).not.toBeInTheDocument();
	});

	it('should render with a proper default values', () => {
		render(
			<LoadingContainerAdvanced testId={testId}>
				<div />
			</LoadingContainerAdvanced>,
		);

		const spinner = screen.getByTestId(`${testId}--loadingSpinner`);
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveAttribute('width', '48');
		expect(spinner).toHaveAccessibleName('Loading table');
	});

	it('should accept a label for accessible name', () => {
		const label = 'Table loading';

		render(
			<LoadingContainerAdvanced testId={testId} loadingLabel={label}>
				<div />
			</LoadingContainerAdvanced>,
		);

		const spinner = screen.getByRole('img');
		expect(spinner).toHaveAccessibleName(label);
	});

	it('should render the spinner of a given size', () => {
		render(
			<LoadingContainerAdvanced testId={testId} spinnerSize="xlarge">
				<div />
			</LoadingContainerAdvanced>,
		);
		const spinner = screen.getByTestId(`${testId}--loadingSpinner`);
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveAttribute('width', '96');
	});

	describe('target manipulations', () => {
		const assertTargetStylesAreCorrect = (node: HTMLElement, isLoading: boolean) => {
			expect(node.style.pointerEvents).toBe(isLoading ? 'none' : '');
		};

		it('should update styles on mount only when loading and there is a target node', () => {
			const Contents = (props: { contentRef?: Ref<any> }) => {
				return <div ref={props.contentRef} data-testid={`${testId}--content`} />;
			};

			let target: HTMLTableSectionElement | null = null;

			// targetRef returns invalid target
			const { rerender } = render(
				<LoadingContainerAdvanced targetRef={() => null}>
					<Contents />
				</LoadingContainerAdvanced>,
			);
			let contents = screen.getByTestId(`${testId}--content`);
			assertTargetStylesAreCorrect(contents, false);

			// Not loading
			rerender(
				<LoadingContainerAdvanced isLoading={false} testId={testId}>
					<Contents />
				</LoadingContainerAdvanced>,
			);
			contents = screen.getByTestId(`${testId}--loading--container--advanced`);
			assertTargetStylesAreCorrect(contents, false);

			// Loading and has children
			rerender(
				<LoadingContainerAdvanced testId={testId}>
					<Contents />
				</LoadingContainerAdvanced>,
			);
			contents = screen.getByTestId(`${testId}--loading--container--advanced`);
			assertTargetStylesAreCorrect(contents, true);

			// Loading and has a valid target
			rerender(
				<LoadingContainerAdvanced targetRef={() => target}>
					<Contents
						contentRef={(el: any) => {
							target = el;
						}}
					/>
				</LoadingContainerAdvanced>,
			);
			contents = screen.getByTestId(`${testId}--content`);
			assertTargetStylesAreCorrect(contents, true);
		});

		it('should set styles to the container if the targetRef is not defined and revert them on loading mode change', () => {
			const { rerender } = render(
				<LoadingContainerAdvanced testId={testId}>
					<div />
				</LoadingContainerAdvanced>,
			);
			let contents = screen.getByTestId(`${testId}--loading--container--advanced`);
			assertTargetStylesAreCorrect(contents, true);

			rerender(
				<LoadingContainerAdvanced isLoading={false} testId={testId}>
					<div data-testid={`${testId}--content`} />
				</LoadingContainerAdvanced>,
			);
			contents = screen.getByTestId(`${testId}--loading--container--advanced`);
			assertTargetStylesAreCorrect(contents, false);
		});

		it('should set styles to the target and revert them on loading mode change', () => {
			let target: HTMLTableSectionElement | null = null;

			const { rerender } = render(
				<LoadingContainerAdvanced targetRef={() => target}>
					<div>
						<div
							data-testid={`${testId}--inner--component`}
							ref={(el: HTMLTableSectionElement) => {
								target = el;
							}}
						/>
					</div>
				</LoadingContainerAdvanced>,
			);
			let innerComponent = screen.getByTestId(`${testId}--inner--component`);
			assertTargetStylesAreCorrect(innerComponent, true);

			rerender(
				<LoadingContainerAdvanced isLoading={false} targetRef={() => target}>
					<div>
						<div
							data-testid={`${testId}--inner--component`}
							ref={(el: HTMLTableSectionElement) => {
								target = el;
							}}
						/>
					</div>
				</LoadingContainerAdvanced>,
			);

			innerComponent = screen.getByTestId(`${testId}--inner--component`);
			assertTargetStylesAreCorrect(innerComponent, false);
		});
	});
});
