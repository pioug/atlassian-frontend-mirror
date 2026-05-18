import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

import { getColumnMenuComponents } from '../column/getColumnMenuComponents';
import { getRowMenuComponents } from '../row/getRowMenuComponents';

import { getSharedItems } from './getSharedItems';

export const getTableMenuComponents = (): RegisterComponent[] => [
	...getRowMenuComponents(),
	...getColumnMenuComponents(),
	...getSharedItems(),
];
