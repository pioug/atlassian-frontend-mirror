/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import { useStaggeredEntrance } from '../../../entering/staggered-entrance';
import { StaggeredEntrance } from '../../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<StaggeredEntrance />', () => {
	const firstGroupDelay = '0ms';
	const secondGroupDelay = '52ms';
	const thirdGroupDelay = '83ms';
	const fourthGroupDelay = '104ms';
	const fifthGroupDelay = '121ms';

	interface BoundingBox {
		offsetHeight: number;
		offsetLeft: number;
		offsetTop: number;
		offsetWidth: number;
	}

	const EnteringComponent = ({ id, box }: { id: string; box?: Partial<BoundingBox> }) => {
		const staggered = useStaggeredEntrance();
		if (typeof staggered.ref === 'function') {
			staggered.ref(box as HTMLElement);
		}

		return (
			<div
				ref={box ? null : staggered.ref}
				style={{ animationDelay: `${staggered.delay}ms` }}
				data-testid={id}
			/>
		);
	};

	it('should set a staggered duration for a list of elements', () => {
		render(
			<StaggeredEntrance columns={1}>
				<EnteringComponent id="first" />
				<EnteringComponent id="second" />
				<EnteringComponent id="third" />
			</StaggeredEntrance>,
		);

		expect(screen.getByTestId('first')).toHaveStyle({ 'animation-delay': firstGroupDelay });
		expect(screen.getByTestId('second')).toHaveStyle({
			'animation-delay': secondGroupDelay,
		});
		expect(screen.getByTestId('third')).toHaveStyle({ 'animation-delay': thirdGroupDelay });
	});

	it('should set a staggered duration for a grid of elements', () => {
		render(
			<StaggeredEntrance columns={3}>
				<EnteringComponent id="top-left" />
				<EnteringComponent id="top-mid" />
				<EnteringComponent id="top-right" />
				<EnteringComponent id="mid-left" />
				<EnteringComponent id="mid-mid" />
				<EnteringComponent id="mid-right" />
				<EnteringComponent id="bottom-left" />
				<EnteringComponent id="bottom-mid" />
				<EnteringComponent id="bottom-right" />
			</StaggeredEntrance>,
		);

		expect(screen.getByTestId('top-left')).toHaveStyle({
			'animation-delay': firstGroupDelay,
		});
		expect(screen.getByTestId('top-mid')).toHaveStyle({
			'animation-delay': secondGroupDelay,
		});
		expect(screen.getByTestId('top-right')).toHaveStyle({
			'animation-delay': thirdGroupDelay,
		});
		expect(screen.getByTestId('mid-left')).toHaveStyle({
			'animation-delay': secondGroupDelay,
		});
		expect(screen.getByTestId('mid-mid')).toHaveStyle({
			'animation-delay': thirdGroupDelay,
		});
		expect(screen.getByTestId('mid-right')).toHaveStyle({
			'animation-delay': fourthGroupDelay,
		});
		expect(screen.getByTestId('bottom-left')).toHaveStyle({
			'animation-delay': thirdGroupDelay,
		});
		expect(screen.getByTestId('bottom-mid')).toHaveStyle({
			'animation-delay': fourthGroupDelay,
		});
		expect(screen.getByTestId('bottom-right')).toHaveStyle({
			'animation-delay': fifthGroupDelay,
		});
	});

	it('should set a staggered duration for the first column of a grid', () => {
		render(
			<StaggeredEntrance column={0}>
				<EnteringComponent id="first" />
				<EnteringComponent id="second" />
				<EnteringComponent id="third" />
			</StaggeredEntrance>,
		);

		expect(screen.getByTestId('first')).toHaveStyle({ 'animation-delay': firstGroupDelay });
		expect(screen.getByTestId('second')).toHaveStyle({
			'animation-delay': secondGroupDelay,
		});
		expect(screen.getByTestId('third')).toHaveStyle({ 'animation-delay': thirdGroupDelay });
	});

	it('should set a staggered duration for the second column of a grid', () => {
		render(
			<StaggeredEntrance column={1}>
				<EnteringComponent id="first" />
				<EnteringComponent id="second" />
				<EnteringComponent id="third" />
			</StaggeredEntrance>,
		);

		expect(screen.getByTestId('first')).toHaveStyle({ 'animation-delay': secondGroupDelay });
		expect(screen.getByTestId('second')).toHaveStyle({ 'animation-delay': thirdGroupDelay });
		expect(screen.getByTestId('third')).toHaveStyle({ 'animation-delay': fourthGroupDelay });
	});

	it('should set a staggered duration for the third column of a grid', () => {
		render(
			<StaggeredEntrance column={2}>
				<EnteringComponent id="first" />
				<EnteringComponent id="second" />
				<EnteringComponent id="third" />
			</StaggeredEntrance>,
		);

		expect(screen.getByTestId('first')).toHaveStyle({ 'animation-delay': thirdGroupDelay });
		expect(screen.getByTestId('second')).toHaveStyle({
			'animation-delay': fourthGroupDelay,
		});
		expect(screen.getByTestId('third')).toHaveStyle({ 'animation-delay': fifthGroupDelay });
	});

	it('should render with no delay when there is only one child element', () => {
		render(
			<StaggeredEntrance>
				<EnteringComponent box={{ offsetTop: 0 }} id="first" />
			</StaggeredEntrance>,
		);

		expect(screen.getByTestId('first')).toHaveStyle({ 'animation-delay': firstGroupDelay });
	});

	it('should stagger over one column for a small viewport', () => {
		render(
			<StaggeredEntrance>
				<EnteringComponent id="first" box={{ offsetTop: 0 }} />
				<EnteringComponent id="second" box={{ offsetTop: 50 }} />
				<EnteringComponent id="third" box={{ offsetTop: 100 }} />
			</StaggeredEntrance>,
		);

		expect(screen.getByTestId('first')).toHaveStyle({ 'animation-delay': firstGroupDelay });
		expect(screen.getByTestId('second')).toHaveStyle({
			'animation-delay': secondGroupDelay,
		});
		expect(screen.getByTestId('third')).toHaveStyle({ 'animation-delay': thirdGroupDelay });
	});

	it('should stagger over two columns for a medium viewport', () => {
		render(
			<StaggeredEntrance>
				<EnteringComponent id="first" box={{ offsetTop: 0 }} />
				<EnteringComponent id="second" box={{ offsetTop: 0 }} />
				<EnteringComponent id="third" box={{ offsetTop: 50 }} />
			</StaggeredEntrance>,
		);

		expect(screen.getByTestId('first')).toHaveStyle({ 'animation-delay': firstGroupDelay });
		expect(screen.getByTestId('second')).toHaveStyle({
			'animation-delay': secondGroupDelay,
		});
		expect(screen.getByTestId('third')).toHaveStyle({ 'animation-delay': secondGroupDelay });
	});

	it('should stagger over three columns for a large viewport', () => {
		render(
			<StaggeredEntrance>
				<EnteringComponent id="first" box={{ offsetTop: 0 }} />
				<EnteringComponent id="second" box={{ offsetTop: 0 }} />
				<EnteringComponent id="third" box={{ offsetTop: 0 }} />
			</StaggeredEntrance>,
		);

		expect(screen.getByTestId('first')).toHaveStyle({ 'animation-delay': firstGroupDelay });
		expect(screen.getByTestId('second')).toHaveStyle({
			'animation-delay': secondGroupDelay,
		});
		expect(screen.getByTestId('third')).toHaveStyle({ 'animation-delay': thirdGroupDelay });
	});
});
