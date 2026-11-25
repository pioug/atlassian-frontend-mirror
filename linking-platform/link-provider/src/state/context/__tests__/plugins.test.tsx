import React from 'react';

import { render, screen, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

import * as platformFlags from '@atlaskit/platform-feature-flags/fg';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { SmartCardProvider } from '../../../smart-card-provider';
import { usePlugins } from '../usePlugins';

const makeResolver = () => ({
	resolve: jest.fn(() => ({ remix: { isAvailable: () => true, open: jest.fn() } })),
	render: jest.fn(() => null),
});

describe('nested provider plugins', () => {
	it('does not resolve or render plugins with the kill switch off', () => {
		failGate('platform_sl_3p_auth_visualize_killswitch');
		const parent = makeResolver();
		const child = makeResolver();
		const { result } = renderHook(usePlugins, {
			wrapper: ({ children }) => (
				<SmartCardProvider plugins={parent}>
					<SmartCardProvider plugins={child}>{children}</SmartCardProvider>
				</SmartCardProvider>
			),
		});
		expect(result.current).toEqual({});
		expect(parent.resolve).not.toHaveBeenCalled();
		expect(child.resolve).not.toHaveBeenCalled();
		expect(parent.render).not.toHaveBeenCalled();
		expect(child.render).not.toHaveBeenCalled();
	});

	it('rechecks resolution when the gate becomes enabled with unchanged plugin props', () => {
		const gate = jest.spyOn(platformFlags, 'fg').mockReturnValue(false);
		const plugins = makeResolver();
		const { result, rerender } = renderHook(usePlugins, {
			wrapper: ({ children }) => (
				<SmartCardProvider plugins={plugins}>{children}</SmartCardProvider>
			),
		});
		expect(plugins.resolve).not.toHaveBeenCalled();
		gate.mockReturnValue(true);
		rerender();
		expect(plugins.resolve).toHaveBeenCalledTimes(1);
		expect(result.current.remix).toBeDefined();
	});

	it('inherits plugins without mounting their UI again', () => {
		passGate('platform_sl_3p_auth_visualize_killswitch');
		const parent = makeResolver();
		const { result } = renderHook(usePlugins, {
			wrapper: ({ children }) => (
				<SmartCardProvider plugins={parent}>
					<SmartCardProvider>{children}</SmartCardProvider>
				</SmartCardProvider>
			),
		});
		expect(result.current.remix?.open).toBe(parent.resolve.mock.results[0].value.remix.open);
		expect(parent.render).toHaveBeenCalledTimes(1);
	});

	it.each([false, true])(
		'preserves parent ownership when parent plugins exist: %s',
		(hasParent) => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			const parent = makeResolver();
			const child = makeResolver();
			const rovoOptions = { isRovoEnabled: true, isRovoLLMEnabled: true };
			const { result } = renderHook(usePlugins, {
				wrapper: ({ children }) => (
					<SmartCardProvider
						product="CONFLUENCE"
						rovoOptions={rovoOptions}
						plugins={hasParent ? parent : undefined}
					>
						<SmartCardProvider plugins={child}>{children}</SmartCardProvider>
					</SmartCardProvider>
				),
			});
			expect(result.current.remix?.open).toBe(
				hasParent ? parent.resolve.mock.results[0].value.remix.open : undefined,
			);
			expect(child.resolve).not.toHaveBeenCalled();
			expect(child.render).not.toHaveBeenCalled();
		},
	);
});

describe('plugin fault isolation', () => {
	it('keeps children rendered and exposes no capabilities when resolution throws', async () => {
		passGate('platform_sl_3p_auth_visualize_killswitch');
		const plugins = {
			resolve: jest.fn(() => {
				throw new Error('resolution failed');
			}),
			render: jest.fn(),
		};
		const ReadPlugins = () => {
			const available = usePlugins();
			return <span>{available.remix ? 'available' : 'unavailable'}</span>;
		};
		expect(() =>
			render(
				<SmartCardProvider plugins={plugins}>
					<ReadPlugins />
				</SmartCardProvider>,
			),
		).not.toThrow();
		expect(screen.getByText('unavailable')).toBeInTheDocument();
		expect(plugins.render).not.toHaveBeenCalled();
		await expect(screen.getByText('unavailable')).toBeAccessible();
	});

	it('does not invoke plugin UI during server rendering', () => {
		passGate('platform_sl_3p_auth_visualize_killswitch');
		const plugins = {
			resolve: () => ({}),
			render: jest.fn(() => {
				throw new Error('browser-only plugin');
			}),
		};
		expect(() =>
			renderToString(
				<SmartCardProvider plugins={plugins}>
					<span>server content</span>
				</SmartCardProvider>,
			),
		).not.toThrow();
		expect(plugins.render).not.toHaveBeenCalled();
	});

	it.each(['callback', 'descendant', 'effect'])(
		'contains a throwing plugin %s without unmounting children',
		(source) => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
			let childUnmounts = 0;
			const Child = () => {
				React.useEffect(
					() => () => {
						childUnmounts++;
					},
					[],
				);
				return <span>parent content</span>;
			};
			const BrokenPlugin = () => {
				React.useEffect(() => {
					if (source === 'effect') {
						throw new Error('plugin effect failed');
					}
				}, []);
				if (source === 'descendant') {
					throw new Error('plugin render failed');
				}
				return null;
			};
			const plugins = {
				resolve: () => ({}),
				render: () => {
					if (source === 'callback') {
						throw new Error('callback failed');
					}
					return <BrokenPlugin />;
				},
			};
			try {
				expect(() =>
					render(
						<SmartCardProvider plugins={plugins}>
							<Child />
						</SmartCardProvider>,
					),
				).not.toThrow();
				expect(screen.getByText('parent content')).toBeInTheDocument();
				expect(childUnmounts).toBe(0);
			} finally {
				errors.mockRestore();
			}
		},
	);
});
