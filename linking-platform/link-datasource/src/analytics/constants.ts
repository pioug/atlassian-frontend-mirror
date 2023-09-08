import { PackageMetaDataType } from './generated/analytics.types';

export const EVENT_CHANNEL = 'media';

export const packageMetaData: PackageMetaDataType = {
  packageName: process.env._PACKAGE_NAME_,
  packageVersion: process.env._PACKAGE_VERSION_,
};
