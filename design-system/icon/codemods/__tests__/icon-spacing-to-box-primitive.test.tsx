import transformer from '../32.0.2-icon-spacing-to-flex-primitive';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const space050Block = `const iconSpacingStyles = cssMap({
  space050: {
    paddingBlock: token("space.050"),
    paddingInline: token("space.050")
  }
});`;

const space075Block = `const iconSpacingStyles = cssMap({
  space075: {
    paddingBlock: token("space.075"),
    paddingInline: token("space.075")
  }
});`;

const space025Block = `const iconSpacingStyles = cssMap({
  space025: {
    paddingBlock: token("space.025"),
    paddingInline: token("space.025")
  }
});`;

describe('Migrate spacing prop to Flex primitive', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="none" />;`,
		`import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" />;`,
		'should remove spacing="none" with no Flex wrap',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { Flex } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Flex xcss={iconSpacingStyles.space050}><AddIcon label="" /></Flex>;`,
		'should wrap medium icon with spacing="spacious" in Flex with space050',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="compact" />;`,
		`import { cssMap } from "@atlaskit/css";
import { Flex } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Flex xcss={iconSpacingStyles.space050}><AddIcon label="" /></Flex>;`,
		'should wrap medium icon with spacing="compact" in Flex with space050',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
const App = () => <ChevronRightIcon label="" size="small" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { Flex } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

${space075Block}

const App = () => <Flex xcss={iconSpacingStyles.space075}><ChevronRightIcon label="" size="small" /></Flex>;`,
		'should wrap small icon with spacing="spacious" in Flex with space075',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
const App = () => <ChevronRightIcon label="" size="small" spacing="compact" />;`,
		`import { cssMap } from "@atlaskit/css";
import { Flex } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

${space025Block}

const App = () => <Flex xcss={iconSpacingStyles.space025}><ChevronRightIcon label="" size="small" /></Flex>;`,
		'should wrap small icon with spacing="compact" in Flex with space025',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import MoreIcon from '@atlaskit/icon/core/more';
const App = () => <Button iconBefore={<MoreIcon label="" spacing="spacious" />} />;`,
		`import { cssMap } from "@atlaskit/css";
import { Flex } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import MoreIcon from '@atlaskit/icon/core/more';

${space050Block}

const App = () => <Button iconBefore={<Flex xcss={iconSpacingStyles.space050}><MoreIcon label="" /></Flex>} />;`,
		'should wrap icon with spacing prop inside a component slot',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
const App = () => <DropdownMenu iconAfter={<ChevronDownIcon label="" size="small" spacing="spacious" />} />;`,
		`import { cssMap } from "@atlaskit/css";
import { Flex } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

${space075Block}

const App = () => <DropdownMenu iconAfter={<Flex xcss={iconSpacingStyles.space075}><ChevronDownIcon label="" size="small" /></Flex>} />;`,
		'should wrap small icon with spacing prop inside a component slot',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import AddIcon from '@atlaskit/icon/core/add';
const App = (props: any) => <AddIcon {...props} spacing="spacious" label="" />;`,
		`import AddIcon from '@atlaskit/icon/core/add';
const App = (props: any) => // eslint-disable-next-line @atlaskit/design-system/no-icon-spacing-prop -- TODO: Manually migrate spacing prop to Flex primitive (spread props detected)
<AddIcon {...props} spacing="spacious" label="" />;`,
		'should add eslint-disable comment inline and skip when spread props are present',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import AddIcon from '@atlaskit/icon/core/add';
const App = ({ spacing }: any) => <AddIcon label="" spacing={spacing} />;`,
		`import AddIcon from '@atlaskit/icon/core/add';
const App = ({ spacing }: any) => // eslint-disable-next-line @atlaskit/design-system/no-icon-spacing-prop -- TODO: Manually migrate spacing prop to Flex primitive (dynamic spacing value detected)
<AddIcon label="" spacing={spacing} />;`,
		'should add eslint-disable comment inline and skip when spacing is a dynamic expression',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import SomeComponent from 'some-library';
const App = () => <SomeComponent spacing="spacious" />;`,
		`import SomeComponent from 'some-library';
const App = () => <SomeComponent spacing="spacious" />;`,
		'should not transform non-icon components with spacing prop',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import AddIcon from '@atlaskit/icon/core/add';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

const App = () => (
  <>
    <AddIcon label="" spacing="spacious" />
    <ChevronRightIcon label="" size="small" spacing="spacious" />
    <AddIcon label="" spacing="none" />
  </>
);`,
		`import { cssMap } from "@atlaskit/css";
import { Flex } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import AddIcon from '@atlaskit/icon/core/add';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

const iconSpacingStyles = cssMap({
  space050: {
    paddingBlock: token("space.050"),
    paddingInline: token("space.050")
  },

  space075: {
    paddingBlock: token("space.075"),
    paddingInline: token("space.075")
  }
});

const App = () => (
  <>
    <Flex xcss={iconSpacingStyles.space050}><AddIcon label="" /></Flex>
    <Flex xcss={iconSpacingStyles.space075}><ChevronRightIcon label="" size="small" /></Flex>
    <AddIcon label="" />
  </>
);`,
		'should handle multiple icons in the same file with a single cssMap and deduped keys',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import { Inline } from '@atlaskit/primitives/compiled';
import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { token } from "@atlaskit/tokens";
import { Inline, Flex } from '@atlaskit/primitives/compiled';
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Flex xcss={iconSpacingStyles.space050}><AddIcon label="" /></Flex>;`,
		'should add Flex to existing @atlaskit/primitives/compiled import',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import { Flex } from '@atlaskit/primitives';
import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { token } from "@atlaskit/tokens";
import { Flex } from "@atlaskit/primitives/compiled";
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Flex xcss={iconSpacingStyles.space050}><AddIcon label="" /></Flex>;`,
		'should update @atlaskit/primitives to @atlaskit/primitives/compiled',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import { Flex } from '@atlaskit/primitives/compiled';
import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { token } from "@atlaskit/tokens";
import { Flex } from '@atlaskit/primitives/compiled';
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Flex xcss={iconSpacingStyles.space050}><AddIcon label="" /></Flex>;`,
		'should keep existing Flex import from compiled unchanged',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import { Inline } from '@atlaskit/primitives';
import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { token } from "@atlaskit/tokens";
import { Inline, Flex } from "@atlaskit/primitives/compiled";
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Flex xcss={iconSpacingStyles.space050}><AddIcon label="" /></Flex>;`,
		'should add Flex and update @atlaskit/primitives to @atlaskit/primitives/compiled',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import MoreIcon from '@atlaskit/icon/core/more';

const IconBefore = (
  <MoreIcon spacing="spacious" label="More" />
);`,
		`import { cssMap } from "@atlaskit/css";
import { Flex } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import MoreIcon from '@atlaskit/icon/core/more';

${space050Block}

const IconBefore = (
  <Flex xcss={iconSpacingStyles.space050}><MoreIcon label="More" /></Flex>
);`,
		'should not produce extra parentheses inside Flex when icon is in a parenthesized expression',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import BitbucketBranchIcon from '@atlaskit/icon-lab/core/bitbucket-branch';
const App = () => <BitbucketBranchIcon label="" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { Flex } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import BitbucketBranchIcon from '@atlaskit/icon-lab/core/bitbucket-branch';

${space050Block}

const App = () => <Flex xcss={iconSpacingStyles.space050}><BitbucketBranchIcon label="" /></Flex>;`,
		'should migrate icon-lab icons',
	);
});
