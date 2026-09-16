import { fg } from '@atlaskit/platform-feature-flags/fg';

export const isMentionTypeAheadEnabled = (canOpenTypeAhead?: () => boolean): boolean =>
	canOpenTypeAhead?.() !== false || !fg('editor-disable-feature');
