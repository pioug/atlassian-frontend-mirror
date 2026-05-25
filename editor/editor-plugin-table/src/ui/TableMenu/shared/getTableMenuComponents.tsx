import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

import { getCellMenuComponents } from '../cell/getCellMenuComponents';
import { getColumnMenuComponents } from '../column/getColumnMenuComponents';
import { getRowMenuComponents } from '../row/getRowMenuComponents';

import { getSharedItems } from './getSharedItems';
import type { TableMenuComponentsParams } from './types';

export const getTableMenuComponents = (params: TableMenuComponentsParams): RegisterComponent[] => [
	...getRowMenuComponents(params),
	...getColumnMenuComponents(params),
	...getCellMenuComponents(params),
	...getSharedItems(params),
];
