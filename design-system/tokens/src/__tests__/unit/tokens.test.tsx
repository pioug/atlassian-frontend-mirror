import fs from 'fs';

import { THEME_INPUT_DIR } from '../../../scripts/style-dictionary/constants';
import tokens from '../../artifacts/token-names';
import type { Themes } from '../../index';
import themeConfig from '../../theme-config';

const tokenPath = `../../../${THEME_INPUT_DIR}`;

const extensionThemes = Object.keys(themeConfig).filter(
	(fileName) =>
		themeConfig[fileName as Themes].extends || themeConfig[fileName as Themes].attributes.extends,
);

const themeOverrides = Object.keys(themeConfig).filter(
	(fileName) => themeConfig[fileName as Themes].override,
);

describe('tokens', () => {
	/**
	 * Matches the shape of two objects,
	 * ignoring the actual values of properties.
	 */
	const toMatchShape = (obj1: Record<string, any>, obj2: Record<string, any>) => {
		for (let key in obj1) {
			const notValueKey = key !== 'value';

			if (notValueKey && !(key in obj2)) {
				throw Error(`Property "${key}" not found in both objects`);
			}

			if (notValueKey && typeof obj1[key] !== typeof obj2[key]) {
				throw Error(
					`Type of property "${key}" did not match in both objects (${typeof obj1[
						key
					]} vs. ${typeof obj2[key]})`,
				);
			}

			if (notValueKey && typeof obj1[key] === 'object') {
				toMatchShape(obj1[key], obj2[key]);
			}
		}

		return true;
	};

	const readDirRecursive = (dir: string) => {
		const results: string[] = [];
		const list = fs.readdirSync(dir);

		list.forEach((file) => {
			file = dir + '/' + file;
			var stat = fs.statSync(file);
			if (stat && stat.isDirectory()) {
				results.push(...readDirRecursive(file));
			} else {
				results.push(file);
			}
		});

		return results;
	};

	it('should store token names in dot notation', () => {
		Object.keys(tokens).forEach((tokenName) => {
			expect(tokenName).toMatch(/^(\w+\.?){1,}$/);
			expect(tokenName).not.toMatch(/undefined|\[object Object\]/);
		});
	});

	it('should store token values as css variables', () => {
		Object.values(tokens).forEach((tokenValue) => {
			expect(tokenValue).toMatch(/^--(\w+-?){1,}$/);
			expect(tokenValue).not.toMatch(/undefined|\[object Object\]/);
		});
	});

	it('should ensure all color themes have the same folder structure', () => {
		const themes = fs
			.readdirSync(`${__dirname}/${tokenPath}`, {
				withFileTypes: true,
			})
			.filter(
				(result) =>
					result.isDirectory() &&
					result.name !== 'atlassian-spacing' &&
					result.name !== 'atlassian-typography' &&
					result.name !== 'atlassian-typography-adg3' &&
					result.name !== 'atlassian-typography-modernized' &&
					result.name !== 'atlassian-typography-refreshed' &&
					result.name !== 'atlassian-shape' &&
					result.name !== 'atlassian-shape-rounder' &&
					result.name !== 'atlassian-shape-roundest' &&
					result.name !== 'default' &&
					!extensionThemes.includes(result.name) &&
					!themeOverrides.includes(result.name),
			)
			.map((result) => result.name);
		let snapshot: string[];

		themes.forEach((themeName) => {
			const regex = new RegExp(`^.+${themeName}/`);
			const dir = readDirRecursive(`${__dirname}/${tokenPath}/${themeName}`).map((path) =>
				path.replace(regex, ''),
			);

			if (!snapshot) {
				snapshot = dir;
			}

			// If this test fails you might be removing or adding a new theme!
			// Make sure the shape of all themes are the same to get this test to pass.
			expect(snapshot).toEqual(dir);
		});
	});

	it('should ensure all token files have the same shape', () => {
		const themes = fs
			.readdirSync(`${__dirname}/${tokenPath}`, { withFileTypes: true })
			.filter(
				(result) =>
					result.isDirectory() &&
					!extensionThemes.includes(result.name) &&
					!themeOverrides.includes(result.name),
			)
			.map((result) => result.name);
		const tokens: Record<string, any> = {};

		themes.forEach((themeName) => {
			const regex = new RegExp(`^.+${themeName}/`);
			const dirs = readDirRecursive(`${__dirname}/${tokenPath}/${themeName}`);

			dirs.forEach((path) => {
				const value = require(path);
				const name = path.replace(regex, '');

				if (!tokens[name]) {
					tokens[name] = value;
				}

				expect(toMatchShape(tokens[name], value)).toEqual(true);
			});
		});
	});
});
