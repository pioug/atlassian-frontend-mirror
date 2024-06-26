<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/table"

> Do not edit this file. This report is auto-generated using
> [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)
- [Peer Dependencies](#peer-dependencies)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
/// <reference types="react" />

import { BoxProps } from '@atlaskit/primitives';
import { FC } from 'react';
import { jsx } from '@emotion/react';
import { MemoExoticComponent } from 'react';
import { default as React_2 } from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';

// @public (undocumented)
type BaseCellProps = {
	width?: string;
	align?: 'icon' | 'number' | 'text';
	as?: 'td' | 'th';
	scope?: 'col' | 'row';
	testId?: string;
	children?: ReactNode;
	colSpan?: number;
} & Pick<BoxProps<any>, 'backgroundColor' | 'paddingBlock' | 'paddingInline' | 'xcss'>;

// @public (undocumented)
type BodyProps<Item extends object> =
	| {
			rows: Item[];
			children: (row: Item) => ReactElement;
	  }
	| {
			rows?: never;
			children: ReactElement | ReactElement[];
	  };

// @public
export const Cell: FC<Omit<BaseCellProps, 'as'>>;

// @public (undocumented)
interface CellProps {
	// (undocumented)
	children?: ReactNode;
	name: string;
	// (undocumented)
	onClick?: React.MouseEventHandler;
	testId?: string;
}

// @public
export const ExpandableCell: MemoExoticComponent<() => jsx.JSX.Element>;

// @public
export const ExpandableRow: ({
	children,
	isExpanded,
	isDefaultExpanded,
}: ExpandableRowProps) => JSX.Element;

// @public
export const ExpandableRowContent: ({ children }: ExpandableRowContentProps) => JSX.Element;

// @public (undocumented)
type ExpandableRowContentProps = {
	children?: React_2.ReactNode;
};

// @public (undocumented)
type ExpandableRowProps = {
	children: React_2.ReactNode;
	isExpanded?: boolean;
	isDefaultExpanded?: boolean;
};

// @public
export const HeadCell: FC<THProps>;

// @public
export const Row: FC<RowProps>;

// @public (undocumented)
type RowProps = {
	testId?: string;
	children?: ReactNode;
};

// @public
export const SortableColumn: FC<CellProps>;

// @public (undocumented)
type SortKey<Key extends number | string | symbol> = 'unset' | Key;

// @public
function Table<ItemType extends object = object>({
	children,
	isSelectable,
	sortKey,
	testId,
}: TableProps<ItemType>): jsx.JSX.Element;
export default Table;

// @public (undocumented)
type TableProps<ItemType extends object = {}> = {
	testId?: string;
	sortKey?: SortKey<keyof ItemType>;
	children: ReactElement | ReactElement[];
} & (
	| {
			isSelectable: true;
			defaultSelected?: number;
	  }
	| {
			isSelectable?: false;
	  }
);

// @public
export function TBody<ObjectType extends object>({
	rows,
	children,
}: BodyProps<ObjectType>): jsx.JSX.Element;

// @public (undocumented)
export const THead: FC<THeadProps>;

// @public (undocumented)
type THeadProps = {
	actions?: (selected: number[]) => ReactNode;
	children?: ReactNode;
};

// @public (undocumented)
type THProps = Omit<BaseCellProps, 'as'>;

// (No @packageDocumentation comment for this package)
```

<!--SECTION END: Main Entry Types-->

### Peer Dependencies

<!--SECTION START: Peer Dependencies-->

```json
{
	"react": "^16.8.0"
}
```

<!--SECTION END: Peer Dependencies-->
