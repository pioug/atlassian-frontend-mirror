import { FileIdentifier, ResponseFileItem } from '@atlaskit/media-client';

export interface FileItemGenerator {
  (): [ResponseFileItem, FileIdentifier];
}
