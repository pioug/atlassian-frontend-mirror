// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
jest.autoMockOff();

import { renameBreadcrumbsStatelessToBreadcrumbs } from '../migrates/rename-bread-crumbs-stateless-to-bread-crumbs';
import { createTransformer } from '../utils';

const transformer = createTransformer('@atlaskit/breadcrumbs', [
  renameBreadcrumbsStatelessToBreadcrumbs,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Rename BreadcrumbsStateless to Breadcrumbs', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import BreadcrumbsStateless, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

    export default () => (
      <BreadcrumbsStateless size="large" isExpanded />
    );
    `,
    `
    import React from 'react';
    import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

    export default () => (
      <Breadcrumbs size="large" isExpanded />
    );
    `,
    'rename BreadcrumbsStateless to Breadcrumbs and do not change named Imports',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Breadcrumbs from '@material-ui/Breadcrumbs';
    import BreadcrumbsStateless from '@atlaskit/breadcrumbs';

    export default () => (
      <BreadcrumbsStateless size="large" isExpanded />
    );
    `,
    `
    import React from 'react';
    import Breadcrumbs from '@material-ui/Breadcrumbs';
    import DSBreadcrumbs from '@atlaskit/breadcrumbs';

    export default () => (
      <DSBreadcrumbs size="large" isExpanded />
    );
    `,
    'change BreadcrumbsStateless to DSBreadcrumbs when name get conflict',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import BreadcrumbsStateless from '@atlaskit/breadcrumbs';

    export default () => (
      <>
        <section>
          <BreadcrumbsStateless size="large" isExpanded />
        </section>
        <section>
          <BreadcrumbsStateless size="large" isExpanded  />
        </section>
      </>
    );
    `,
    `
    import React from 'react';
    import Breadcrumbs from '@atlaskit/breadcrumbs';

    export default () => (
      <>
        <section>
          <Breadcrumbs size="large" isExpanded />
        </section>
        <section>
          <Breadcrumbs size="large" isExpanded  />
        </section>
      </>
    );
    `,
    'change BreadcrumbsStateless to Breadcrumbs imports and usages',
  );
});
