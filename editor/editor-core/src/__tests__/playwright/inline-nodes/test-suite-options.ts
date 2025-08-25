import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { EditorProps } from '@atlaskit/editor-core';

export interface TestSuiteOptions {
	adfs: {
		multiline: ADFEntity;
		multipleNodesAcrossLines: ADFEntity;
		notrailingSpaces: ADFEntity;
		trailingSpaces: ADFEntity;
	};
	editorOptions?: EditorProps;
	nodeName: string;
	// set this to filter test run to help debug
	only?: boolean;
}
