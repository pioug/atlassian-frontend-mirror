import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-modal-label', rule, {
	valid: [
		`
import ModalDialog from '@atlaskit/modal-dialog';

<ModalDialog testId="modal" />
`,
		`
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';

<ModalDialog shouldScrollInViewport />
`,
		`
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader>
		<ModalTitle>Modal title</ModalTitle>
	</ModalHeader>
</ModalDialog>
`,
		`
import ModalDialog from 'foo';

<ModalDialog label="Allowed label prop" />
`,
	],
	invalid: [
		{
			code: `
import ModalDialog from '@atlaskit/modal-dialog';

<ModalDialog label="Dialog label" />
`,
			errors: [{ messageId: 'noModalLabel' }],
		},
		{
			code: `
import Modal from '@atlaskit/modal-dialog/modal-dialog';

<Modal label={modalLabel} />
`,
			errors: [{ messageId: 'noModalLabel' }],
		},
		{
			code: `
import ModalDialog from '@atlaskit/modal-dialog';

<ModalDialog label={undefined} />
`,
			errors: [{ messageId: 'noModalLabel' }],
		},
		{
			code: `
import ModalDialog from '@atlaskit/modal-dialog';

<ModalDialog label={""} />
`,
			errors: [{ messageId: 'noModalLabel' }],
		},
		{
			code: `
import ModalDialog from '@atlaskit/modal-dialog';

<ModalDialog label="" />
`,
			errors: [{ messageId: 'noModalLabel' }],
		},
	],
});
