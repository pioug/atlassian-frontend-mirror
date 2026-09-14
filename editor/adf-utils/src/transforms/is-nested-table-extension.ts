import type { ADFEntity } from '../types';
import { NESTED_TABLE_EXTENSION_KEY, NESTED_TABLE_EXTENSION_TYPE } from './nested-table-transform';

export const isNestedTableExtension = (extensionNode: ADFEntity): boolean =>
	extensionNode.attrs?.extensionType === NESTED_TABLE_EXTENSION_TYPE &&
	extensionNode.attrs?.extensionKey === NESTED_TABLE_EXTENSION_KEY;
