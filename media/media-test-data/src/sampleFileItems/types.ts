import {
  type FileIdentifier,
  type ResponseFileItem,
} from '@atlaskit/media-client';
import { type PartialResponseFileItem } from '@atlaskit/media-client/test-helpers';

export interface FileItemGenerator {
  (override?: PartialResponseFileItem): [ResponseFileItem, FileIdentifier];
}
