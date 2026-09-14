import transform, { parser } from '../index';

// Use the `require` form (matching other design-system codemod tests, e.g.
// checkbox) so that `defineInlineTest` is untyped here. Its typed ESM signature
// expects a bare `Transform` function, but at runtime it also reads `.parser`
// off the module, so we pass `{ default, parser }`.
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const transformModule = { default: transform, parser };

defineInlineTest(
	transformModule,
	{},
	`import { BitbucketIcon } from '@atlaskit/logo';`,
	`import { BitbucketIcon } from '@atlaskit/logo/bitbucket/icon';`,
	'migrates BitbucketIcon to its nested entry-point',
);

defineInlineTest(
	transformModule,
	{},
	`import { BitbucketIcon, BitbucketLogo } from '@atlaskit/logo';`,
	`import { BitbucketIcon } from '@atlaskit/logo/bitbucket/icon';
import { BitbucketLogo } from '@atlaskit/logo/bitbucket/logo';`,
	'splits icon and logo imports onto their own entry-points',
);

defineInlineTest(
	transformModule,
	{},
	`import { ConfluenceIcon, JiraIcon, TrelloLogo } from '@atlaskit/logo';`,
	`import { ConfluenceIcon } from '@atlaskit/logo/confluence/icon';
import { JiraIcon } from '@atlaskit/logo/jira/icon';
import { TrelloLogo } from '@atlaskit/logo/trello/logo';`,
	'splits imports across multiple products',
);

defineInlineTest(
	transformModule,
	{},
	`import { BitbucketIcon as BBIcon } from '@atlaskit/logo';`,
	`import { BitbucketIcon as BBIcon } from '@atlaskit/logo/bitbucket/icon';`,
	'preserves import aliases when migrating',
);

defineInlineTest(
	transformModule,
	{},
	`import type { LogoProps } from '@atlaskit/logo';`,
	`import type { LogoProps } from '@atlaskit/logo/types';`,
	'migrates import type LogoProps to the types entry-point',
);

defineInlineTest(
	transformModule,
	{},
	`import { BitbucketIcon, type LogoProps } from '@atlaskit/logo';`,
	`import { BitbucketIcon } from '@atlaskit/logo/bitbucket/icon';
import type { LogoProps } from '@atlaskit/logo/types';`,
	'handles per-specifier type imports correctly',
);

defineInlineTest(
	transformModule,
	{},
	`import { AtlassianIcon } from '@atlaskit/logo';`,
	`import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';`,
	'migrates legacy-only logos to their existing entry-points',
);

defineInlineTest(
	transformModule,
	{},
	`import { BitbucketIcon, LoomAttributionIcon } from '@atlaskit/logo';`,
	`import { LoomAttributionIcon } from '@atlaskit/logo';
import { BitbucketIcon } from '@atlaskit/logo/bitbucket/icon';`,
	'leaves symbols without an entry-point in the root barrel',
);

defineInlineTest(
	transformModule,
	{},
	`import { something } from 'some-other-package';`,
	`import { something } from 'some-other-package';`,
	'ignores files without @atlaskit/logo imports',
);

defineInlineTest(
	transformModule,
	{},
	`export { BitbucketIcon } from '@atlaskit/logo';`,
	`export { BitbucketIcon } from '@atlaskit/logo/bitbucket/icon';`,
	'migrates re-exports from the barrel to the entry-point',
);
