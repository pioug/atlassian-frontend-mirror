import transformer from '../icon-spacing-to-box-primitive';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const space050Block = `const iconSpacingStyles = cssMap({
  space050: {
    paddingTop: token("space.050"),
    paddingRight: token("space.050"),
    paddingBottom: token("space.050"),
    paddingLeft: token("space.050")
  }
});`;

const space075Block = `const iconSpacingStyles = cssMap({
  space075: {
    paddingTop: token("space.075"),
    paddingRight: token("space.075"),
    paddingBottom: token("space.075"),
    paddingLeft: token("space.075")
  }
});`;

const space025Block = `const iconSpacingStyles = cssMap({
  space025: {
    paddingTop: token("space.025"),
    paddingRight: token("space.025"),
    paddingBottom: token("space.025"),
    paddingLeft: token("space.025")
  }
});`;

describe('Migrate spacing prop to Box primitive', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="none" />;`,
		`import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" />;`,
		'should remove spacing="none" with no Box wrap',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Box xcss={iconSpacingStyles.space050}><AddIcon label="" /></Box>;`,
		'should wrap medium icon with spacing="spacious" in Box with space050',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="compact" />;`,
		`import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Box xcss={iconSpacingStyles.space050}><AddIcon label="" /></Box>;`,
		'should wrap medium icon with spacing="compact" in Box with space050',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
const App = () => <ChevronRightIcon label="" size="small" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

${space075Block}

const App = () => <Box xcss={iconSpacingStyles.space075}><ChevronRightIcon label="" size="small" /></Box>;`,
		'should wrap small icon with spacing="spacious" in Box with space075',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
const App = () => <ChevronRightIcon label="" size="small" spacing="compact" />;`,
		`import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

${space025Block}

const App = () => <Box xcss={iconSpacingStyles.space025}><ChevronRightIcon label="" size="small" /></Box>;`,
		'should wrap small icon with spacing="compact" in Box with space025',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import MoreIcon from '@atlaskit/icon/core/more';
const App = () => <Button iconBefore={<MoreIcon label="" spacing="spacious" />} />;`,
		`import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import MoreIcon from '@atlaskit/icon/core/more';

${space050Block}

const App = () => <Button iconBefore={<Box xcss={iconSpacingStyles.space050}><MoreIcon label="" /></Box>} />;`,
		'should wrap icon with spacing prop inside a component slot',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
const App = () => <DropdownMenu iconAfter={<ChevronDownIcon label="" size="small" spacing="spacious" />} />;`,
		`import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

${space075Block}

const App = () => <DropdownMenu iconAfter={<Box xcss={iconSpacingStyles.space075}><ChevronDownIcon label="" size="small" /></Box>} />;`,
		'should wrap small icon with spacing prop inside a component slot',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import AddIcon from '@atlaskit/icon/core/add';
const App = (props: any) => <AddIcon {...props} spacing="spacious" label="" />;`,
		`import AddIcon from '@atlaskit/icon/core/add';
const App = (props: any) => // eslint-disable-next-line @atlaskit/design-system/no-icon-spacing-prop -- TODO: Manually migrate spacing prop to Box primitive (spread props detected)
<AddIcon {...props} spacing="spacious" label="" />;`,
		'should add eslint-disable comment inline and skip when spread props are present',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import AddIcon from '@atlaskit/icon/core/add';
const App = ({ spacing }: any) => <AddIcon label="" spacing={spacing} />;`,
		`import AddIcon from '@atlaskit/icon/core/add';
const App = ({ spacing }: any) => // eslint-disable-next-line @atlaskit/design-system/no-icon-spacing-prop -- TODO: Manually migrate spacing prop to Box primitive (dynamic spacing value detected)
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
import { Box } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import AddIcon from '@atlaskit/icon/core/add';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

const iconSpacingStyles = cssMap({
  space050: {
    paddingTop: token("space.050"),
    paddingRight: token("space.050"),
    paddingBottom: token("space.050"),
    paddingLeft: token("space.050")
  },

  space075: {
    paddingTop: token("space.075"),
    paddingRight: token("space.075"),
    paddingBottom: token("space.075"),
    paddingLeft: token("space.075")
  }
});

const App = () => (
  <>
    <Box xcss={iconSpacingStyles.space050}><AddIcon label="" /></Box>
    <Box xcss={iconSpacingStyles.space075}><ChevronRightIcon label="" size="small" /></Box>
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
import { Inline, Box } from '@atlaskit/primitives/compiled';
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Box xcss={iconSpacingStyles.space050}><AddIcon label="" /></Box>;`,
		'should add Box to existing @atlaskit/primitives/compiled import',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import { Box } from '@atlaskit/primitives';
import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { token } from "@atlaskit/tokens";
import { Box } from "@atlaskit/primitives/compiled";
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Box xcss={iconSpacingStyles.space050}><AddIcon label="" /></Box>;`,
		'should update @atlaskit/primitives to @atlaskit/primitives/compiled',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import { Box } from '@atlaskit/primitives/compiled';
import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { token } from "@atlaskit/tokens";
import { Box } from '@atlaskit/primitives/compiled';
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Box xcss={iconSpacingStyles.space050}><AddIcon label="" /></Box>;`,
		'should keep existing Box import from compiled unchanged',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import { Inline } from '@atlaskit/primitives';
import AddIcon from '@atlaskit/icon/core/add';
const App = () => <AddIcon label="" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { token } from "@atlaskit/tokens";
import { Inline, Box } from "@atlaskit/primitives/compiled";
import AddIcon from '@atlaskit/icon/core/add';

${space050Block}

const App = () => <Box xcss={iconSpacingStyles.space050}><AddIcon label="" /></Box>;`,
		'should add Box and update @atlaskit/primitives to @atlaskit/primitives/compiled',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import MoreIcon from '@atlaskit/icon/core/more';

const IconBefore = (
  <MoreIcon spacing="spacious" label="More" />
);`,
		`import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import MoreIcon from '@atlaskit/icon/core/more';

${space050Block}

const IconBefore = (
  <Box xcss={iconSpacingStyles.space050}><MoreIcon label="More" /></Box>
);`,
		'should not produce extra parentheses inside Box when icon is in a parenthesized expression',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`import BitbucketBranchIcon from '@atlaskit/icon-lab/core/bitbucket-branch';
const App = () => <BitbucketBranchIcon label="" spacing="spacious" />;`,
		`import { cssMap } from "@atlaskit/css";
import { Box } from "@atlaskit/primitives/compiled";
import { token } from "@atlaskit/tokens";
import BitbucketBranchIcon from '@atlaskit/icon-lab/core/bitbucket-branch';

${space050Block}

const App = () => <Box xcss={iconSpacingStyles.space050}><BitbucketBranchIcon label="" /></Box>;`,
		'should migrate icon-lab icons',
	);
});
