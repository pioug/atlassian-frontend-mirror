import { tester } from '../../__tests__/utils/_tester';
import rule, { addHasCloseButtonProp, ruleName, setHasCloseButtonPropToTrue } from '../index';

tester.run(ruleName, rule, {
	valid: [
		// Ignore code that is not ours
		`
import Foo from 'bar';

<Foo />
		`,
		`
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader hasCloseButton>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>
		`,
		`
import ModalDialog, { CloseButton, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader>
		<Box>
			<ModalTitle>Modal Title</ModalTitle>
			<CloseButton onClick={onClose} />
		</Box>
	</ModalHeader>
</ModalDialog>
`,
		`
import AkModalDialog, { ModalHeader as AkModalHeader, ModalTitle as AkModalTitle } from '@atlaskit/modal-dialog';

<AkModalDialog>
	<AkModalHeader hasCloseButton>
		<AkModalTitle>AkModal Title</AkModalTitle>
	</AkModalHeader>
</AkModalDialog>
`,
		`
import AkModalDialog, { CloseButton as AkCloseButton, ModalHeader as AkModalHeader, ModalTitle as AkModalTitle } from '@atlaskit/modal-dialog';

<AkModalDialog>
	<AkModalHeader>
		<Box>
			<AkModalTitle>AkModal Title</AkModalTitle>
			<AkCloseButton onClick={onClose} />
		</Box>
	</AkModalHeader>
</AkModalDialog>
`,
	],
	invalid: [
		{
			code: `
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>
`,
			errors: [
				{
					messageId: 'modalHeaderMissingHasCloseButtonProp',
					suggestions: [
						{
							desc: addHasCloseButtonProp,
							output: `
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader hasCloseButton>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>
`,
						},
					],
				},
			],
		},
		{
			code: `
import AkModalDialog, { ModalHeader as AkModalHeader, ModalTitle as AkModalTitle } from '@atlaskit/modal-dialog';

<AkModalDialog>
	<AkModalHeader>
		<AkModalTitle>AkModal Title</AkModalTitle>
	</AkModalHeader>
</AkModalDialog>
`,
			errors: [
				{
					messageId: 'modalHeaderMissingHasCloseButtonProp',
					suggestions: [
						{
							desc: addHasCloseButtonProp,
							output: `
import AkModalDialog, { ModalHeader as AkModalHeader, ModalTitle as AkModalTitle } from '@atlaskit/modal-dialog';

<AkModalDialog>
	<AkModalHeader hasCloseButton>
		<AkModalTitle>AkModal Title</AkModalTitle>
	</AkModalHeader>
</AkModalDialog>
`,
						},
					],
				},
			],
		},
		{
			code: `
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader hasCloseButton={false}>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>
`,
			errors: [
				{
					messageId: 'modalHeaderHasCloseButtonPropIsFalse',
					suggestions: [
						{
							desc: setHasCloseButtonPropToTrue,
							output: `
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader hasCloseButton>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>
`,
						},
					],
				},
			],
		},
		{
			code: `
import ModalDialog, { ModalTitle } from '@atlaskit/modal-dialog';
import CustomModalHeader from 'custom-modal-header';

<ModalDialog>
	<CustomModalHeader>
		<ModalTitle>Modal Title</ModalTitle>
	</CustomModalHeader>
</ModalDialog>
`,
			errors: [
				{
					messageId: 'noCloseButtonExists',
				},
			],
		},
	],
});
