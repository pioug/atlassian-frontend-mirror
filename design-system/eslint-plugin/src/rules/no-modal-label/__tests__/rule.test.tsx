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
		`
import { ModalTrigger } from '@atlassian/entry-points/modal-trigger';

<ModalTrigger entryPoint={entryPoint} modalProps={{ testId: 'modal' }}>
	{({ ref }) => <button ref={ref}>Open</button>}
</ModalTrigger>
`,
		`
import { ModalButtonTrigger } from '@atlassian/entry-points/modal-button-trigger';

<ModalButtonTrigger entryPoint={entryPoint}>Open</ModalButtonTrigger>
`,
		`
import { ModalIconButtonTrigger } from '@atlassian/entry-points/modal-icon-button-trigger';

<ModalIconButtonTrigger entryPoint={entryPoint} label="Open modal" icon={AddIcon} />
`,
		`
import { ModalDropdownItemTrigger } from '@atlassian/entry-points/modal-dropdown-item-trigger';

<ModalDropdownItemTrigger entryPoint={entryPoint}>Open</ModalDropdownItemTrigger>
`,
		`
import { FullScreenModalTrigger } from '@atlassian/entry-points/full-screen-modal-trigger';

<FullScreenModalTrigger entryPoint={entryPoint} modalProps={{ testId: 'modal' }}>
	{({ ref }) => <button ref={ref}>Open</button>}
</FullScreenModalTrigger>
`,
		`
import { ModalTrigger } from 'foo';

<ModalTrigger modalProps={{ label: 'Allowed label prop' }}>
	{({ ref }) => <button ref={ref}>Open</button>}
</ModalTrigger>
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
		{
			code: `
import { ModalTrigger } from '@atlassian/entry-points/modal-trigger';

<ModalTrigger entryPoint={entryPoint} modalProps={{ label: 'Dialog label' }}>
	{({ ref }) => <button ref={ref}>Open</button>}
</ModalTrigger>
`,
			errors: [{ messageId: 'noModalLabel' }],
		},
		{
			code: `
import { ModalButtonTrigger as AkModalButtonTrigger } from '@atlassian/entry-points/modal-button-trigger';

<AkModalButtonTrigger entryPoint={entryPoint} modalProps={{ label: modalLabel }}>
	Open
</AkModalButtonTrigger>
`,
			errors: [{ messageId: 'noModalLabel' }],
		},
		{
			code: `
import { ModalDropdownItemTrigger } from '@atlassian/entry-points/modal-dropdown-item-trigger';

<ModalDropdownItemTrigger entryPoint={entryPoint} modalProps={{ label: 'Dialog label' }}>
	Open
</ModalDropdownItemTrigger>
`,
			errors: [{ messageId: 'noModalLabel' }],
		},
		{
			code: `
import { ModalIconButtonTrigger } from '@atlassian/entry-points/modal-icon-button-trigger';

<ModalIconButtonTrigger
	entryPoint={entryPoint}
	label="Open modal"
	icon={AddIcon}
	modalProps={{ label: 'Dialog label' }}
/>
`,
			errors: [{ messageId: 'noModalLabel' }],
		},
		{
			code: `
import { FullScreenModalTrigger } from '@atlassian/entry-points/full-screen-modal-trigger';

<FullScreenModalTrigger entryPoint={entryPoint} modalProps={{ 'label': 'Dialog label' }}>
	{({ ref }) => <button ref={ref}>Open</button>}
</FullScreenModalTrigger>
`,
			errors: [{ messageId: 'noModalLabel' }],
		},
		{
			code: `
import { ModalTrigger } from '@atlassian/entry-points/modal-trigger';

<ModalTrigger entryPoint={entryPoint} modalProps={{ testId: 'modal', label: undefined }}>
	{({ ref }) => <button ref={ref}>Open</button>}
</ModalTrigger>
`,
			errors: [{ messageId: 'noModalLabel' }],
		},
	],
});
