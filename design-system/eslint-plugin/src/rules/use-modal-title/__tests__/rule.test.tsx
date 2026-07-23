import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('use-modal-title', rule, {
	valid: [
		`
import Foo from 'bar';
import { ModalHeader } from '@atlaskit/modal-dialog';

<Foo>
	<div />
</Foo>
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
import ModalDialog, { ModalHeader as AkModalHeader, ModalTitle as AkModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<AkModalHeader>
		<div>
			<AkModalTitle>Modal title</AkModalTitle>
		</div>
	</AkModalHeader>
</ModalDialog>
`,
		`
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';

<ModalDialog>
	<ModalHeader>
		{() => <ModalTitle>Modal title</ModalTitle>}
	</ModalHeader>
</ModalDialog>
`,
		`
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';

<ModalDialog>
	<ModalHeader>
		{isTitleVisible && <ModalTitle>Modal title</ModalTitle>}
	</ModalHeader>
</ModalDialog>
`,
		`
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';

<ModalDialog>
	<ModalHeader>
		<ModalTitle>Modal title</ModalTitle>
	</ModalHeader>
</ModalDialog>
`,
	],
	invalid: [
		{
			code: `
import Foo from 'bar';
import { ModalHeader } from '@atlaskit/modal-dialog';

<Foo>
	<ModalHeader />
</Foo>
`,
			errors: [{ messageId: 'modalHeaderMissingModalTitle' }],
		},
		{
			code: `
import ModalDialog, { ModalHeader } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader />
</ModalDialog>
`,
			errors: [{ messageId: 'modalHeaderMissingModalTitle' }],
		},
		{
			code: `
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader>
		<div>Header body</div>
	</ModalHeader>
</ModalDialog>
`,
			errors: [{ messageId: 'modalHeaderMissingModalTitle' }],
		},
		{
			code: `
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader>
		{showActions && <span>Actions</span>}
	</ModalHeader>
</ModalDialog>
`,
			errors: [{ messageId: 'modalHeaderMissingModalTitle' }],
		},
		{
			code: `
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import AkModalHeader from '@atlaskit/modal-dialog/modal-header';

<ModalDialog>
	<AkModalHeader>
		<div>Header body</div>
	</AkModalHeader>
</ModalDialog>
`,
			errors: [{ messageId: 'modalHeaderMissingModalTitle' }],
		},
		{
			code: `
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import AkModalTitle from '@atlaskit/modal-dialog/modal-title';
import AkModalHeader from '@atlaskit/modal-dialog/modal-header';

<ModalDialog>
	<AkModalHeader>
		<div>Header body</div>
	</AkModalHeader>
</ModalDialog>
`,
			errors: [{ messageId: 'modalHeaderMissingModalTitle' }],
		},
	],
});
