import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-empty-icon-button-label', rule, {
	valid: [
		`
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={CopyIcon} label="Copy status page link" />
`,
		`
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={ShowMoreIcon} label="more" />
`,
		`
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={EditIcon} label="Edit" />
`,
		`
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={ChevronDownIcon} label="Expand" />
`,
		`
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={DeleteIcon} label="Delete" />
`,
		`
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={ShowMoreIcon} label={formatMessage(messages.moreActions)} />
`,
		`
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={DeleteIcon} label={label} />
`,
		`
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={ShowMoreIcon} label={<FormattedMessage {...messages.moreActions} />} />
`,
		`
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={DeleteIcon} label={\`Delete \${name}\`} />
`,
		`
import LinkIconButton from '@atlaskit/button/icon/link';

<LinkIconButton icon={ShowMoreIcon} href="/x" label="More actions" />
`,
		`
import IconButton from 'some-other-library';

<IconButton icon={EditIcon} label="" />
`,
		`
import { IconButton } from '@atlaskit/button/new';

<IconButton icon={CopyIcon} label="Copy status page link" />
`,
		`
import { IconButton as Btn } from '@atlaskit/button/new';

<Btn icon={CopyIcon} label="Copy status page link" />
`,
	],
	invalid: [
		{
			code: `
import IconButton from '@atlaskit/button/icon/button';

<IconButton appearance="subtle" icon={CrossIcon} label="" onClick={onClose} />
`,
			errors: [{ messageId: 'emptyLabel' }],
		},
		{
			code: `
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={CopyIcon} label={''} />
`,
			errors: [{ messageId: 'emptyLabel' }],
		},
		{
			code: `
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={CopyIcon} label="   " />
`,
			errors: [{ messageId: 'emptyLabel' }],
		},
		{
			code: `
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={ShowMoreIcon} label={\`\`} />
`,
			errors: [{ messageId: 'emptyLabel' }],
		},
		{
			code: `
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={CopyIcon} label={null} />
`,
			errors: [{ messageId: 'emptyLabel' }],
		},
		{
			code: `
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={CopyIcon} label={undefined} />
`,
			errors: [{ messageId: 'emptyLabel' }],
		},
		{
			code: `
import IconButton from '@atlaskit/button/icon/button';

<IconButton icon={CopyIcon} label={false} />
`,
			errors: [{ messageId: 'emptyLabel' }],
		},
		{
			code: `
import { IconButton } from '@atlaskit/button/new';

<IconButton icon={CopyIcon} label="" />
`,
			errors: [{ messageId: 'emptyLabel' }],
		},
		{
			code: `
import { IconButton as Btn } from '@atlaskit/button/new';

<Btn icon={CopyIcon} label="" />
`,
			errors: [{ messageId: 'emptyLabel' }],
		},
	],
});
