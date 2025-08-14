/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { type Fragment } from '@atlaskit/editor-prosemirror/model';

export interface Serializer<T> {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style -- method-signature-style ignored via go/ees013 (to be fixed)
	serializeFragment(fragment: Fragment, props?: any, target?: any, key?: string): T | null;
}
