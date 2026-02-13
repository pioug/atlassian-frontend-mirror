import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';

const errorSubpath =
	'Side nav items have moved to @atlaskit/side-nav-items. Use the same subpath (e.g. @atlaskit/side-nav-items/button-menu-item instead of @atlaskit/navigation-system/side-nav-items/button-menu-item).';

const errorBarrel =
	'The following imports have moved to @atlaskit/side-nav-items: ButtonMenuItem, MenuList. Import them from @atlaskit/side-nav-items.';

const valid: string[] = [
	outdent`
    import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
  `,
	outdent`
    import { SideNav } from '@atlaskit/navigation-system/layout/side-nav';
  `,
	outdent`
    import { MenuList } from '@atlaskit/side-nav-items/menu-list';
  `,
	outdent`
    import { Main, Root, useIsFhsEnabled } from '@atlaskit/navigation-system';
  `,
];

const invalid = [
	{
		code: outdent`
      import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
    `,
		errors: [errorSubpath],
	},
	{
		code: outdent`
      import { MenuList, MenuListItem } from '@atlaskit/navigation-system/side-nav-items/menu-list';
    `,
		errors: [errorSubpath],
	},
	{
		code: outdent`
      import { Divider } from '@atlaskit/navigation-system/side-nav-items/menu-section';
    `,
		errors: [errorSubpath],
	},
	{
		code: outdent`
      import { ButtonMenuItem, MenuList } from '@atlaskit/navigation-system';
    `,
		errors: [errorBarrel],
	},
	{
		code: outdent`
      import { Main, MenuList } from '@atlaskit/navigation-system';
    `,
		errors: [
			'The following imports have moved to @atlaskit/side-nav-items: MenuList. Import them from @atlaskit/side-nav-items.',
		],
	},
];

export const tests: Tests = {
	valid,
	invalid,
};
