import fs from 'fs';
import path from 'path';

import { _DJB2, _makeTypedGet } from '@statsig/client-core';

import { PersistentOverrideAdapter } from './PersistentOverrideAdapter';

export type LocalOverrides = {
	gates: Record<string, boolean>;
	configs: Record<string, Record<string, unknown>>;
	layers: LocalOverrides['configs'];
};

/**
 * FileOverrideAdapter provides file system based persistence for feature gate, dynamic config,
 * experiment, and layer overrides. It is designed for local development and CLI environments,
 * where browser-specific storage mechanisms (like localStorage) are not available.
 */
export class FilePersistentOverrideAdapter extends PersistentOverrideAdapter {
	private _filePath: string;
	private _browserWarningShown = false;

	constructor(filePath: string) {
		// Provide a dummy key since file persistence is used instead of localStorage.
		super('unused');
		this._filePath = path.resolve(filePath);

		// Check if the path exists and is a directory
		if (fs.existsSync(this._filePath)) {
			const stats = fs.statSync(this._filePath);
			if (stats.isDirectory()) {
				throw new Error(`Path ${this._filePath} is a directory, but a file is expected`);
			}
		}

		const dir = path.dirname(this._filePath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		this.initFromStoredOverrides();
	}

	/**
	 * Warns if the adapter is being used in a browser environment.
	 * This is a non-blocking warning that will only be shown once.
	 */
	private warnIfBrowserEnvironment() {
		// Check if we're in a browser environment
		if (
			typeof window !== 'undefined' &&
			!this._browserWarningShown &&
			window.console &&
			window.console.warn
		) {
			this._browserWarningShown = true;

			// eslint-disable-next-line no-console
			window.console.warn(
				'FilePersistentOverrideAdapter is being used in a browser environment. ' +
					'This adapter is designed for local development and CLI environments. ' +
					'For browser environments, use PersistentOverrideAdapter instead, which uses localStorage for persistence.',
			);
		}
	}

	private readStoredOverrides() {
		this.warnIfBrowserEnvironment();
		try {
			if (!fs.existsSync(this._filePath)) {
				return {};
			}
			const data = fs.readFileSync(this._filePath, 'utf8');
			return JSON.parse(data);
		} catch {
			return {};
		}
	}

	private saveOverridesToFile(overrides: any) {
		this.warnIfBrowserEnvironment();
		try {
			fs.writeFileSync(this._filePath, JSON.stringify(overrides, null, 2));
		} catch (error) {
			throw new Error(`Failed to save overrides to file: ${error}`);
		}
	}

	override initFromStoredOverrides() {
		const storedOverrides = this.readStoredOverrides();
		this.applyOverrides(storedOverrides);
	}

	override saveOverrides() {
		// Instead of saving to localStorage, persist using the file system.
		const overrides = this.getOverrides();
		this.saveOverridesToFile(overrides);
	}

	override removeAllOverrides(): void {
		this.applyOverrides({});
		try {
			if (fs.existsSync(this._filePath)) {
				fs.unlinkSync(this._filePath);
			}
		} catch (error) {
			throw new Error(`Failed to remove overrides file: ${this._filePath}: ${error}`);
		}
	}
}
