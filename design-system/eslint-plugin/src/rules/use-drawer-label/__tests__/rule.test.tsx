import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('ensure-design-token-usage', rule, {
	valid: [
		`
    import Drawer from '@atlaskit/drawer';
    import type { Something } from '@atlaskit/drawer';

    <Drawer label="Drawer accessible name">
      Children
    </Drawer>
  `,
		`
    import Drawer from '@atlaskit/drawer';
    <Drawer titleId="drawer-title">
      <h1 id="drawer-title">Drawer title content</h1>
      Children
    </Drawer>
  `,
		`
  import AkDrawer from '@atlaskit/drawer';
  <AkDrawer label="Drawer accessible name">
    Children
  </AkDrawer>
`,
		`
  import AwesomeDrawer from '@atlaskit/drawer';
  <AwesomeDrawer titleId="drawer-title">
    <h1 id="drawer-title">Drawer title content</h1>
    Children
  </AwesomeDrawer>
`,
		`
  import AwesomeDrawer from '@atlaskit/drawer';
  import Drawer from '@atlaskit/button';
  <Drawer>
    Drawer
  </Drawer>
`,
	],
	invalid: [
		{
			code: `
        import Drawer from '@atlaskit/drawer';
        <Drawer>
          Children
        </Drawer>
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import Drawer from '@atlaskit/drawer';
        <Drawer label="">
          Children
        </Drawer>
      `,
			errors: [
				{
					messageId: 'labelPropShouldHaveContents',
				},
			],
		},
		{
			code: `
        import Drawer from '@atlaskit/drawer';
        <Drawer titleId="">
          Children
        </Drawer>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
        import AkDrawer from '@atlaskit/drawer';
        <AkDrawer>
          Children
        </AkDrawer>
      `,
			errors: [
				{
					messageId: 'missingLabelProp',
				},
			],
		},
		{
			code: `
        import AkDrawer from '@atlaskit/drawer';
        <AkDrawer label="">
          Children
        </AkDrawer>
      `,
			errors: [
				{
					messageId: 'labelPropShouldHaveContents',
				},
			],
		},
		{
			code: `
        import AkDrawer from '@atlaskit/drawer';
        <AkDrawer titleId="">
          Children
        </AkDrawer>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
        import AkDrawer from '@atlaskit/drawer';
        <AkDrawer titleId="drawer-title" label="Drawer title content">
          <h1 id="drawer-title">Drawer title content</h1>
        </AkDrawer>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
	],
});
