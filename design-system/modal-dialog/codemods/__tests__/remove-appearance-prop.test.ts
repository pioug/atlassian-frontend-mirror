import { createTransformer } from '@atlaskit/codemod-utils';

import { removeAppearanceProp } from '../migrations/remove-appearance-prop';

const transformer = createTransformer([removeAppearanceProp]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('remove appearance prop', () => {
  ['tsx', 'babylon'].forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog
          isBlanketHidden
          isHeadingMultiline
          appearance="warning"
        >
          <div>Content</div>
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';
    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog isBlanketHidden isHeadingMultiline>
          <div>Content</div>
        </ModalDialog>
      );
    }
    `,
        'should remove appearance prop from ModalDialog component',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog(props) {
      return (
        <>
          <ModalDialog heading={props.heading} appearance="warning" isHeadingMultiline />
          <ModalDialog heading={props.heading} />
          <ModalDialog heading={props.heading} appearance={props.appearance} isBlanketHidden />
        </>
      );
    }
    `,
        `
    import React from 'react';
    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog(props) {
      return <>
        <ModalDialog heading={props.heading} isHeadingMultiline />
        <ModalDialog heading={props.heading} />
        <ModalDialog heading={props.heading} isBlanketHidden />
      </>;
    }
    `,
        'should remove appearance props from ALL ModalDialog components if there are multiple',
      );
    });
  });
});
