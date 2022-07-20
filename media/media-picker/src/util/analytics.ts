import { isRequestError, RequestMetadata } from '@atlaskit/media-client';
import {
  filterFeatureFlagKeysAllProducts,
  filterFeatureFlagNames,
  PackageAttributes,
} from '@atlaskit/media-common';

// Component name will be prefixed with "media-picker-" in logs. Check ufoExperiences in utils files
export type ComponentName = 'browser' | 'clipboard' | 'dropzone';

const relevantFlags = {
  newCardExperience: true,
  captions: false,
  timestampOnVideo: false,
  observedWidth: false,
  mediaInline: false,
  folderUploads: true,
  mediaUploadApiV2: true,
};

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const LOGGED_FEATURE_FLAGS = filterFeatureFlagNames(relevantFlags);

export const LOGGED_FEATURE_FLAG_KEYS = filterFeatureFlagKeysAllProducts(
  relevantFlags,
);

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
