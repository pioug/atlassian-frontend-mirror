import { type PackageAttributes } from '@atlaskit/media-common';

import type { ComponentName } from './analytics';

const packageName = process.env._PACKAGE_NAME_ as string;

const packageVersion = process.env._PACKAGE_VERSION_ as string;

export function getPackageAttributes(componentName: ComponentName): PackageAttributes {
	return {
		packageName,
		packageVersion,
		componentName,
		component: componentName,
	};
}
