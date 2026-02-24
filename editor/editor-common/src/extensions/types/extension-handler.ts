import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import type { Parameters } from './extension-parameters';

export interface ExtensionParams<T extends Parameters> {
	content?: object | string; // This would be the original Atlassian Document Format
	extensionKey: string;
	extensionType: string;
	fragmentLocalId?: string;
	layout?: string;
	localId?: string;
	parameters?: T;
	type?: 'extension' | 'inlineExtension' | 'bodiedExtension' | 'multiBodiedExtension';
}

export type ExtensionHandler<T extends Parameters = Parameters> = (
	ext: ExtensionParams<T>,
	doc: object,
	actions?: MultiBodiedExtensionActions,
) => JSX.Element | null;

export type OnSaveCallback<T extends Parameters = Parameters> = (params: T) => void;
export type OnSaveCallbackAsync<T extends Parameters = Parameters> = (params: T) => Promise<void>;

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransformBefore<T extends Parameters = Parameters> = (data: T) => any;
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransformAfter<T extends Parameters = Parameters> = (data: any) => Promise<Partial<T>>;

export type ExtensionAPI<T extends Parameters = Parameters> = {
	_editInLegacyMacroBrowser: () => void;
	doc: {
		insertAfter: (
			localId: string,
			adf: ADFEntity,
			options?: {
				allowSelectionNearNewNode?: boolean;
				allowSelectionToNewNode?: boolean;
			},
		) => void;
		scrollTo: (localId: string) => void;
		update: (
			localId: string,
			mutationCallback: (
				currentValue: Pick<ADFEntity, 'content' | 'attrs' | 'marks'>,
			) => Pick<ADFEntity, 'content' | 'attrs' | 'marks'>,
			options?: {
				addToHistory?: boolean;
				scrollIntoView?: boolean;
			},
		) => void;
	};
	editInContextPanel: (
		transformBefore: TransformBefore<T>,
		transformAfter: TransformAfter<T>,
	) => void;
	getNodeWithPosByLocalId: (localId: string) => NodeWithPos;
};

export type UpdateExtension<T extends Parameters = Parameters> = (
	extensionParameters: T,
	actions?: ExtensionAPI<T>,
) => Promise<T | void>;

export interface Extension<T extends Parameters = Parameters> {
	render: ExtensionHandler<T>;
	update?: UpdateExtension<T>;
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ExtensionHandlers<T extends Parameters = any> {
	[key: string]: Extension<T> | ExtensionHandler<T>;
}

export type ReferenceEntity = {
	[prop: string]: ADFEntity | Object;
};

//Update action api once finalised
export type MultiBodiedExtensionActions = {
	addChild: () => boolean;
	changeActive: (index: number) => boolean;
	getChildren: () => Array<ADFEntity>;
	getChildrenContainer: () => React.ReactNode;
	getChildrenCount: () => number;
	removeChild: (index: number) => boolean;
	updateParameters: (parameters: Parameters) => boolean;
};

// DEPRECATED
export type ParametersGetter<T extends Parameters = Parameters> = TransformBefore<T>;
export type AsyncParametersGetter<T extends Parameters = Parameters> = TransformAfter<T>;
