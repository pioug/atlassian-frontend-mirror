import { FileIdentifier, ResponseFileItem } from '@atlaskit/media-client';

export type Binaries = { binaryUri: string; image: string };

export interface ItemWithBinaries extends Binaries {
  fileItem: ResponseFileItem;
}

export type GeneratedItemWithBinaries = [ItemWithBinaries, FileIdentifier];
