/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { type Fragment } from '@atlaskit/editor-prosemirror/model';

export interface Serializer<T> {
	serializeFragment(fragment: Fragment, props?: any, target?: any, key?: string): T | null;
}
