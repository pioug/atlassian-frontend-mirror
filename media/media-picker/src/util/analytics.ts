import { isRequestError, RequestMetadata } from '@atlaskit/media-client';
import { PackageAttributes } from '@atlaskit/media-common';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

// Component name will be prefixed with "media-picker-" in logs. Check ufoExperiences in utils files
export type ComponentName = 'browser' | 'clipboard' | 'dropzone';

export function getPackageAttributes(
  componentName: ComponentName,
): PackageAttributes {
  return {
    packageName,
    packageVersion,
    componentName,
    component: componentName,
  };
}

export function getRequestMetadata(error?: Error): RequestMetadata | undefined {
  if (error && isRequestError(error)) {
    return error.metadata;
  }
}
