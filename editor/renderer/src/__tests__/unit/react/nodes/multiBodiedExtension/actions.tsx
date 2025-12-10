import React from 'react';
import { renderHook } from '@testing-library/react';
import { useMultiBodiedExtensionActions } from '../../../../../react/nodes/multiBodiedExtension/actions';

describe('useMultiBodiedExtensionActions', () => {
	const updateActiveChild = jest.fn();
	const children = [<div key="child1" />, <div key="child2" />];
	const allowBodiedOverride = true;
	const childrenContainer = <div>Container</div>;

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('provides actions', () => {
		describe('changeActive', () => {
			it('should change active child when index is valid', () => {
				const { result } = renderHook(() =>
					useMultiBodiedExtensionActions({
						updateActiveChild,
						children,
						allowBodiedOverride,
						childrenContainer,
					}),
				);

				const success = result.current.changeActive(1);
				expect(success).toBe(true);
				expect(updateActiveChild).toHaveBeenCalledWith(1);
			});

			it('should not change active child when index is invalid', () => {
				const { result } = renderHook(() =>
					useMultiBodiedExtensionActions({
						updateActiveChild,
						children,
						allowBodiedOverride,
						childrenContainer,
					}),
				);

				const success = result.current.changeActive('1' as any);
				expect(success).toBe(false);
				expect(updateActiveChild).not.toHaveBeenCalled();
			});
		});

		describe('addChild', () => {
			it('should always return false', () => {
				const { result } = renderHook(() =>
					useMultiBodiedExtensionActions({
						updateActiveChild,
						children,
						allowBodiedOverride,
						childrenContainer,
					}),
				);

				expect(result.current.addChild()).toBe(false);
			});
		});

		describe('getChildrenCount', () => {
			it('should return correct children count', () => {
				const { result } = renderHook(() =>
					useMultiBodiedExtensionActions({
						updateActiveChild,
						children,
						allowBodiedOverride,
						childrenContainer,
					}),
				);

				expect(result.current.getChildrenCount()).toBe(2);
			});

			it('should return 0 if children is not an array', () => {
				const { result } = renderHook(() =>
					useMultiBodiedExtensionActions({
						updateActiveChild,
						children: '123',
						allowBodiedOverride,
						childrenContainer,
					}),
				);

				expect(result.current.getChildrenCount()).toEqual(0);
			});
		});

		describe('removeChild', () => {
			it('should always return false', () => {
				const { result } = renderHook(() =>
					useMultiBodiedExtensionActions({
						updateActiveChild,
						children,
						allowBodiedOverride,
						childrenContainer,
					}),
				);

				expect(result.current.removeChild(0)).toBe(false);
			});
		});

		describe('updateParameters', () => {
			it('should always return false', () => {
				const { result } = renderHook(() =>
					useMultiBodiedExtensionActions({
						updateActiveChild,
						children,
						allowBodiedOverride,
						childrenContainer,
					}),
				);

				expect(result.current.updateParameters({})).toBe(false);
			});
		});

		describe('getChildren', () => {
			it('should always return empty array', () => {
				const { result } = renderHook(() =>
					useMultiBodiedExtensionActions({
						updateActiveChild,
						children,
						allowBodiedOverride,
						childrenContainer,
					}),
				);

				expect(result.current.getChildren()).toEqual([]);
			});
		});

		describe('getChildrenContainer', () => {
			it('should return children container when allowBodiedOverride is true', () => {
				const { result } = renderHook(() =>
					useMultiBodiedExtensionActions({
						updateActiveChild,
						children,
						allowBodiedOverride,
						childrenContainer,
					}),
				);

				expect(result.current.getChildrenContainer()).toBe(childrenContainer);
			});

			it('should return null for children container when allowBodiedOverride is false', () => {
				const { result } = renderHook(() =>
					useMultiBodiedExtensionActions({
						updateActiveChild,
						children,
						allowBodiedOverride: false,
						childrenContainer,
					}),
				);

				expect(result.current.getChildrenContainer()).toBeNull();
			});
		});
	});
});
