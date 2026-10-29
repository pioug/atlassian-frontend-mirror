/* eslint-disable @atlaskit/design-system/no-readonly-or-disabled-inputs -- This visual regression fixture intentionally covers disabled and read-only states. */

import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import TextArea from '@atlaskit/textarea/text-area';

const AtomicStyles: () => React.JSX.Element = () => (
	<Stack space="space.100">
		<div>
			<Label htmlFor="standard-regular-valid">Standard, regular density, valid</Label>
			<TextArea
				id="standard-regular-valid"
				testId="standard-regular-valid"
				appearance="standard"
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="standard-regular-invalid">Standard, regular density, invalid</Label>
			<TextArea
				id="standard-regular-invalid"
				testId="standard-regular-invalid"
				appearance="standard"
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="standard-regular-disabled">Standard, regular density, disabled</Label>
			<TextArea
				id="standard-regular-disabled"
				testId="standard-regular-disabled"
				appearance="standard"
				isDisabled
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="standard-regular-disabled-invalid">
				Standard, regular density, disabled and invalid
			</Label>
			<TextArea
				id="standard-regular-disabled-invalid"
				testId="standard-regular-disabled-invalid"
				appearance="standard"
				isDisabled
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="standard-regular-readonly-invalid">
				Standard, regular density, read-only and invalid
			</Label>
			<TextArea
				id="standard-regular-readonly-invalid"
				testId="standard-regular-readonly-invalid"
				appearance="standard"
				isReadOnly
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="standard-compact-valid">Standard, compact density, valid</Label>
			<TextArea
				id="standard-compact-valid"
				testId="standard-compact-valid"
				appearance="standard"
				isCompact
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="standard-compact-invalid">Standard, compact density, invalid</Label>
			<TextArea
				id="standard-compact-invalid"
				testId="standard-compact-invalid"
				appearance="standard"
				isCompact
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="standard-compact-disabled">Standard, compact density, disabled</Label>
			<TextArea
				id="standard-compact-disabled"
				testId="standard-compact-disabled"
				appearance="standard"
				isCompact
				isDisabled
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="standard-compact-disabled-invalid">
				Standard, compact density, disabled and invalid
			</Label>
			<TextArea
				id="standard-compact-disabled-invalid"
				testId="standard-compact-disabled-invalid"
				appearance="standard"
				isCompact
				isDisabled
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="standard-compact-readonly-invalid">
				Standard, compact density, read-only and invalid
			</Label>
			<TextArea
				id="standard-compact-readonly-invalid"
				testId="standard-compact-readonly-invalid"
				appearance="standard"
				isCompact
				isReadOnly
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="subtle-regular-valid">Subtle, regular density, valid</Label>
			<TextArea
				id="subtle-regular-valid"
				testId="subtle-regular-valid"
				appearance="subtle"
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="subtle-regular-invalid">Subtle, regular density, invalid</Label>
			<TextArea
				id="subtle-regular-invalid"
				testId="subtle-regular-invalid"
				appearance="subtle"
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="subtle-regular-disabled">Subtle, regular density, disabled</Label>
			<TextArea
				id="subtle-regular-disabled"
				testId="subtle-regular-disabled"
				appearance="subtle"
				isDisabled
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="subtle-regular-disabled-invalid">
				Subtle, regular density, disabled and invalid
			</Label>
			<TextArea
				id="subtle-regular-disabled-invalid"
				testId="subtle-regular-disabled-invalid"
				appearance="subtle"
				isDisabled
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="subtle-regular-readonly-invalid">
				Subtle, regular density, read-only and invalid
			</Label>
			<TextArea
				id="subtle-regular-readonly-invalid"
				testId="subtle-regular-readonly-invalid"
				appearance="subtle"
				isReadOnly
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="subtle-compact-valid">Subtle, compact density, valid</Label>
			<TextArea
				id="subtle-compact-valid"
				testId="subtle-compact-valid"
				appearance="subtle"
				isCompact
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="subtle-compact-invalid">Subtle, compact density, invalid</Label>
			<TextArea
				id="subtle-compact-invalid"
				testId="subtle-compact-invalid"
				appearance="subtle"
				isCompact
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="subtle-compact-disabled">Subtle, compact density, disabled</Label>
			<TextArea
				id="subtle-compact-disabled"
				testId="subtle-compact-disabled"
				appearance="subtle"
				isCompact
				isDisabled
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="subtle-compact-disabled-invalid">
				Subtle, compact density, disabled and invalid
			</Label>
			<TextArea
				id="subtle-compact-disabled-invalid"
				testId="subtle-compact-disabled-invalid"
				appearance="subtle"
				isCompact
				isDisabled
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="subtle-compact-readonly-invalid">
				Subtle, compact density, read-only and invalid
			</Label>
			<TextArea
				id="subtle-compact-readonly-invalid"
				testId="subtle-compact-readonly-invalid"
				appearance="subtle"
				isCompact
				isReadOnly
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="none-regular-valid">No appearance, regular density, valid</Label>
			<TextArea
				id="none-regular-valid"
				testId="none-regular-valid"
				appearance="none"
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="none-regular-invalid">No appearance, regular density, invalid</Label>
			<TextArea
				id="none-regular-invalid"
				testId="none-regular-invalid"
				appearance="none"
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="none-regular-disabled">No appearance, regular density, disabled</Label>
			<TextArea
				id="none-regular-disabled"
				testId="none-regular-disabled"
				appearance="none"
				isDisabled
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="none-regular-disabled-invalid">
				No appearance, regular density, disabled and invalid
			</Label>
			<TextArea
				id="none-regular-disabled-invalid"
				testId="none-regular-disabled-invalid"
				appearance="none"
				isDisabled
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="none-regular-readonly-invalid">
				No appearance, regular density, read-only and invalid
			</Label>
			<TextArea
				id="none-regular-readonly-invalid"
				testId="none-regular-readonly-invalid"
				appearance="none"
				isReadOnly
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="none-compact-valid">No appearance, compact density, valid</Label>
			<TextArea
				id="none-compact-valid"
				testId="none-compact-valid"
				appearance="none"
				isCompact
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="none-compact-invalid">No appearance, compact density, invalid</Label>
			<TextArea
				id="none-compact-invalid"
				testId="none-compact-invalid"
				appearance="none"
				isCompact
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="none-compact-disabled">No appearance, compact density, disabled</Label>
			<TextArea
				id="none-compact-disabled"
				testId="none-compact-disabled"
				appearance="none"
				isCompact
				isDisabled
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="none-compact-disabled-invalid">
				No appearance, compact density, disabled and invalid
			</Label>
			<TextArea
				id="none-compact-disabled-invalid"
				testId="none-compact-disabled-invalid"
				appearance="none"
				isCompact
				isDisabled
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
		<div>
			<Label htmlFor="none-compact-readonly-invalid">
				No appearance, compact density, read-only and invalid
			</Label>
			<TextArea
				id="none-compact-readonly-invalid"
				testId="none-compact-readonly-invalid"
				appearance="none"
				isCompact
				isReadOnly
				isInvalid
				resize="none"
				minimumRows={1}
				defaultValue="Text area"
			/>
		</div>
	</Stack>
);

export default AtomicStyles;
