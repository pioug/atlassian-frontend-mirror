jest.autoMockOff();

import transformer from '../not-yet-boolean-autofocus-removal';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Remove autoFocus prop', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import ModalDialog from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <ModalDialog autoFocus />;
      }
    `,
		`
      import React from 'react';
      import ModalDialog from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <ModalDialog />;
      }
    `,
		'should remove "true" boolean autoFocus prop from default import',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import ModalDialog from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <ModalDialog autoFocus={true} />;
      }
    `,
		`
      import React from 'react';
      import ModalDialog from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <ModalDialog />;
      }
    `,
		'should remove boolean true autoFocus prop from default import',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import ModalDialog from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <ModalDialog autoFocus={false} />;
      }
    `,
		`
      import React from 'react';
      import ModalDialog from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <ModalDialog />;
      }
    `,
		'should remove boolean false autoFocus prop from default import',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import ModalDialog from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <ModalDialog autoFocus={ref} />;
      }
    `,
		`
      import React from 'react';
      import ModalDialog from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <ModalDialog autoFocus={ref} />;
      }
    `,
		'should not remove non-boolean autoFocus prop from default import',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import { ModalDialog } from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <ModalDialog autoFocus={false} />;
      }
    `,
		`
      import React from 'react';
      import { ModalDialog } from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <ModalDialog />;
      }
    `,
		'should remove autoFocus prop from named import',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import { ModalDialog } from '@foo/bar';

      const SimpleModalDialog = () => {
        return <ModalDialog autoFocus={false} />;
      }
    `,
		`
      import React from 'react';
      import { ModalDialog } from '@foo/bar';

      const SimpleModalDialog = () => {
        return <ModalDialog autoFocus={false} />;
      }
    `,
		'should do nothing if not correct import',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import React from 'react';
      import { ModalDialog as AkModalDialog } from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <AkModalDialog autoFocus={false} />;
      }
    `,
		`
      import React from 'react';
      import { ModalDialog as AkModalDialog } from '@atlaskit/modal-dialog';

      const SimpleModalDialog = () => {
        return <AkModalDialog />;
      }
    `,
		'should remove autoFocus prop with aliased import',
	);
});
