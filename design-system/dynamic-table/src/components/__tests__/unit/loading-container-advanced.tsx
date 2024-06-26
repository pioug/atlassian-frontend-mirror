import React, { Component, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { render, screen } from '@testing-library/react';
// import ReactDOM from 'react-dom';

import LoadingContainerAdvanced from '../../loading-container-advanced'; // LoadingContainerAdvancedProps,

const testId = 'dynamic--table--test--id';
describe('LoadingContainerAdvanced', () => {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/design-system/no-empty-styled-expression -- Ignored via go/DSP-18766
	const Contents = styled.div({});

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
				<Contents />
			</LoadingContainerAdvanced>,
		);

		let container = screen.getByTestId(`${testId}--loading--container--advanced`);
		expect(container).toBeInTheDocument();

		rerender(
			<LoadingContainerAdvanced testId={testId} isLoading={false}>
				<Contents />
			</LoadingContainerAdvanced>,
		);

		container = screen.getByTestId(`${testId}--loading--container--advanced`);
		expect(container).toBeInTheDocument();
	});

	it('should always render children as is right inside the container', () => {
		const { rerender } = render(
			<LoadingContainerAdvanced testId={testId} isLoading>
				<Contents data-testid={`${testId}--contents`} />
			</LoadingContainerAdvanced>,
		);

		let contents = screen.getByTestId(`${testId}--contents`);
		expect(contents).toBeInTheDocument();

		rerender(
			<LoadingContainerAdvanced testId={testId} isLoading={false}>
				<Contents data-testid={`${testId}--contents`} />
			</LoadingContainerAdvanced>,
		);

		contents = screen.getByTestId(`${testId}--contents`);
		expect(contents).toBeInTheDocument();
	});

	it('should not render the spinner container when the loading mode is off', () => {
		render(
			<LoadingContainerAdvanced testId={testId} isLoading={false}>
				<Contents />
			</LoadingContainerAdvanced>,
		);
		const spinnerBackdrop = screen.queryByTestId(`${testId}--spinner-backdrop`);
		expect(spinnerBackdrop).not.toBeInTheDocument();
	});

	it('should render with a proper default values', () => {
		render(
			<LoadingContainerAdvanced testId={testId}>
				<Contents />
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
				<Contents />
			</LoadingContainerAdvanced>,
		);

		const spinner = screen.getByRole('img');
		expect(spinner).toHaveAccessibleName(label);
	});

	it('should render the spinner of a given size', () => {
		render(
			<LoadingContainerAdvanced testId={testId} spinnerSize="xlarge">
				<Contents />
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
			class Contents extends Component<{ contentRef?: Ref<any> }> {
				render() {
					return <div ref={this.props.contentRef} data-testid={`${testId}--content`} />;
				}
			}

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
					<Contents />
				</LoadingContainerAdvanced>,
			);
			let contents = screen.getByTestId(`${testId}--loading--container--advanced`);
			assertTargetStylesAreCorrect(contents, true);

			rerender(
				<LoadingContainerAdvanced isLoading={false} testId={testId}>
					<Contents data-testid={`${testId}--content`} />
				</LoadingContainerAdvanced>,
			);
			contents = screen.getByTestId(`${testId}--loading--container--advanced`);
			assertTargetStylesAreCorrect(contents, false);
		});

		it('should set styles to the target and revert them on loading mode change', () => {
			let target: HTMLTableSectionElement | null = null;

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/design-system/no-empty-styled-expression -- Ignored via go/DSP-18766
			const InnerComponent = styled.div({});
			const { rerender } = render(
				<LoadingContainerAdvanced targetRef={() => target}>
					<Contents>
						<InnerComponent
							data-testid={`${testId}--inner--component`}
							ref={(el: HTMLTableSectionElement) => {
								target = el;
							}}
						/>
					</Contents>
				</LoadingContainerAdvanced>,
			);
			let innerComponent = screen.getByTestId(`${testId}--inner--component`);
			assertTargetStylesAreCorrect(innerComponent, true);

			rerender(
				<LoadingContainerAdvanced isLoading={false} targetRef={() => target}>
					<Contents>
						<InnerComponent
							data-testid={`${testId}--inner--component`}
							ref={(el: HTMLTableSectionElement) => {
								target = el;
							}}
						/>
					</Contents>
				</LoadingContainerAdvanced>,
			);

			innerComponent = screen.getByTestId(`${testId}--inner--component`);
			assertTargetStylesAreCorrect(innerComponent, false);
		});
	});

	// FIXME: This task case are outdated since we are using depreciated API from react-dom. Post discussion with Cian, This migration will be picked post to rewrite
	// describe.skip('spinner manipulations', () => {
	//   let wrapper: ReactWrapper<
	//     LoadingContainerAdvancedProps,
	//     {},
	//     LoadingContainerAdvanced
	//   >;
	//   let componentClientRect: any;
	//   let targetClientRect: any;
	//   let spinnerClientRect: any;
	//   let spinnerStyle: any;

	//   const assertSpinnerTransformedProperly = (position: any, y: any) => {
	//     expect(spinnerStyle.position).toBe(position);
	//     expect(spinnerStyle.transform).toBe(
	//       y === Number(y) ? `translate3d(0, ${y}px, 0)` : '',
	//     );
	//   };

	//   const assertSpinnerAlignedUsingDefaultCssRules = () => {
	//     assertSpinnerTransformedProperly('', '');
	//   };

	//   const assertSpinnerFixedAndProperlyTransformed = (y: any) => {
	//     assertSpinnerTransformedProperly('fixed', y);
	//   };

	//   const updateSpinnerPosition = () => {
	//     wrapper.instance().updateSpinnerPosition();
	//   };

	//   beforeEach(() => {
	//     // Define default spinner style
	//     spinnerStyle = {
	//       position: '',
	//       transform: '',
	//     };

	//     // Define default spinner ClientRect (off screen)
	//     spinnerClientRect = {
	//       top: -50,
	//       bottom: 0,
	//       height: 50,
	//     };

	//     // We will always return the same ClientRect we return for the target.
	//     // May be overridden though.
	//     componentClientRect = undefined;

	//     // Its values has to be defined by the test
	//     targetClientRect = undefined;

	//     // Hardcode viewport height
	//     Object.defineProperty(window, 'innerHeight', {
	//       writable: true,
	//       value: 800,
	//     });

	//     // Mount the component
	//     wrapper = mount(
	//       <LoadingContainerAdvanced>
	//         <Contents />
	//       </LoadingContainerAdvanced>,
	//     );
	//     wrappers.push(wrapper);

	//     // Return fake component node
	//     wrapper.instance().getThisNode = jest.fn().mockReturnValue({
	//       getBoundingClientRect: () => componentClientRect || targetClientRect,
	//     });

	//     // Return fake target node
	//     wrapper.instance().getTargetNode = jest.fn().mockReturnValue({
	//       getBoundingClientRect: () => targetClientRect,
	//     });

	//     // Return fake spinner node
	//     wrapper.instance().getSpinnerNode = jest.fn().mockReturnValue({
	//       style: spinnerStyle,
	//       getBoundingClientRect: () => spinnerClientRect,
	//     });
	//   });

	//   it.skip('should do nothing when both target and spinner are off screen', () => {
	//     targetClientRect = {
	//       top: -800,
	//       bottom: -400,
	//       height: 400,
	//     };
	//     updateSpinnerPosition();
	//     assertSpinnerAlignedUsingDefaultCssRules();
	//   });

	//   describe('centers the spinner using default positioning (defined via styled-component)', () => {
	//     it('should center when the target is fully visible', () => {
	//       targetClientRect = {
	//         top: 0,
	//         bottom: 800,
	//         height: 800,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerAlignedUsingDefaultCssRules();

	//       targetClientRect = {
	//         top: 10,
	//         bottom: 610,
	//         height: 600,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerAlignedUsingDefaultCssRules();

	//       targetClientRect = {
	//         top: 210,
	//         bottom: 510,
	//         height: 300,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerAlignedUsingDefaultCssRules();

	//       targetClientRect = {
	//         top: 600,
	//         bottom: 750,
	//         height: 150,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerAlignedUsingDefaultCssRules();
	//     });

	//     it('should center when the target is too small for the spinner to follow (< 3x spinner height)', () => {
	//       targetClientRect = {
	//         top: 80,
	//         bottom: 100,
	//         height: 20,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerAlignedUsingDefaultCssRules();

	//       targetClientRect = {
	//         top: -100,
	//         bottom: 49,
	//         height: 149,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerAlignedUsingDefaultCssRules();
	//     });

	//     it('should center when the target is not visible anymore but the spinner still is', () => {
	//       targetClientRect = {
	//         top: -1000,
	//         bottom: -800,
	//         height: 200,
	//       };
	//       spinnerClientRect = {
	//         top: 50,
	//         bottom: 100,
	//         height: 50,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerAlignedUsingDefaultCssRules();
	//     });

	//     it('should calculate proper top offset when the target is not the children and has some offset', () => {
	//       componentClientRect = {
	//         top: 300,
	//         bottom: 700,
	//         height: 400,
	//       };
	//       targetClientRect = {
	//         top: 450,
	//         bottom: 700,
	//         height: 250,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerTransformedProperly('', 75);
	//     });
	//   });

	//   describe('positions the spinner using fixed css rule', () => {
	//     it('should position properly when only the head of the target is visible', () => {
	//       targetClientRect = {
	//         top: 750,
	//         bottom: 950,
	//         height: 200,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(800);

	//       targetClientRect = {
	//         top: 790,
	//         bottom: 990,
	//         height: 200,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(840);

	//       targetClientRect = {
	//         top: 700,
	//         bottom: 900,
	//         height: 200,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(750);

	//       targetClientRect = {
	//         top: 670,
	//         bottom: 870,
	//         height: 200,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(720);

	//       targetClientRect = {
	//         top: 650,
	//         bottom: 850,
	//         height: 200,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(700);
	//     });

	//     it('should position properly the target which takes all viewport, nor its head nor tail are visible', () => {
	//       targetClientRect = {
	//         top: -1,
	//         bottom: 801,
	//         height: 802,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(375);

	//       targetClientRect = {
	//         top: -50,
	//         bottom: 850,
	//         height: 900,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(375);

	//       targetClientRect = {
	//         top: -250,
	//         bottom: 850,
	//         height: 1100,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(375);

	//       targetClientRect = {
	//         top: -2250,
	//         bottom: 850,
	//         height: 2100,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(375);

	//       targetClientRect = {
	//         top: -2,
	//         bottom: 2850,
	//         height: 2852,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(375);
	//     });

	//     it('should position properly when only the tail of the target is visible', () => {
	//       targetClientRect = {
	//         top: -50,
	//         bottom: 650,
	//         height: 700,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(300);

	//       targetClientRect = {
	//         top: -380,
	//         bottom: 320,
	//         height: 700,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(135);

	//       targetClientRect = {
	//         top: -456,
	//         bottom: 244,
	//         height: 700,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(97);

	//       targetClientRect = {
	//         top: -600,
	//         bottom: 100,
	//         height: 700,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed('');

	//       targetClientRect = {
	//         top: -670,
	//         bottom: 30,
	//         height: 700,
	//       };
	//       updateSpinnerPosition();
	//       assertSpinnerFixedAndProperlyTransformed(-70);
	//     });
	//   });
	// });

	// FIXME: This task case are outdated since we are using depreciated API from react-dom. Post discussion with Cian, This migration will be picked post to rewrite
	// describe.skip('helpers', () => {
	//   let wrapper: ReactWrapper<
	//     LoadingContainerAdvancedProps,
	//     {},
	//     LoadingContainerAdvanced
	//   >;

	//   beforeEach(() => {
	//     wrapper = mount(
	//       <LoadingContainerAdvanced targetRef={() => undefined}>
	//         <Contents />
	//       </LoadingContainerAdvanced>,
	//     );
	//     wrappers.push(wrapper);
	//   });

	//   describe('isVerticallyVisible', () => {
	//     it('should detect whether the given rect is vertically visible (at least partially)', () => {
	//       const { isVerticallyVisible } = wrapper.instance();

	//       // Simulating scrolling down the page
	//       // The element is below the viewport
	//       expect(isVerticallyVisible({ top: 1408, bottom: 1608 }, 800)).toBe(
	//         false,
	//       );
	//       expect(isVerticallyVisible({ top: 801, bottom: 1001 }, 800)).toBe(
	//         false,
	//       );
	//       expect(isVerticallyVisible({ top: 800, bottom: 1000 }, 800)).toBe(
	//         false,
	//       );

	//       // The first pixel of the element's header is visible
	//       expect(isVerticallyVisible({ top: 799, bottom: 999 }, 800)).toBe(true);

	//       // The last pixel of the element's tail is visible
	//       expect(isVerticallyVisible({ top: 600, bottom: 800 }, 800)).toBe(true);

	//       // The first pixel of the element's header is still visible
	//       expect(isVerticallyVisible({ top: 0, bottom: 200 }, 800)).toBe(true);

	//       // The last pixel of the element's header is not visible anymore
	//       expect(isVerticallyVisible({ top: -1, bottom: 199 }, 800)).toBe(true);

	//       // The last pixel of the element's tails is still visible
	//       expect(isVerticallyVisible({ top: -199, bottom: 1 }, 800)).toBe(true);

	//       // The element goes off screen
	//       expect(isVerticallyVisible({ top: -200, bottom: 0 }, 800)).toBe(false);
	//       expect(isVerticallyVisible({ top: -300, bottom: -100 }, 800)).toBe(
	//         false,
	//       );
	//       expect(isVerticallyVisible({ top: -808, bottom: -608 }, 800)).toBe(
	//         false,
	//       );
	//     });
	//   });

	//   describe('isFullyVerticallyVisible', () => {
	//     it('should detect whether the given rect is fully vertically visible', () => {
	//       const { isFullyVerticallyVisible } = wrapper.instance();

	//       // Simulating scrolling down the page
	//       // The element is below the viewport
	//       expect(isFullyVerticallyVisible({ top: 1408, bottom: 1608 }, 800)).toBe(
	//         false,
	//       );
	//       expect(isFullyVerticallyVisible({ top: 801, bottom: 1001 }, 800)).toBe(
	//         false,
	//       );
	//       expect(isFullyVerticallyVisible({ top: 800, bottom: 1000 }, 800)).toBe(
	//         false,
	//       );

	//       // The last pixel of the element's tail is not yet visible
	//       expect(isFullyVerticallyVisible({ top: 601, bottom: 801 }, 800)).toBe(
	//         false,
	//       );

	//       // The last pixel of the element's tail becomes visible
	//       expect(isFullyVerticallyVisible({ top: 600, bottom: 800 }, 800)).toBe(
	//         true,
	//       );

	//       // The first pixel of the element's header is still visible
	//       expect(isFullyVerticallyVisible({ top: 0, bottom: 200 }, 800)).toBe(
	//         true,
	//       );

	//       // The last pixel of the element's header is not visible anymore
	//       expect(isFullyVerticallyVisible({ top: -1, bottom: 199 }, 800)).toBe(
	//         false,
	//       );

	//       // The last pixel of the element's tails is still visible
	//       expect(isFullyVerticallyVisible({ top: -199, bottom: 1 }, 800)).toBe(
	//         false,
	//       );

	//       // The element goes off screen
	//       expect(isFullyVerticallyVisible({ top: -200, bottom: 0 }, 800)).toBe(
	//         false,
	//       );
	//       expect(isFullyVerticallyVisible({ top: -300, bottom: -100 }, 800)).toBe(
	//         false,
	//       );
	//       expect(isFullyVerticallyVisible({ top: -808, bottom: -608 }, 800)).toBe(
	//         false,
	//       );
	//     });
	//   });
	// });

	// FIXME: This test case are outdated since we are using depreciated API from react-dom. Post discussion with Cian, This migration will be picked post to rewrite
	// describe.skip('listeners', () => {
	//   let attachSpy: any;
	//   let detachSpy: any;
	//   let updateSpinnerPositionSpy: any;

	//   beforeEach(() => {
	//     attachSpy = jest.spyOn(
	//       LoadingContainerAdvanced.prototype,
	//       'attachListeners',
	//     );
	//     detachSpy = jest.spyOn(
	//       LoadingContainerAdvanced.prototype,
	//       'detachListeners',
	//     );
	//     updateSpinnerPositionSpy = jest.spyOn(
	//       LoadingContainerAdvanced.prototype,
	//       'updateSpinnerPosition',
	//     );
	//   });

	//   afterEach(() => {
	//     attachSpy.mockClear();
	//     detachSpy.mockClear();
	//     updateSpinnerPositionSpy.mockClear();
	//   });

	//   it('should attach the listeners on mount only when loading and there is a target node', () => {
	//     let target: HTMLDivElement;

	//     class Contents extends Component<{ contentRef?: any }> {
	//       render() {
	//         return <div ref={this.props.contentRef}></div>;
	//       }
	//     }

	//     // targetRef returns invalid target
	//     wrappers.push(
	//       mount(
	//         <LoadingContainerAdvanced targetRef={() => undefined}>
	//           <Contents />
	//         </LoadingContainerAdvanced>,
	//       ),
	//     );

	//     expect(attachSpy).not.toHaveBeenCalled();

	//     // Not loading
	//     wrappers.push(
	//       mount(
	//         <LoadingContainerAdvanced isLoading={false}>
	//           <Contents />
	//         </LoadingContainerAdvanced>,
	//       ),
	//     );
	//     expect(attachSpy).not.toHaveBeenCalled();

	//     // Loading and has children
	//     wrappers.push(
	//       mount(
	//         <LoadingContainerAdvanced>
	//           <Contents />
	//         </LoadingContainerAdvanced>,
	//       ),
	//     );
	//     expect(attachSpy).toHaveBeenCalledTimes(1);

	//     // Loading and has a valid target
	//     wrappers.push(
	//       mount(
	//         <LoadingContainerAdvanced targetRef={() => target}>
	//           <Contents
	//             contentRef={(el: HTMLDivElement) => {
	//               target = el;
	//             }}
	//           />
	//         </LoadingContainerAdvanced>,
	//       ),
	//     );
	//     expect(attachSpy).toHaveBeenCalledTimes(2);
	//   });

	//   it('should attach the listeners on props change only when it makes sense', () => {
	//     let target: HTMLDivElement;

	//     const wrapper: ReactWrapper<
	//       LoadingContainerAdvancedProps,
	//       {},
	//       LoadingContainerAdvanced
	//     > = mount(
	//       <LoadingContainerAdvanced isLoading={false}>
	//         <Contents
	//           ref={(el: HTMLDivElement) => {
	//             target = el;
	//           }}
	//         />
	//       </LoadingContainerAdvanced>,
	//     );
	//     wrappers.push(wrapper);

	//     // Not loading
	//     expect(attachSpy).toHaveBeenCalledTimes(0);

	//     // Is loading and has children
	//     wrapper.setProps({ isLoading: true });
	//     expect(attachSpy).toHaveBeenCalledTimes(1);

	//     // Still loading and non-important props were changed
	//     wrapper.setProps({
	//       spinnerSize: 'small',
	//       contentsOpacity: 1,
	//       targetRef: () => target,
	//     });
	//     expect(attachSpy).toHaveBeenCalledTimes(1);

	//     // Loading is turned off
	//     wrapper.setProps({ isLoading: false });
	//     expect(attachSpy).toHaveBeenCalledTimes(1);

	//     // Loading is back on, but targetRef returns invalid target
	//     wrapper.setProps({ isLoading: true, targetRef: () => undefined });
	//     expect(attachSpy).toHaveBeenCalledTimes(1);
	//   });

	//   it('should detach the listeners on props change', () => {
	//     const wrapper = mount(
	//       <LoadingContainerAdvanced>
	//         <Contents />
	//       </LoadingContainerAdvanced>,
	//     );

	//     // Is loading
	//     expect(detachSpy).toHaveBeenCalledTimes(0);

	//     // Not loading anymore
	//     wrapper.setProps({ isLoading: false });
	//     expect(detachSpy).toHaveBeenCalledTimes(1);
	//     wrapper.setProps({ isLoading: true });

	//     // Still loading targetRef return invalid target
	//     wrapper.setProps({ targetRef: () => undefined });
	//     expect(detachSpy).toHaveBeenCalledTimes(2);
	//   });

	//   it('should detach the listeners on unmount', () => {
	//     const wrapper: ReactWrapper<
	//       LoadingContainerAdvancedProps,
	//       {},
	//       LoadingContainerAdvanced
	//     > = mount(
	//       <LoadingContainerAdvanced>
	//         <Contents />
	//       </LoadingContainerAdvanced>,
	//     );
	//     wrappers.push(wrapper);
	//     expect(detachSpy).toHaveBeenCalledTimes(0);
	//     wrapper.unmount();
	//     expect(detachSpy).toHaveBeenCalledTimes(1);
	//   });

	//   it('should not throw an error when mounting if findDOMNode throws an error', () => {
	//     const findDOMNodeMock = jest
	//       .spyOn(ReactDOM, 'findDOMNode')
	//       .mockImplementation(() => {
	//         throw new Error('Cannot find node of unmounted component');
	//       });

	//     expect(() =>
	//       mount(
	//         <LoadingContainerAdvanced>
	//           <Contents />
	//         </LoadingContainerAdvanced>,
	//       ),
	//     ).not.toThrow();

	//     expect(findDOMNodeMock).toHaveBeenCalled();
	//     findDOMNodeMock.mockRestore();
	//   });

	//   /**
	//    * Not sure why these next two tests fail. Each resize event seems to be calling the callback 16 times!
	//    * So, we're seeing 33 calls in total. It doesn't seem to be breaking the functionality, but the event
	//    * _should_ probably be debounced.
	//    * TODO: JEST-23
	//    */
	//   /* eslint-disable jest/no-disabled-tests */
	//   it.skip('should update spinner position on resize', () => {
	//     mount(
	//       <LoadingContainerAdvanced>
	//         <Contents />
	//       </LoadingContainerAdvanced>,
	//     );

	//     expect(updateSpinnerPositionSpy).toHaveBeenCalledTimes(1);
	//     window.dispatchEvent(new Event('resize'));
	//     window.dispatchEvent(new Event('resize'));
	//     expect(updateSpinnerPositionSpy).toHaveBeenCalledTimes(3);
	//   });

	//   it.skip('should update spinner position on scroll', () => {
	//     wrappers.push(
	//       mount(
	//         <LoadingContainerAdvanced>
	//           <Contents />
	//         </LoadingContainerAdvanced>,
	//       ),
	//     );
	//     expect(updateSpinnerPositionSpy).toHaveBeenCalledTimes(1);
	//     window.dispatchEvent(new Event('scroll'));
	//     window.dispatchEvent(new Event('scroll'));
	//     expect(updateSpinnerPositionSpy).toHaveBeenCalledTimes(3);
	//   });
	// });
});
