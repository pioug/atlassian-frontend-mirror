import { createTransformer } from '@atlaskit/codemod-utils';

import { renameAppearanceType } from '../migrations/rename-appearance-type';

const transformer = createTransformer([renameAppearanceType]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

// Only testing for tsx here because it's modifying types
describe('rename appearance prop type', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { AppearanceType } from '@atlaskit/modal-dialog';
    `,
    `
    import React from 'react';
    import { Appearance as AppearanceType } from '@atlaskit/modal-dialog';
    `,
    'should create alias for AppearanceType as Appearance',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import ModalDialog, { AppearanceType } from '@atlaskit/modal-dialog';
    `,
    `
    import React from 'react';
    import ModalDialog, { Appearance as AppearanceType } from '@atlaskit/modal-dialog';
    `,
    'should create aliases when imported with a default import',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import ModalDialog, { AppearanceType as ModalDialogAppearance } from '@atlaskit/modal-dialog';
    `,
    `
    import React from 'react';
    import ModalDialog, { Appearance as ModalDialogAppearance } from '@atlaskit/modal-dialog';
    `,
    'should preserve old alias names',
  );
});
