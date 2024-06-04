import type { PackageMetaDataType } from './utils/analytics/analytics.codegen';

export const ANALYTICS_CHANNEL = 'media';
export const COMPONENT_NAME = 'linkCreate';
export const CREATE_FORM_MAX_WIDTH_IN_PX = '480';
export const CREATE_FORM_MIN_HEIGHT_IN_PX = '200';
export const LINK_CREATE_FORM_POST_CREATE_FIELD = '__post_create__';

export const PACKAGE_DATA: PackageMetaDataType = {
  packageName: process.env._PACKAGE_NAME_ || '',
  packageVersion: process.env._PACKAGE_VERSION_ || '',
  component: COMPONENT_NAME,
  componentName: COMPONENT_NAME,
};
