import React, { Component, createRef, forwardRef } from 'react';

import { renderWithDi, screen } from '@atlassian/testing-library';

import { componentWithCondition } from './index';

describe('Component with condition', () => {
	it('typecheck', () => {
		const ref: any = 0;
		const cond = () => true;

		const MyComponentWithRef = forwardRef<HTMLDivElement>(() => <div>Test</div>);
		const MyComponentWithoutRef = () => <div>Test2</div>;
		const AnotherMyComponentWithoutRef = () => <div>Test2</div>;
		const MyComponentWithProps = (_props: { x: number }) => <div>Test2</div>;
		const MyComponentWithMoreProps = (_props: { x: number; y: string }) => <div>Test2</div>;
		const MyComponentWithRefAndProps = forwardRef<HTMLDivElement, { y: string }>(() => (
			<div>Test</div>
		));

		componentWithCondition(cond, MyComponentWithoutRef, AnotherMyComponentWithoutRef);
		componentWithCondition(cond, MyComponentWithRef, MyComponentWithoutRef);
		componentWithCondition(cond, MyComponentWithRef, MyComponentWithRefAndProps);
		componentWithCondition(cond, MyComponentWithoutRef, MyComponentWithProps);

		const MergedComponent1 = componentWithCondition(
			() => true,
			MyComponentWithProps,
			MyComponentWithMoreProps,
		);
		// should define maximum of 2
		// Assert that this should error as ref doesn't exist in either components
		// @ts-expect-error TS2322: Property 'ref' does not exist on type 'IntrinsicAttributes & { x: number; } & { x: number; y: string; }'.
		expect(<MergedComponent1 x={1} y="2" ref={ref} />).toBeTruthy();

		const MergedComponent2 = componentWithCondition(
			cond,
			MyComponentWithProps,
			MyComponentWithMoreProps,
		);
		// should define union of 2
		expect(<MergedComponent2 x={1} y="2" />).toBeTruthy();

		const MergedComponent3 = componentWithCondition(
			cond,
			MyComponentWithRef,
			MyComponentWithRefAndProps,
		);
		// should define union of 2
		expect(<MergedComponent3 y="2" ref={ref} />).toBeTruthy();
	});

	describe('forking tests', () => {
		const ComponentTrue = () => <>true</>;
		const ComponentFalse = () => <>false</>;

		it('should capture and report a11y violations', async () => {
			const TestComponent = componentWithCondition(() => true, ComponentTrue, ComponentFalse);
			const { container } = renderWithDi(
				<>
					rendered <TestComponent /> component
				</>,
			);

			await expect(container).toBeAccessible();
		});

		it('renders left', () => {
			const TestComponent = componentWithCondition(() => true, ComponentTrue, ComponentFalse);
			renderWithDi(
				<>
					rendered <TestComponent /> component
				</>,
			);
			expect(screen.getByText('rendered true component')).toBeInTheDocument();
		});
		it('renders right', () => {
			const TestComponent = componentWithCondition(() => false, ComponentTrue, ComponentFalse);
			renderWithDi(
				<>
					rendered <TestComponent /> component
				</>,
			);
			expect(screen.getByText('rendered false component')).toBeInTheDocument();
		});
	});

	describe('refs', () => {
		it('should capture and report a11y violations', async () => {
			const TestComponent = componentWithCondition(
				() => true,
				forwardRef<HTMLDivElement, { x: number }>(({ x }, ref) => <div ref={ref}>true {x}</div>),
				forwardRef<HTMLVideoElement, { y: string }>(({ y }, ref) => (
					<span ref={ref}>false {y}</span>
				)),
			);
			const correctSingleRef = createRef<HTMLDivElement>();
			const { container } = renderWithDi(<TestComponent x={1} y="2" ref={correctSingleRef} />);

			await expect(container).toBeAccessible();
		});

		it('gets the ref to the true element', () => {
			const TestComponent = componentWithCondition(
				() => true,
				forwardRef<HTMLDivElement, { x: number }>(({ x }, ref) => <div ref={ref}>true {x}</div>),
				forwardRef<HTMLVideoElement, { y: string }>(({ y }, ref) => (
					<span ref={ref}>false {y}</span>
				)),
			);
			const correctSingleRef = createRef<HTMLDivElement>();
			renderWithDi(<TestComponent x={1} y="2" ref={correctSingleRef} />);
			expect(correctSingleRef.current?.innerHTML).toBe('true 1');

			const wrongRef = createRef<HTMLSpanElement>();
			// Assert that this should error as HTMLDivElement | HTMLVideoElement doesn't match HTMLSpanElement
			// @ts-expect-error TS2322: Type 'RefObject<HTMLSpanElement>' is not assignable to type 'Ref<HTMLDivElement | HTMLVideoElement> | undefined'.
			renderWithDi(<TestComponent x={2} y="2" ref={wrongRef} />);
			expect(wrongRef.current?.innerHTML).toBe('true 2');

			const correctOrRef = createRef<HTMLDivElement | HTMLVideoElement>();
			renderWithDi(<TestComponent x={3} y="2" ref={correctOrRef} />);
			expect(correctOrRef.current?.innerHTML).toBe('true 3');
		});

		it('mixes FC and class', () => {
			// eslint-disable-next-line @repo/internal/react/no-class-components
			class MyClassComponent extends Component {
				method() {
					return 42;
				}

				render() {
					return <>false</>;
				}
			}

			const TestComponent = componentWithCondition(
				() => false,
				forwardRef<HTMLDivElement>((_, ref) => <div ref={ref}>true</div>),
				MyClassComponent,
			);

			const correctRef = createRef<HTMLDivElement | MyClassComponent>();
			renderWithDi(<TestComponent ref={correctRef} />);

			expect('method' in correctRef.current! ? correctRef.current.method() : 0).toBe(42);
		});
	});
});
