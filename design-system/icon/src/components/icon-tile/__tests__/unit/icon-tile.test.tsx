import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import AddIcon from '../../../../../core/add';
import IconTile from '../../index';

const testId = 'icon-tile-test';
describe('IconTile', () => {
	it('should render testId', () => {
		render(<IconTile icon={AddIcon} label="Add" appearance="blue" testId={testId} />);
		expect(screen.getAllByTestId(testId)).toHaveLength(1);
	});

	describe('Renders 16px icon directly for new icon tiles', () => {
		ffTest(
			'platform_dst_new_icon_tile',
			() => {
				render(
					<IconTile
						icon={AddIcon}
						label="Square tile"
						appearance="blue"
						testId={testId}
						size="16"
					/>,
				);
				// When size is 16, it renders the icon directly
				const firstChild = screen.getByTestId(testId).firstChild;
				expect(firstChild).not.toBeInstanceOf(SVGSVGElement);
			},
			() => {
				render(
					<IconTile
						icon={AddIcon}
						label="Square tile"
						appearance="blue"
						testId={testId}
						size="16"
					/>,
				);
				const firstChild = screen.getByTestId(testId).firstChild;
				expect(firstChild).not.toBeInstanceOf(SVGSVGElement);
			},
		);
	});

	describe('Feature flag behavior', () => {
		describe('Legacy fallback component displays correctly', () => {
			const legacyComponent = <div data-testid="legacy-fallback">Legacy Fallback</div>;

			ffTest(
				'platform-visual-refresh-icons',
				() => {
					render(
						<IconTile
							icon={AddIcon}
							label="Test"
							appearance="blue"
							LEGACY_fallbackComponent={legacyComponent}
							testId={testId}
						/>,
					);

					const legacyFallback = screen.queryByTestId('legacy-fallback');
					const tile = screen.queryByTestId(testId);

					expect(tile).toBeInTheDocument();
					expect(legacyFallback).not.toBeInTheDocument();
				},
				() => {
					render(
						<IconTile
							icon={AddIcon}
							label="Test"
							appearance="blue"
							LEGACY_fallbackComponent={legacyComponent}
							testId={testId}
						/>,
					);

					const legacyFallback = screen.queryByTestId('legacy-fallback');
					const tile = screen.queryByTestId(testId);

					expect(tile).not.toBeInTheDocument();
					expect(legacyFallback).toBeInTheDocument();
				},
			);
		});
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
								size="24"
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
								size="24"
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
						<IconTile
							icon={AddIcon}
							label="Test"
							appearance="blue"
							UNSAFE_circleReplacementComponent={
								<div data-testid="circle-replacement">Circle Replacement</div>
							}
							size="24"
							testId={testId}
						/>,
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
