import transformer from '../22.14.0-new-icon-migrate-color-prop';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Migrate color API', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
        import AddIcon from '@atlaskit/icon/core/add';
        import ChevronDownIcon from '@atlaskit/icon/utility/add';
        import BitbucketBranchIcon from '@atlaskit/icon-lab/core/bitbucket-branch';

        const App = () => (
          <>
            <AddIcon label=""/>
            <ChevronDownIcon label=""/>
            <BitbucketBranchIcon label=""/>
            <Button iconAfter={AddIcon}/>
          </>
        );
      `,
		`
        import { token } from "@atlaskit/tokens";
        import AddIcon from '@atlaskit/icon/core/add';
        import ChevronDownIcon from '@atlaskit/icon/utility/add';
        import BitbucketBranchIcon from '@atlaskit/icon-lab/core/bitbucket-branch';

        const App = () => (
          <>
            <AddIcon label="" color={token("color.icon", "#44546F")} />
            <ChevronDownIcon label="" color={token("color.icon", "#44546F")} />
            <BitbucketBranchIcon label="" color={token("color.icon", "#44546F")} />
            <Button iconAfter={AddIcon}/>
          </>
        );
    `,
		'should add color prop to icons',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
  	  import AddIcon from '@atlaskit/icon/core/add';

      const App = (props: any) => (
        <>
          <AddIcon {...props} label=""/>
        </>
      );
    `,
		`
      /* TODO: (@codeshift) Migrate color prop */
      import AddIcon from '@atlaskit/icon/core/add';

      const App = (props: any) => (
        <>
          <AddIcon {...props} label=""/>
        </>
      );
    `,
		'should handle spread props',
	);
});
