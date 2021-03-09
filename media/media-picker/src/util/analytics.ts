import { PackageAttributes } from '@atlaskit/media-common';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

export type ComponentName = 'popup' | 'browser' | 'clipboard' | 'dropzone';

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
