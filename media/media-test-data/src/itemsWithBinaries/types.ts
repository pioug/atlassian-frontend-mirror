import { type FileIdentifier, type ResponseFileItem } from '@atlaskit/media-client';
import { type PartialResponseFileItem } from '@atlaskit/media-client/test-helpers';

export type BinaryFn = () => Promise<string>;
export type ArtifactsSet = Record<string, BinaryFn>;
export type ArtifactsSets = Record<string, ArtifactsSet>;

export type Binaries = { binaryUri: string; image: string };

export interface ItemWithBinaries extends Binaries {
	fileItem: ResponseFileItem;
}

export type GeneratedItemWithBinaries = [ItemWithBinaries, FileIdentifier];

export interface ItemWithBinariesGenerator {
	(override?: PartialResponseFileItem): Promise<GeneratedItemWithBinaries>;
}
