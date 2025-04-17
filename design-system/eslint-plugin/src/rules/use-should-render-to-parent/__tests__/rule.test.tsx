import { tester } from '../../__tests__/utils/_tester';
import rule, { addProp, RULE_NAME, setPropToTrue } from '../index';

tester.run(RULE_NAME, rule, {
	valid: [
		`
		import DropdownMenu from '@atlaskit/dropdown-menu';

		<DropdownMenu shouldRenderToParent>
			Children
		</DropdownMenu>
	`,
		`
			import AkDropdownMenu from '@atlaskit/dropdown-menu';

			<AkDropdownMenu shouldRenderToParent>
				Children
			</AkDropdownMenu>
		`,
		`
		import Popup from '@atlaskit/popup';

		<Popup shouldRenderToParent>
			Children
		</Popup>
	`,
		`
			import AkPopup from '@atlaskit/popup';

			<AkPopup shouldRenderToParent>
				Children
			</AkPopup>
		`,
		`
			import { Popup } from '@atlaskit/popup';

			<Popup shouldRenderToParent>
				Children
			</Popup>
		`,
		`
			import { Popup as AkPopup } from '@atlaskit/popup';

			<AkPopup shouldRenderToParent>
				Children
			</AkPopup>
		`,
		`
		import Popup from '@atlaskit/popup';

		<Popup shouldRenderToParent={true}>
			Children
		</Popup>
	`,
		`
			import AkPopup from '@atlaskit/popup';

			<AkPopup shouldRenderToParent={true}>
				Children
			</AkPopup>
		`,
		`
			import { Popup } from '@atlaskit/popup';

			<Popup shouldRenderToParent={true}>
				Children
			</Popup>
		`,
		`
			import { Popup as AkPopup } from '@atlaskit/popup';

			<AkPopup shouldRenderToParent={true}>
				Children
			</AkPopup>
		`,
	],
	invalid: [
		{
			code: `
			import DropdownMenu from '@atlaskit/dropdown-menu';
			<DropdownMenu>
				Children
			</DropdownMenu>
			`,
			errors: [
				{
					messageId: 'missingShouldRenderToParentProp',
					suggestions: [
						{
							desc: addProp,
							output: `
			import DropdownMenu from '@atlaskit/dropdown-menu';
			<DropdownMenu shouldRenderToParent>
				Children
			</DropdownMenu>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import DropdownMenu from '@atlaskit/dropdown-menu';
			<DropdownMenu shouldRenderToParent={false}>
				Children
			</DropdownMenu>
			`,
			errors: [
				{
					messageId: 'falseShouldRenderToParentProp',
					suggestions: [
						{
							desc: setPropToTrue,
							output: `
			import DropdownMenu from '@atlaskit/dropdown-menu';
			<DropdownMenu shouldRenderToParent>
				Children
			</DropdownMenu>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import Popup from '@atlaskit/popup';
			<Popup>
				Children
			</Popup>
			`,
			errors: [
				{
					messageId: 'missingShouldRenderToParentProp',
					suggestions: [
						{
							desc: addProp,
							output: `
			import Popup from '@atlaskit/popup';
			<Popup shouldRenderToParent>
				Children
			</Popup>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import Popup from '@atlaskit/popup';
			<Popup shouldRenderToParent={false}>
				Children
			</Popup>
			`,
			errors: [
				{
					messageId: 'falseShouldRenderToParentProp',
					suggestions: [
						{
							desc: setPropToTrue,
							output: `
			import Popup from '@atlaskit/popup';
			<Popup shouldRenderToParent>
				Children
			</Popup>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import AkPopup from '@atlaskit/popup';
			<AkPopup>
				Children
			</AkPopup>
			`,
			errors: [
				{
					messageId: 'missingShouldRenderToParentProp',
					suggestions: [
						{
							desc: addProp,
							output: `
			import AkPopup from '@atlaskit/popup';
			<AkPopup shouldRenderToParent>
				Children
			</AkPopup>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import AkPopup from '@atlaskit/popup';
			<AkPopup shouldRenderToParent={false}>
				Children
			</AkPopup>
			`,
			errors: [
				{
					messageId: 'falseShouldRenderToParentProp',
					suggestions: [
						{
							desc: setPropToTrue,
							output: `
			import AkPopup from '@atlaskit/popup';
			<AkPopup shouldRenderToParent>
				Children
			</AkPopup>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import { Popup } from '@atlaskit/popup';
			<Popup>
				Children
			</Popup>
			`,
			errors: [
				{
					messageId: 'missingShouldRenderToParentProp',
					suggestions: [
						{
							desc: addProp,
							output: `
			import { Popup } from '@atlaskit/popup';
			<Popup shouldRenderToParent>
				Children
			</Popup>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import { Popup } from '@atlaskit/popup';
			<Popup shouldRenderToParent={false}>
				Children
			</Popup>
			`,
			errors: [
				{
					messageId: 'falseShouldRenderToParentProp',
					suggestions: [
						{
							desc: setPropToTrue,
							output: `
			import { Popup } from '@atlaskit/popup';
			<Popup shouldRenderToParent>
				Children
			</Popup>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import { Popup as AkPopup } from '@atlaskit/popup';
			<AkPopup>
				Children
			</AkPopup>
			`,
			errors: [
				{
					suggestions: [
						{
							desc: addProp,
							output: `
			import { Popup as AkPopup } from '@atlaskit/popup';
			<AkPopup shouldRenderToParent>
				Children
			</AkPopup>
			`,
						},
					],
					messageId: 'missingShouldRenderToParentProp',
				},
			],
		},
		{
			code: `
			import { Popup as AkPopup } from '@atlaskit/popup';
			<AkPopup shouldRenderToParent={false}>
				Children
			</AkPopup>
			`,
			errors: [
				{
					messageId: 'falseShouldRenderToParentProp',
					suggestions: [
						{
							desc: setPropToTrue,
							output: `
			import { Popup as AkPopup } from '@atlaskit/popup';
			<AkPopup shouldRenderToParent>
				Children
			</AkPopup>
			`,
						},
					],
				},
			],
		},
		// This shouldn't be possible, but testing anyway
		{
			code: `
			import Popup from '@atlaskit/popup';
			<Popup shouldRenderToParent={null}>
				Children
			</Popup>
			`,
			errors: [
				{
					messageId: 'falseShouldRenderToParentProp',
					suggestions: [
						{
							desc: setPropToTrue,
							output: `
			import Popup from '@atlaskit/popup';
			<Popup shouldRenderToParent>
				Children
			</Popup>
			`,
						},
					],
				},
			],
		},
	],
});
