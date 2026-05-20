import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

import { getCellMenuComponents } from '../cell/getCellMenuComponents';
import { getColumnMenuComponents } from '../column/getColumnMenuComponents';
import { getRowMenuComponents } from '../row/getRowMenuComponents';

import { getSharedItems } from './getSharedItems';

export const getTableMenuComponents = (): RegisterComponent[] => [
	...getRowMenuComponents(),
	...getColumnMenuComponents(),
	...getCellMenuComponents(),
	...getSharedItems(),
];
