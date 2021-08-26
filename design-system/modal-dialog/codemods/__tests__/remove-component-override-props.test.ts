import { createTransformer } from '@atlaskit/codemod-utils';

import { removeComponentOverrideProps } from '../migrations/remove-component-override-props';

const transformer = createTransformer([removeComponentOverrideProps]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('remove component override props', () => {
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
          onClose={handleClose}
          components={{}}
        >
          {content}
        </ModalDialog>
      );
    }
    `,
        `/* TODO: (from codemod)\u0020
    We have converted this file as best we could but you might still need
    to manually complete migrating this usage of ModalDialog.

    This file uses one or more of the following ModalDialog props: 'components', 'header',
    'footer', 'body'. These props have been removed as part of moving to
    a compositional API.

    The render props that used to be exposed by the custom component APIs are
    now accessible using the 'useModal' hook instead: 'testId', 'titleId', and 'onClose'.

    We are also no longer exposing 'appearance' as render prop, so this needs to be
    manually passed to your custom components.

    If you are using the 'container' value of 'components' to wrap ModalDialog in something
    other than a 'form', you'll need to add the style 'all: inherit;' for scrolling to function.

    For a complete guide on customization using the new compositional API, refer to the docs at
    https://atlassian.design/components/modal-dialog/examples. */
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose}>
          {content}
        </ModalDialog>
      );
    }
    `,
        'should remove components prop and add explanation in comment',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog
          onClose={handleClose}
          header={header}
          footer={footer}
          body={body}
        >
          {content}
        </ModalDialog>
      );
    }
    `,
        `/* TODO: (from codemod)\u0020
    We have converted this file as best we could but you might still need
    to manually complete migrating this usage of ModalDialog.

    This file uses one or more of the following ModalDialog props: 'components', 'header',
    'footer', 'body'. These props have been removed as part of moving to
    a compositional API.

    The render props that used to be exposed by the custom component APIs are
    now accessible using the 'useModal' hook instead: 'testId', 'titleId', and 'onClose'.

    We are also no longer exposing 'appearance' as render prop, so this needs to be
    manually passed to your custom components.

    If you are using the 'container' value of 'components' to wrap ModalDialog in something
    other than a 'form', you'll need to add the style 'all: inherit;' for scrolling to function.

    For a complete guide on customization using the new compositional API, refer to the docs at
    https://atlassian.design/components/modal-dialog/examples. */
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose}>
          {content}
        </ModalDialog>
      );
    }
    `,
        'should remove header/footer/body props and add explanation in comment',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose}>
          {content}
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog onClose={handleClose}>
          {content}
        </ModalDialog>
      );
    }
    `,
        'should not add comment if there are no component props to be removed',
      );
    });
  });
});
