import { Fragment, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { InsertNodeConfig } from '../types';

import { insertProseMirrorContent } from './insert-node-helpers';

export const handleInsertContent =
	({ node, options }: Omit<InsertNodeConfig, 'state' | 'dispatch'>) =>
	(tr: Transaction): boolean => {
		const position = tr.selection;

		if (!(node instanceof PMNode || node instanceof Fragment)) {
			return false;
		}

		insertProseMirrorContent({
			tr,
			node,
			position,
			selectNodeInserted: options.selectNodeInserted,
		});

		tr.scrollIntoView();

		return true;
	};
