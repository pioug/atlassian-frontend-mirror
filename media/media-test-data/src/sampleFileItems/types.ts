import { type FileIdentifier, type ResponseFileItem } from '@atlaskit/media-client';

export interface FileItemGenerator {
  (): [ResponseFileItem, FileIdentifier];
}
