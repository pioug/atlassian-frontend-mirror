import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-legacy-icons', rule, {
	valid: [
		`
		  import AddIcon from '@atlaskit/icon/core/add';
		  <AddIcon label=""/>
		`,
		`
		  import AddIcon from '@atlaskit/icon/core/add';
		  ()=> {
		    <AddIcon label=""/>
		  }
		`,
		`
		  import AddIcon from '@atlaskit/icon/core/add';
		  import AddIconOld from '@atlaskit/icon/glyph/add';
		  <AddIcon label="" LEGACY_fallback={AddIconOld}/>
		`,
		`
		  import AddIcon from '@atlaskit/icon/glyph/add';
		  import AddIconNew from '@atlaskit/icon/core/add';
		  import Branch16Icon from '@atlaskit/icon-object/glyph/branch/16';
		  <AddIconNew label="" />
		`,
		`
		  import AddIconLegacy from '@atlaskit/icon/glyph/add';
		  import AddIcon from '@atlaskit/icon/core/add';
		  import Button from '@atlaskit/button/new';
		  <Button icon={<AddIcon LEGACY_fallbackIcon={AddIconLegacy} label="" />}> Add </Button>
		`,
		`
		  import AddIconLegacy from '@atlaskit/icon/glyph/add';
		  import AddIcon from '@atlaskit/icon/core/add';
		  import { IconButton } from '@atlaskit/button/new';
		  <IconButton icon={<AddIcon LEGACY_fallbackIcon={AddIconLegacy} label="" />}> Add </IconButton>
		`,
		`
		  import AddIconLegacy from '@atlaskit/icon/glyph/add';
		  import AddIcon from '@atlaskit/icon/core/add';
		  import { IconButton as IButton } from '@atlaskit/button/new';
		  <IButton label="" icon={ (iconProps) => <AddIcon LEGACY_fallbackIcon={AddIconLegacy} {...iconProps}/>}> Add </IButton>
		`,
		`
		  import AddIcon from '@atlaskit/icon/core/add';
		  import { IconButton as IButton } from '@atlaskit/button/new';
		  <IButton icon={<AddIcon />} label=""> Add </IButton>
		`,
		`
		  import AddIcon from '@atlaskit/icon/core/add';
		  import { IconButton as IButton } from '@atlaskit/button/new';
		  <IButton icon={AddIcon} label=""> Add </IButton>
		`,
		`
		  import AddIcon from '@atlaskit/icon/core/add';
		  const DefaultIcon = AddIcon;
		  <DefaultIcon label="" />
		`,
		`
		  import AddIcon from '@atlaskit/icon/core/add';
		  import { IconButton as IButton } from '@atlaskit/button/new';
		  const DefaultButton = IButton;
		  const DefaultIcon = AddIcon;
		  <DefaultButton icon={DefaultIcon} label=""> Add </DefaultButton>
		`,
		`
		  import AddIcon from '@atlaskit/icon/core/add';
		  import { IconButton as IButton } from '@atlaskit/button/new';
		  const DefaultIcon = AddIcon;
		  const DefaultButton = <IButton icon={DefaultIcon} label=""> Add </IButton>;
		  <DefaultButton />
		`,
		`
		  import AddIcon from '@atlaskit/icon/core/add';
		  import { IconButton as IButton } from '@atlaskit/button/new';
		  const DefaultIcon = AddIcon;
		  const DefaultButton = (icon) => <IButton icon={icon} label=""> Add </IButton>;
		  <div>{DefaultButton(icon)}</div>
		`,
		`
		  import AddIcon from '@atlaskit/icon/core/add';
		  import CustomComponent from '../src';
		  <CustomComponent icon={AddIcon} label=""> Add </CustomComponent>
		`,
	],
	invalid: [
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';

		  <AddIcon label="" />
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import Branch16Icon from '@atlaskit/icon-object/glyph/branch/16';

		  <Branch16Icon label="" />
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';

		  const DefaultIcon = AddIcon;

		  <DefaultIcon label="" />
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';
		  import { IconButton } from '@atlaskit/button/new';

		  <IconButton icon={AddIcon} />
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIconLegacy from '@atlaskit/icon/glyph/add';
		  import { IconButton as IButton } from '@atlaskit/button/new';

		  <IButton icon={<AddIconLegacy />}> Add </IButton>
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIconLegacy from '@atlaskit/icon/glyph/add';
		  import { IconButton as IButton } from '@atlaskit/button/new';

		  <IButton icon={<AddIconLegacy />} label=""> Add </IButton>
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';

		  const DefaultIcon = <AddIcon label="" />;

		  <DefaultIcon />
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';
		  import { IconButton as IButton } from '@atlaskit/button/new';

		  const DefaultButton = IButton;
		  const DefaultIcon = AddIcon;

		  <DefaultButton icon={DefaultIcon} label=""> Add </DefaultButton>
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';
		  import { IconButton as IButton } from '@atlaskit/button/new';

		  const DefaultIcon = AddIcon;
		  const DefaultButton = <IButton icon={DefaultIcon} label=""> Add </IButton>;

		  <DefaultButton />
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';
		  import CustomComponent from '@atlaskit/custom';

		  <CustomComponent myIcon={<AddIcon/>}/>
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';
		  import CustomComponent from '@atlaskit/custom';

		  <CustomComponent myIcon={AddIcon}/>
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';

		  export const NewIcon = AddIcon;
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  export { default as AddIcon } from '@atlaskit/icon/glyph/add';
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';
		  const A = AddIcon;
		  export default A;
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';
      import CustomComponent from '@atlaskit/custom';

      const DefaultIcon = (icon) => <CustomComponent icon={icon} >something...</CustomComponent>;

      <div>{DefaultIcon(AddIcon)}</div>
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
		{
			code: `
		  import AddIcon from '@atlaskit/icon/glyph/add';
		  import CustomComponent from '../src';

		  <CustomComponent icon={AddIcon} label=""> Add </CustomComponent>
		  `,
			errors: [
				{
					messageId: 'noLegacyIcons',
				},
			],
		},
	],
});
