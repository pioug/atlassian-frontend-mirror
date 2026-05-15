import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import AddIcon from '../../../../../core/add';
import IconTile from '../../index';

const testId = 'icon-tile-test';
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('IconTile', () => {
	it('should render testId', () => {
		render(<IconTile icon={AddIcon} label="Add" appearance="blue" testId={testId} />);
		expect(screen.getAllByTestId(testId)).toHaveLength(1);
	});
	describe('Feature flag behavior', () => {
		describe('Circle replacement component', () => {
			describe('displays for circle shaped icon tiles', () => {
				const circleReplacementComponent = (
					<div data-testid="circle-replacement">Circle Replacement</div>
				);

				ffTest(
					'platform_dst_icon_tile_circle_replacement',
					() => {
						render(
							<IconTile
								icon={AddIcon}
								label="Test"
								appearance="blue"
								UNSAFE_circleReplacementComponent={circleReplacementComponent}
								shape="circle"
								size="small"
								testId={testId}
							/>,
						);

						const circleReplacement = screen.queryByTestId('circle-replacement');
						const tile = screen.queryByTestId(testId);

						expect(tile).not.toBeInTheDocument();
						expect(circleReplacement).toBeInTheDocument();
					},
					() => {
						render(
							<IconTile
								icon={AddIcon}
								label="Test"
								appearance="blue"
								UNSAFE_circleReplacementComponent={circleReplacementComponent}
								shape="circle"
								size="small"
								testId={testId}
							/>,
						);

						const circleReplacement = screen.queryByTestId('circle-replacement');
						const tile = screen.queryByTestId(testId);

						expect(tile).toBeInTheDocument();
						expect(circleReplacement).not.toBeInTheDocument();
					},
				);
			});

			ffTest.on('platform_dst_icon_tile_circle_replacement', 'feature flag on', () => {
				it('does not display for non-circle shaped icon tiles', () => {
					render(
						// `UNSAFE_circleReplacementComponent` is now disallowed by the type system
						// for non-circle shapes (via the `IconTileProps` discriminated union).
						// We cast here to verify the runtime guard still ignores the prop in this case.
						React.createElement(IconTile, {
							icon: AddIcon,
							label: 'Test',
							appearance: 'blue',
							UNSAFE_circleReplacementComponent: (
								<div data-testid="circle-replacement">Circle Replacement</div>
							),
							size: 'small',
							testId,
						} as React.ComponentProps<typeof IconTile>),
					);

					const circleReplacement = screen.queryByTestId('circle-replacement');
					const tile = screen.queryByTestId(testId);

					expect(tile).toBeInTheDocument();
					expect(circleReplacement).not.toBeInTheDocument();
				});
			});
		});
	});
});
