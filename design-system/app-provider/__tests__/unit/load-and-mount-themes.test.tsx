/* eslint-disable testing-library/no-node-access */
import { themeImportMap } from '@atlaskit/tokens/artifacts/theme-import-map';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { waitFor } from '@atlassian/testing-library/testing-library/react';

import type { Theme } from '../../src/theme-provider/context/theme';
import { loadAndMountThemes } from '../../src/theme-provider/utils/load-and-mount-themes';

const theme: Theme = {
	light: 'light',
	dark: 'dark',
	shape: 'shape',
	spacing: 'spacing',
	typography: 'typography',
};
const baseIds = ['light', 'dark', 'shape', 'spacing', 'typography'];
const overrideIds = ['light-finesse', 'dark-finesse', 'typography-finesse'];

function mountedIds() {
	return Array.from(document.head.querySelectorAll('style[data-theme]')).map((style) =>
		style.getAttribute('data-theme'),
	);
}

afterEach(() => {
	jest.restoreAllMocks();
	document.head.querySelectorAll('style[data-theme]').forEach((style) => style.remove());
});

describe('loadAndMountThemes', () => {
	it('loads the configured base themes before their real Finesse overrides', async () => {
		passGate('platform-dst-tokens-finesse');
		await loadAndMountThemes(theme);

		expect(mountedIds()).toEqual([...baseIds, ...overrideIds]);
		expect(document.head.querySelector('style[data-theme="dark-finesse"]')).toHaveTextContent(
			'--ds-background-neutral-subtle-hovered: #BDBDBD0A',
		);
		expect(document.head.querySelector('style[data-theme="typography-finesse"]')).toHaveTextContent(
			'--ds-font-heading-medium: normal 500',
		);
	});

	it('keeps loading only base themes when Finesse is disabled', async () => {
		failGate('platform-dst-tokens-finesse');
		await loadAndMountThemes(theme);

		await waitFor(() => expect(mountedIds()).toHaveLength(baseIds.length));
		expect(mountedIds()).toEqual(expect.arrayContaining(baseIds));
	});

	it('resolves overrides for configured non-default themes', async () => {
		passGate('platform-dst-tokens-finesse');
		await loadAndMountThemes({
			...theme,
			light: 'dark-increased-contrast',
			dark: 'light-increased-contrast',
		});

		expect(mountedIds()).toEqual([
			'dark-increased-contrast',
			'light-increased-contrast',
			'shape',
			'spacing',
			'typography',
			'dark-increased-contrast-finesse',
			'light-increased-contrast-finesse',
			'typography-finesse',
		]);
	});

	it('continues to skip themes explicitly disabled by JavaScript callers', async () => {
		passGate('platform-dst-tokens-finesse');
		await loadAndMountThemes({
			...theme,
			light: undefined,
			dark: null,
			shape: undefined,
		} as unknown as Theme);

		expect(mountedIds()).toEqual(['spacing', 'typography', 'typography-finesse']);
	});

	it('waits for a slow base import before mounting a faster override', async () => {
		passGate('platform-dst-tokens-finesse');
		let resolveBase!: (value: { default: string }) => void;
		const base = new Promise<{ default: string }>((resolve) => {
			resolveBase = resolve;
		});
		const override = Promise.resolve({ default: '/* override */' });
		jest.spyOn(themeImportMap, 'dark').mockReturnValueOnce(base);
		jest.spyOn(themeImportMap, 'dark-finesse').mockReturnValueOnce(override);

		const loading = loadAndMountThemes(theme);
		await override;
		expect(mountedIds()).not.toContain('dark-finesse');
		resolveBase({ default: '/* base */' });
		await loading;

		expect(mountedIds()).toEqual([...baseIds, ...overrideIds]);
	});

	it.each(['dark', 'typography-finesse'] as const)(
		'mounts the remaining themes in order when the %s import fails',
		async (failedId) => {
			passGate('platform-dst-tokens-finesse');
			jest.spyOn(themeImportMap, failedId).mockRejectedValueOnce(new Error('Theme import failed'));

			await expect(loadAndMountThemes(theme)).resolves.toBeUndefined();

			expect(mountedIds()).toEqual([...baseIds, ...overrideIds].filter((id) => id !== failedId));
		},
	);

	it('mounts each stylesheet once across concurrent and repeated loads', async () => {
		passGate('platform-dst-tokens-finesse');
		await Promise.all([
			loadAndMountThemes(theme),
			loadAndMountThemes(theme),
			loadAndMountThemes(theme),
		]);
		await loadAndMountThemes(theme);

		expect(mountedIds()).toEqual([...baseIds, ...overrideIds]);
	});

	it('reuses server-rendered or globally mounted styles', async () => {
		passGate('platform-dst-tokens-finesse');
		const existing = document.createElement('style');
		existing.dataset.theme = 'dark-finesse';
		existing.textContent = '/* already loaded */';
		document.head.appendChild(existing);
		const importOverride = jest.spyOn(themeImportMap, 'dark-finesse');

		await loadAndMountThemes(theme);

		expect(importOverride).not.toHaveBeenCalled();
		expect(document.head.querySelectorAll('style[data-theme="dark-finesse"]')).toHaveLength(1);
		expect(existing).toHaveTextContent('/* already loaded */');
	});
});
