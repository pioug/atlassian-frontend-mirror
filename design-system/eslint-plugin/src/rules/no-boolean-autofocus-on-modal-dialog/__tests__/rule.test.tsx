import { tester } from '../../__tests__/utils/_tester';
import rule, { ruleName } from '../index';

tester.run(ruleName, rule, {
	valid: [
		// Ignore code that is not ours
		`
import Foo from 'bar';

<Foo />
		`,
		`
import ModalDialog, { CloseButton, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<Box>AbbaZabba</Box>
</ModalDialog>
`,
		`
import AkModalDialog, { ModalHeader as AkModalHeader, ModalTitle as AkModalTitle } from '@atlaskit/modal-dialog';

<AkModalDialog>
	<Box>AbbaZabba</Box>
</AkModalDialog>
`,
		`
import ModalDialog, { CloseButton, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

const ref = useRef(null);

<ModalDialog autoFocus={ref}>
	<Box ref={ref}>AbbaZabba</Box>
</ModalDialog>
`,
		`
import AkModalDialog, { ModalHeader as AkModalHeader, ModalTitle as AkModalTitle } from '@atlaskit/modal-dialog';

const ref = useRef(null);

<AkModalDialog autoFocus={ref}>
	<Box ref={ref}>AbbaZabba</Box>
</AkModalDialog>
`,
	],
	invalid: [
		{
			code: `
import ModalDialog, { CloseButton, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog autoFocus={true}>
	<Box>AbbaZabba</Box>
</ModalDialog>
`,
			errors: [
				{
					messageId: 'noBooleanForAutoFocus',
				},
			],
		},
		{
			code: `
import ModalDialog, { CloseButton, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog autoFocus={false}>
	<Box>AbbaZabba</Box>
</ModalDialog>
`,
			errors: [
				{
					messageId: 'noBooleanForAutoFocus',
				},
			],
		},
		{
			code: `
import AkModalDialog, { CloseButton, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<AkModalDialog autoFocus={false}>
	<Box>AbbaZabba</Box>
</AkModalDialog>
`,
			errors: [
				{
					messageId: 'noBooleanForAutoFocus',
				},
			],
		},
	],
});
