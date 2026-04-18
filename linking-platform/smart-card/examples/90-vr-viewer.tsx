import React, { Suspense, useCallback, useEffect, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import Select from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

const VR_DROPDOWN_ZINDEX = 99999;
const STORAGE_KEY = 'lp.example.vr-viewer';

interface RequireContext {
	keys(): string[];
	(id: string): Record<string, unknown>;
}
declare const require: {
	context: (dir: string, recursive: boolean, pattern: RegExp) => RequireContext;
};
type VRExampleType = (typeof vrExamples)[number];
type OptionType = { label: string; value: string };
type GroupType = { label: string; options: OptionType[] };

// Automatically discover all .tsx files inside vr-* folders using webpack's
// require.context. No manual list needed — adding a file to any vr-* folder
// will make it appear in the dropdown automatically.
const vrContext = require.context(
	'.', // search from examples/
	true, // recursive
	/^\.\/vr-[^/]+\/[^/]+\.tsx$/, // match vr-<folder>/<file>.tsx
);

// Convert "./vr-block-card/vr-block-card-error.tsx" → "vr-block-card/vr-block-card-error"
const vrExamples = vrContext
	.keys()
	.map((key: string) => key.replace(/^\.\//, '').replace(/\.tsx$/, ''));

const styles = cssMap({
	container: {
		paddingTop: token('space.800'), //'56px',
	},
	select: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 800,
		borderBottom: `${token('border.width')} solid ${token('color.border')}`,
		paddingTop: token('space.100'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.200'), //'8px 16px',
		boxShadow: token('elevation.shadow.overflow'),
	},
});

// Given a module that may or may not have a default export, return the first
// exported component (default first, then the first named export).
const resolveComponent = (mod: Record<string, unknown>): React.ComponentType<any> | undefined => {
	if (typeof mod.default === 'function') {
		return mod.default as React.ComponentType<any>;
	}
	const first = Object.values(mod).find((v) => typeof v === 'function');
	return first as React.ComponentType<any> | undefined;
};

// Use the same require.context to load a module by its discovered key.
const loadExample = (path: string): Promise<Record<string, unknown>> => {
	return Promise.resolve(vrContext(`./${path}.tsx`));
};

// Group the flat list by folder name for the dropdown sections
const selectOptions: GroupType[] = Object.entries(
	vrExamples.reduce<Record<string, VRExampleType[]>>((acc, path) => {
		const folder = path.split('/')[0];
		(acc[folder] ??= []).push(path);
		return acc;
	}, {}),
).map(([folder, paths]) => ({
	label: folder,
	options: paths.map((path) => ({ label: path.split('/')[1], value: path })),
}));

export default () => {
	const [selected, setSelected] = useState<OptionType | null>(null);
	// Store component in an object wrapper to prevent React from treating
	// a function component as a setState updater function.
	const [component, setComponent] = useState<{ Component: React.ComponentType<any> } | null>(null);

	const handleChange = useCallback(async (option: OptionType | null) => {
		setSelected(option);
		setComponent(null);
		if (!option) {
			localStorage.removeItem(STORAGE_KEY);
			return;
		}
		localStorage.setItem(STORAGE_KEY, option.value);
		const mod = await loadExample(option.value);
		const Component = resolveComponent(mod);
		if (Component) {
			setComponent({ Component });
		}
	}, []);

	// Restore last selection from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved && vrExamples.includes(saved)) {
			const option: OptionType = { label: saved.split('/')[1], value: saved };
			handleChange(option);
		}
	}, [handleChange]);

	const { Component } = component ?? {};

	return (
		<Box xcss={styles.container}>
			<Box backgroundColor="color.background.input" xcss={styles.select}>
				<Select<OptionType, false>
					inputId="vr-viewer-select"
					options={selectOptions}
					value={selected}
					onChange={handleChange}
					placeholder="Select a VR example..."
					menuPortalTarget={document.body}
					styles={{ menuPortal: (base) => ({ ...base, zIndex: VR_DROPDOWN_ZINDEX }) }}
				/>
			</Box>
			{Component && (
				<Suspense fallback={<div>Loading...</div>}>
					<Component />
				</Suspense>
			)}
		</Box>
	);
};
