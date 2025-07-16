import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

// this example is not useful for its visual result but instead to record
// typing decisions to the interface of `xcss` that we expect to maintain

const onlyTokenisedStyles = xcss({
	backgroundColor: 'color.background.brand.bold',
	width: 'size.500',
	height: 'size.500',
	padding: 'space.100',
	paddingInlineStart: 'space.100',
	// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
	paddingRight: 'space.100',
	margin: 'space.100',
	marginInlineStart: 'space.100',
	// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
	marginLeft: 'space.negative.200',
	// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
	marginRight: 'space.100',
});

const rawValuesStyles = xcss({
	// properties we enforce tokens
	// @ts-expect-error
	backgroundColor: 'purple',
	// @ts-expect-error
	// eslint-disable-next-line @atlaskit/design-system/use-latest-xcss-syntax
	padding: '8px',
	// @ts-expect-error
	// eslint-disable-next-line @atlaskit/design-system/use-latest-xcss-syntax
	paddingInlineStart: '8px',

	// things that can also be raw values (any string...)
	width: '100px',
	height: '100px',
});

export default function Basic() {
	return <Box testId="box-xcss" xcss={[onlyTokenisedStyles, rawValuesStyles]} />;
}
