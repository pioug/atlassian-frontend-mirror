<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/lozenge"

> Do not edit this file. This report is auto-generated using
> [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)
- [Peer Dependencies](#peer-dependencies)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
import { CSSProperties } from 'react';
import { default as React_2 } from 'react';
import { ReactNode } from 'react';

// @public
const Lozenge: React_2.MemoExoticComponent<
	({ children, testId, isBold, appearance, maxWidth, style }: LozengeProps) => JSX.Element
>;
export default Lozenge;

// @public (undocumented)
interface LozengeProps {
	appearance?: ThemeAppearance;
	children?: ReactNode;
	isBold?: boolean;
	maxWidth?: number | string;
	style?: Pick<CSSProperties, 'backgroundColor' | 'color'>;
	testId?: string;
}

// @public (undocumented)
export type ThemeAppearance = 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success';

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
