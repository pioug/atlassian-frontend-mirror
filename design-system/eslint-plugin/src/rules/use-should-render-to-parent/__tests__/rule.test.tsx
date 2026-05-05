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
		import { DropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';

		<DropdownTrigger shouldRenderToParent>
			Children
		</DropdownTrigger>
		`,
		`
		import { DropdownTrigger as AkDropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';

		<AkDropdownTrigger shouldRenderToParent>
			Children
		</AkDropdownTrigger>
		`,
		`
		import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';

		<PopupTrigger shouldRenderToParent>
			Children
		</PopupTrigger>
		`,
		`
		import { PopupTrigger as AkPopupTrigger } from '@atlassian/entry-points/popup-trigger';

		<AkPopupTrigger shouldRenderToParent>
			Children
		</AkPopupTrigger>
		`,
		`
		import DropdownMenu from '@atlaskit/dropdown-menu';

		<DropdownMenu shouldRenderToParent={true}>
			Children
		</DropdownMenu>
		`,
		`
		import AkDropdownMenu from '@atlaskit/dropdown-menu';

		<AkDropdownMenu shouldRenderToParent={true}>
			Children
		</AkDropdownMenu>
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
		`
		import { DropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';

		<DropdownTrigger shouldRenderToParent={true}>
			Children
		</DropdownTrigger>
		`,
		`
		import { DropdownTrigger as AkDropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';

		<AkDropdownTrigger shouldRenderToParent={true}>
			Children
		</AkDropdownTrigger>
		`,
		`
		import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';

		<PopupTrigger shouldRenderToParent={true}>
			Children
		</PopupTrigger>
		`,
		`
		import { PopupTrigger as AkPopupTrigger } from '@atlassian/entry-points/popup-trigger';

		<AkPopupTrigger shouldRenderToParent={true}>
			Children
		</AkPopupTrigger>
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
		{
			code: `
			import { DropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';
			<DropdownTrigger>
				Children
			</DropdownTrigger>
			`,
			errors: [
				{
					messageId: 'missingShouldRenderToParentProp',
					suggestions: [
						{
							desc: addProp,
							output: `
			import { DropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';
			<DropdownTrigger shouldRenderToParent>
				Children
			</DropdownTrigger>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import { DropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';
			<DropdownTrigger shouldRenderToParent={false}>
				Children
			</DropdownTrigger>
			`,
			errors: [
				{
					messageId: 'falseShouldRenderToParentProp',
					suggestions: [
						{
							desc: setPropToTrue,
							output: `
			import { DropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';
			<DropdownTrigger shouldRenderToParent>
				Children
			</DropdownTrigger>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import { DropdownTrigger as AkDropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';
			<AkDropdownTrigger>
				Children
			</AkDropdownTrigger>
			`,
			errors: [
				{
					suggestions: [
						{
							desc: addProp,
							output: `
			import { DropdownTrigger as AkDropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';
			<AkDropdownTrigger shouldRenderToParent>
				Children
			</AkDropdownTrigger>
			`,
						},
					],
					messageId: 'missingShouldRenderToParentProp',
				},
			],
		},
		{
			code: `
			import { DropdownTrigger as AkDropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';
			<AkDropdownTrigger shouldRenderToParent={false}>
				Children
			</AkDropdownTrigger>
			`,
			errors: [
				{
					messageId: 'falseShouldRenderToParentProp',
					suggestions: [
						{
							desc: setPropToTrue,
							output: `
			import { DropdownTrigger as AkDropdownTrigger } from '@atlassian/entry-points/dropdown-trigger';
			<AkDropdownTrigger shouldRenderToParent>
				Children
			</AkDropdownTrigger>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';
			<PopupTrigger>
				Children
			</PopupTrigger>
			`,
			errors: [
				{
					messageId: 'missingShouldRenderToParentProp',
					suggestions: [
						{
							desc: addProp,
							output: `
			import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';
			<PopupTrigger shouldRenderToParent>
				Children
			</PopupTrigger>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';
			<PopupTrigger shouldRenderToParent={false}>
				Children
			</PopupTrigger>
			`,
			errors: [
				{
					messageId: 'falseShouldRenderToParentProp',
					suggestions: [
						{
							desc: setPropToTrue,
							output: `
			import { PopupTrigger } from '@atlassian/entry-points/popup-trigger';
			<PopupTrigger shouldRenderToParent>
				Children
			</PopupTrigger>
			`,
						},
					],
				},
			],
		},
		{
			code: `
			import { PopupTrigger as AkPopupTrigger } from '@atlassian/entry-points/popup-trigger';
			<AkPopupTrigger>
				Children
			</AkPopupTrigger>
			`,
			errors: [
				{
					suggestions: [
						{
							desc: addProp,
							output: `
			import { PopupTrigger as AkPopupTrigger } from '@atlassian/entry-points/popup-trigger';
			<AkPopupTrigger shouldRenderToParent>
				Children
			</AkPopupTrigger>
			`,
						},
					],
					messageId: 'missingShouldRenderToParentProp',
				},
			],
		},
		{
			code: `
			import { PopupTrigger as AkPopupTrigger } from '@atlassian/entry-points/popup-trigger';
			<AkPopupTrigger shouldRenderToParent={false}>
				Children
			</AkPopupTrigger>
			`,
			errors: [
				{
					messageId: 'falseShouldRenderToParentProp',
					suggestions: [
						{
							desc: setPropToTrue,
							output: `
			import { PopupTrigger as AkPopupTrigger } from '@atlassian/entry-points/popup-trigger';
			<AkPopupTrigger shouldRenderToParent>
				Children
			</AkPopupTrigger>
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
		{
			code: `
			import { type ContentProps, Popup, type PopupProps, type TriggerProps } from '@atlaskit/popup';

			<Popup
				{...popupProps}
				isOpen={isOpen}
				onClose={handleClose}
				trigger={popupTrigger}
				content={popupContent}
			/>
			`,
			errors: [
				{
					messageId: 'missingShouldRenderToParentProp',
					suggestions: [
						{
							desc: addProp,
							output: `
			import { type ContentProps, Popup, type PopupProps, type TriggerProps } from '@atlaskit/popup';

			<Popup shouldRenderToParent
				{...popupProps}
				isOpen={isOpen}
				onClose={handleClose}
				trigger={popupTrigger}
				content={popupContent}
			/>
			`,
						},
					],
				},
			],
		},
	],
});
