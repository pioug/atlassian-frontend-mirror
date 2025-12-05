import { calculateDimensions } from '../helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('calculateDimensions', () => {
	describe('same ratio detection with feature flags', () => {
		const createMockImgElement = (
			naturalWidth: number,
			naturalHeight: number,
		): HTMLImageElement => {
			return {
				naturalWidth,
				width: naturalWidth,
				naturalHeight,
				height: naturalHeight,
			} as HTMLImageElement;
		};

		const createMockParentElement = (width: number, height: number): HTMLElement => {
			return {
				getBoundingClientRect: () => ({ width, height }),
			} as HTMLElement;
		};

		describe('Scenario 1: Rounding boundary at 0.5 (252×253 in 500×500)', () => {
			const imgElement = createMockImgElement(252, 253);
			const parentElement = createMockParentElement(500, 500);

			ffTest.off('media-perf-uplift-mutation-fix', 'when feature flag is off', () => {
				it('should not apply same-ratio optimization for crop mode', () => {
					const result = calculateDimensions(imgElement, parentElement, 'crop');
					// Should fall through to the regular logic (image is portrait relative to parent)
					expect(result).toEqual({ width: 252, maxWidth: '100%' });
				});

				it('should not apply same-ratio optimization for stretchy-fit mode', () => {
					const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
					// Should fall through to the regular logic (image is portrait relative to parent)
					expect(result).toEqual({ height: '100%', maxWidth: '100%' });
				});
			});

			ffTest.on(
				'media-perf-uplift-mutation-fix',
				'when uplift flag is on but ratio-calc-fix is off',
				() => {
					ffTest.off('media-perf-ratio-calc-fix', 'uses old rounding approach', () => {
						it('should NOT detect as same ratio for crop mode (old approach fails)', () => {
							// 252/500 = 0.504 → rounds to 0.50
							// 253/500 = 0.506 → rounds to 0.51
							// 0.50 !== 0.51 → considered "different"
							const result = calculateDimensions(imgElement, parentElement, 'crop');
							expect(result).toEqual({ width: 252, maxWidth: '100%' });
						});

						it('should NOT detect as same ratio for stretchy-fit mode (old approach fails)', () => {
							const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
							expect(result).toEqual({ height: '100%', maxWidth: '100%' });
						});
					});
				},
			);

			ffTest.on('media-perf-uplift-mutation-fix', 'when both flags are on', () => {
				ffTest.on('media-perf-ratio-calc-fix', 'uses new threshold approach', () => {
					it('should detect as same ratio for crop mode and return optimized dimensions', () => {
						// |0.504 - 0.506| = 0.002 < 0.1 → considered "same"
						const result = calculateDimensions(imgElement, parentElement, 'crop');
						expect(result).toEqual({ maxWidth: '100%' });
					});

					it('should detect as same ratio for stretchy-fit mode and return optimized dimensions', () => {
						const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
						expect(result).toEqual({ width: '100%', maxHeight: '100%' });
					});
				});
			});
		});

		describe('Scenario 2: Near 1:1 scale with slight variation (398×402 in 400×400)', () => {
			const imgElement = createMockImgElement(398, 402);
			const parentElement = createMockParentElement(400, 400);

			ffTest.off('media-perf-uplift-mutation-fix', 'when feature flag is off', () => {
				it('should not apply same-ratio optimization for crop mode', () => {
					const result = calculateDimensions(imgElement, parentElement, 'crop');
					// Image is slightly portrait relative to parent
					expect(result).toEqual({ width: 398, maxWidth: '100%' });
				});

				it('should not apply same-ratio optimization for stretchy-fit mode', () => {
					const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
					expect(result).toEqual({ height: '100%', maxWidth: '100%' });
				});
			});

			ffTest.on('media-perf-uplift-mutation-fix', 'when both flags are on', () => {
				ffTest.on('media-perf-ratio-calc-fix', 'uses new threshold approach', () => {
					it('should detect as same ratio for crop mode and return optimized dimensions', () => {
						// |0.995 - 1.005| = 0.01 < 0.1 → considered "same"
						const result = calculateDimensions(imgElement, parentElement, 'crop');
						expect(result).toEqual({ maxWidth: '100%' });
					});

					it('should detect as same ratio for stretchy-fit mode and return optimized dimensions', () => {
						const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
						expect(result).toEqual({ width: '100%', maxHeight: '100%' });
					});
				});
			});
		});

		describe('Scenario 3: Subpixel parent dimensions (668×443 in 333.33×222.22)', () => {
			const imgElement = createMockImgElement(668, 443);
			const parentElement = createMockParentElement(333.33, 222.22);

			ffTest.off('media-perf-uplift-mutation-fix', 'when feature flag is off', () => {
				it('should not apply same-ratio optimization for crop mode', () => {
					const result = calculateDimensions(imgElement, parentElement, 'crop');
					// Image is landscape relative to parent
					expect(result).toEqual({ height: 443, maxHeight: '100%' });
				});

				it('should not apply same-ratio optimization for stretchy-fit mode', () => {
					const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
					expect(result).toEqual({ width: '100%', maxHeight: '100%' });
				});
			});

			ffTest.on(
				'media-perf-uplift-mutation-fix',
				'when uplift flag is on but ratio-calc-fix is off',
				() => {
					ffTest.off('media-perf-ratio-calc-fix', 'uses old rounding approach', () => {
						it('should NOT detect as same ratio for crop mode (old approach fails)', () => {
							// 668/333.33 = 2.004 → rounds to 2.00
							// 443/222.22 = 1.994 → rounds to 1.99
							// 2.00 !== 1.99 → considered "different"
							const result = calculateDimensions(imgElement, parentElement, 'crop');
							expect(result).toEqual({ height: 443, maxHeight: '100%' });
						});

						it('should NOT detect as same ratio for stretchy-fit mode (old approach fails)', () => {
							const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
							expect(result).toEqual({ width: '100%', maxHeight: '100%' });
						});
					});
				},
			);

			ffTest.on('media-perf-uplift-mutation-fix', 'when both flags are on', () => {
				ffTest.on('media-perf-ratio-calc-fix', 'uses new threshold approach', () => {
					it('should detect as same ratio for crop mode and return optimized dimensions', () => {
						// |2.004 - 1.994| = 0.01 < 0.1 → considered "same"
						const result = calculateDimensions(imgElement, parentElement, 'crop');
						expect(result).toEqual({ maxWidth: '100%' });
					});

					it('should detect as same ratio for stretchy-fit mode and return optimized dimensions', () => {
						const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
						expect(result).toEqual({ width: '100%', maxHeight: '100%' });
					});
				});
			});
		});

		describe('Scenario 4: Common 3:2 aspect ratio with 1px difference (450×301 in 300×200)', () => {
			const imgElement = createMockImgElement(450, 301);
			const parentElement = createMockParentElement(300, 200);

			ffTest.off('media-perf-uplift-mutation-fix', 'when feature flag is off', () => {
				it('should not apply same-ratio optimization for crop mode', () => {
					const result = calculateDimensions(imgElement, parentElement, 'crop');
					// Image is slightly portrait relative to parent
					expect(result).toEqual({ width: 450, maxWidth: '100%' });
				});

				it('should not apply same-ratio optimization for stretchy-fit mode', () => {
					const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
					expect(result).toEqual({ height: '100%', maxWidth: '100%' });
				});
			});

			ffTest.on(
				'media-perf-uplift-mutation-fix',
				'when uplift flag is on but ratio-calc-fix is off',
				() => {
					ffTest.off('media-perf-ratio-calc-fix', 'uses old rounding approach', () => {
						it('should NOT detect as same ratio for crop mode (old approach fails)', () => {
							// 450/300 = 1.500 → rounds to 1.50
							// 301/200 = 1.505 → rounds to 1.51
							// 1.50 !== 1.51 → considered "different"
							const result = calculateDimensions(imgElement, parentElement, 'crop');
							expect(result).toEqual({ width: 450, maxWidth: '100%' });
						});

						it('should NOT detect as same ratio for stretchy-fit mode (old approach fails)', () => {
							const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
							expect(result).toEqual({ height: '100%', maxWidth: '100%' });
						});
					});
				},
			);

			ffTest.on('media-perf-uplift-mutation-fix', 'when both flags are on', () => {
				ffTest.on('media-perf-ratio-calc-fix', 'uses new threshold approach', () => {
					it('should detect as same ratio for crop mode and return optimized dimensions', () => {
						// |1.5 - 1.505| = 0.005 < 0.1 → considered "same"
						const result = calculateDimensions(imgElement, parentElement, 'crop');
						expect(result).toEqual({ maxWidth: '100%' });
					});

					it('should detect as same ratio for stretchy-fit mode and return optimized dimensions', () => {
						const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
						expect(result).toEqual({ width: '100%', maxHeight: '100%' });
					});
				});
			});
		});

		describe('Edge case: Actual different aspect ratios should still be detected as different', () => {
			// Image is 16:9 (1.78:1), Parent is 4:3 (1.33:1)
			const imgElement = createMockImgElement(1600, 900);
			const parentElement = createMockParentElement(400, 300);

			ffTest.on('media-perf-uplift-mutation-fix', 'when both flags are on', () => {
				ffTest.on('media-perf-ratio-calc-fix', 'should not falsely detect as same ratio', () => {
					it('should correctly identify different ratios for crop mode', () => {
						// 1600/400 = 4.0, 900/300 = 3.0
						// |4.0 - 3.0| = 1.0 > 0.1 → considered "different" (correctly)
						const result = calculateDimensions(imgElement, parentElement, 'crop');
						// Image is landscape, so should use height constraint
						expect(result).toEqual({ height: 900, maxHeight: '100%' });
					});

					it('should correctly identify different ratios for stretchy-fit mode', () => {
						const result = calculateDimensions(imgElement, parentElement, 'stretchy-fit');
						// Image is landscape, so should use width constraint
						expect(result).toEqual({ width: '100%', maxHeight: '100%' });
					});
				});
			});
		});

		describe('fit and full-fit modes should not be affected by same-ratio detection', () => {
			const imgElement = createMockImgElement(252, 253);
			const parentElement = createMockParentElement(500, 500);

			ffTest.on('media-perf-uplift-mutation-fix', 'when both flags are on', () => {
				ffTest.on('media-perf-ratio-calc-fix', 'fit modes should always use min() function', () => {
					it('should return min-based dimensions for fit mode', () => {
						const result = calculateDimensions(imgElement, parentElement, 'fit');
						expect(result).toEqual({
							maxWidth: 'min(100%, 252px)',
							maxHeight: 'min(100%, 253px)',
						});
					});

					it('should return min-based dimensions for full-fit mode', () => {
						const result = calculateDimensions(imgElement, parentElement, 'full-fit');
						expect(result).toEqual({
							maxWidth: 'min(100%, 252px)',
							maxHeight: 'min(100%, 253px)',
						});
					});
				});
			});
		});
	});

	describe('fallback to rendered dimensions when natural dimensions are zero', () => {
		const createMockImgElementWithZeroNatural = (
			renderedWidth: number,
			renderedHeight: number,
		): HTMLImageElement => {
			return {
				naturalWidth: 0,
				width: renderedWidth,
				naturalHeight: 0,
				height: renderedHeight,
			} as HTMLImageElement;
		};

		const parentElement = {
			getBoundingClientRect: () => ({ width: 500, height: 500 }),
		} as HTMLElement;

		ffTest.on('media-perf-uplift-mutation-fix', 'when both flags are on', () => {
			ffTest.on(
				'media-perf-ratio-calc-fix',
				'should use rendered dimensions when natural dimensions are zero',
				() => {
					it('should detect same ratio using rendered dimensions', () => {
						// Firefox & Safari can't always read natural dimensions correctly
						const imgElement = createMockImgElementWithZeroNatural(252, 253);
						const result = calculateDimensions(imgElement, parentElement, 'crop');
						// Should still detect as same ratio using rendered dimensions
						expect(result).toEqual({ maxWidth: '100%' });
					});
				},
			);
		});
	});
});
