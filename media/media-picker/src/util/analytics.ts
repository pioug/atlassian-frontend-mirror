import { isRequestError, type RequestErrorMetadata } from '@atlaskit/media-client';
import { type PackageAttributes } from '@atlaskit/media-common';

// Component name will be prefixed with "media-picker-" in logs. Check ufoExperiences in utils files
export type ComponentName = 'browser' | 'clipboard' | 'dropzone';

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

export function getRequestMetadata(error?: Error): RequestErrorMetadata | undefined {
	if (error && isRequestError(error)) {
		return error.metadata;
	}
}
