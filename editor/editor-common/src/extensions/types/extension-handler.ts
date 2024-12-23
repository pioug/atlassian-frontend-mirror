import type { ADFEntity } from '@atlaskit/adf-utils/types';

import type { Parameters } from './extension-parameters';

export interface ExtensionParams<T extends Parameters> {
	extensionKey: string;
	extensionType: string;
	type?: 'extension' | 'inlineExtension' | 'bodiedExtension' | 'multiBodiedExtension';
	parameters?: T;
	content?: object | string; // This would be the original Atlassian Document Format
	localId?: string;
	fragmentLocalId?: string;
	layout?: string;
}

export type ExtensionHandler<T extends Parameters = Parameters> = (
	ext: ExtensionParams<T>,
	doc: object,
	actions?: MultiBodiedExtensionActions,
) => JSX.Element | null;

export type OnSaveCallback<T extends Parameters = Parameters> = (params: T) => void;

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransformBefore<T extends Parameters = Parameters> = (data: T) => any;
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransformAfter<T extends Parameters = Parameters> = (data: any) => Promise<Partial<T>>;

export type ExtensionAPI<T extends Parameters = Parameters> = {
	editInContextPanel: (
		transformBefore: TransformBefore<T>,
		transformAfter: TransformAfter<T>,
	) => void;
	_editInLegacyMacroBrowser: () => void;
	doc: {
		insertAfter: (
			localId: string,
			adf: ADFEntity,
			options?: {
				allowSelectionToNewNode?: boolean;
				allowSelectionNearNewNode?: boolean;
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
			},
		) => void;
	};
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
	changeActive: (index: number) => boolean;
	addChild: () => boolean;
	getChildrenCount: () => number;
	removeChild: (index: number) => boolean;
	updateParameters: (parameters: Parameters) => boolean;
	getChildren(): Array<ADFEntity>;
};

// DEPRECATED
export type ParametersGetter<T extends Parameters = Parameters> = TransformBefore<T>;
export type AsyncParametersGetter<T extends Parameters = Parameters> = TransformAfter<T>;
