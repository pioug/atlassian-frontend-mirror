<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/grid"

> Do not edit this file. This report is auto-generated using
> [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)
- [Peer Dependencies](#peer-dependencies)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
import { FC } from 'react';
import type { ReactNode } from 'react';
import type { ResponsiveObject } from '@atlaskit/primitives/responsive';

// @public (undocumented)
type BaseGridProps = {
	testId?: string;
	maxWidth?: 'narrow' | 'wide';
	children: ReactNode;
	hasInlinePadding?: boolean;
};

// @public
const Grid: FC<GridProps>;
export default Grid;

// @public
export const GridContainer: FC<GridContainerProps>;

// @public (undocumented)
type GridContainerProps = BaseGridProps;

// @public
export const GridItem: FC<GridItemProps>;

// @public (undocumented)
export type GridItemProps = {
	testId?: string;
	children: ReactNode;
	start?: StartObject | StartOptions;
	span?: SpanObject | SpanOptions;
};

// @public (undocumented)
export type GridProps = BaseGridProps;

// @public (undocumented)
type SpanObject = ResponsiveObject<SpanOptions>;

// @public (undocumented)
type SpanOptions = 'none' | 1 | 10 | 11 | 12 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// @public (undocumented)
type StartObject = ResponsiveObject<StartOptions>;

// @public (undocumented)
type StartOptions = 'auto' | SpanOptions;

// (No @packageDocumentation comment for this package)
```

<!--SECTION END: Main Entry Types-->

### Peer Dependencies

<!--SECTION START: Peer Dependencies-->

```json
{
	"react": "^16.8.0 || ^17.0.0"
}
```

<!--SECTION END: Peer Dependencies-->
