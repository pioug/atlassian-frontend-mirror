import React, { Suspense, useCallback, useEffect, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import Select from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

const XPC_DROPDOWN_ZINDEX = 99999;
const STORAGE_KEY = 'lp.example.xpc-viewer';

interface RequireContext {
	keys(): string[];
	(id: string): Record<string, unknown>;
}
declare const require: {
	context: (dir: string, recursive: boolean, pattern: RegExp) => RequireContext;
};
type XPCExampleType = (typeof xpcExamples)[number];
type OptionType = { label: string; value: string };
type GroupType = { label: string; options: OptionType[] };

// Automatically discover all .tsx files inside the xpc/ folder (one level
// deep — `shared/` helpers are deliberately excluded). The website's
// fs-loader only sees top-level `examples/*.tsx`, so this viewer is the
// discoverable handle through which the xpc/ subfolder examples become
// browsable. Adding a new `xpc/<name>.tsx` will make it appear in the
// dropdown automatically.
const xpcContext = require.context(
	'./xpc',
	false, // not recursive — avoid pulling in xpc/shared/*.ts helpers
	/^\.\/xpc-[^/]+\.tsx$/,
);

// Convert "./xpc-inline-1p.tsx" → "xpc-inline-1p"
const xpcExamples = xpcContext
	.keys()
	.map((key: string) => key.replace(/^\.\//, '').replace(/\.tsx$/, ''));

const styles = cssMap({
	container: {
		paddingTop: token('space.800'),
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
		paddingLeft: token('space.200'),
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
	return Promise.resolve(xpcContext(`./${path}.tsx`));
};

const selectOptions: GroupType[] = [
	{
		label: 'xpc',
		options: xpcExamples.map((path: XPCExampleType) => ({ label: path, value: path })),
	},
];

export default (): React.JSX.Element => {
	const [selected, setSelected] = useState<OptionType | null>(null);
	// Wrap in an object so React doesn't treat the function component as a
	// setState updater function.
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

	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved && xpcExamples.includes(saved)) {
			handleChange({ label: saved, value: saved });
		}
	}, [handleChange]);

	const { Component } = component ?? {};

	return (
		<Box xcss={styles.container}>
			<Box backgroundColor="color.background.input" xcss={styles.select}>
				<Select<OptionType, false>
					inputId="xpc-viewer-select"
					options={selectOptions}
					value={selected}
					onChange={handleChange}
					placeholder="Select an XPC example..."
					menuPortalTarget={document.body}
					// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides -- example: control select portalled z-index
					styles={{ menuPortal: (base) => ({ ...base, zIndex: XPC_DROPDOWN_ZINDEX }) }}
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
