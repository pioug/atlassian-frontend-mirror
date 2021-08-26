import { createTransformer } from '@atlaskit/codemod-utils';

import { renameScrollBehaviorToShouldScrollInViewport } from '../migrations/rename-scrollBehavior-to-shouldScrollInViewport';

const transformer = createTransformer([
  renameScrollBehaviorToShouldScrollInViewport,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('rename scrollBehavior prop', () => {
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
          testId="modal-dialog"
          scrollBehavior="outside"
          appearance="warning"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin aliquet faucibus velit id ornare. Nam urna ante, consequat
          vitae viverra non, hendrerit in lorem. Sed fringilla dolor
          eget nisi eleifend lacinia ut a ligula.
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog
          testId="modal-dialog"
          shouldScrollInViewport
          appearance="warning"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin aliquet faucibus velit id ornare. Nam urna ante, consequat
          vitae viverra non, hendrerit in lorem. Sed fringilla dolor
          eget nisi eleifend lacinia ut a ligula.
        </ModalDialog>
      );
    }
    `,
        'should change scrollBehavior="outside" to shouldScrollInViewport',
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
          testId="modal-dialog"
          scrollBehavior="inside"
          appearance="warning"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin aliquet faucibus velit id ornare. Nam urna ante, consequat
          vitae viverra non, hendrerit in lorem. Sed fringilla dolor
          eget nisi eleifend lacinia ut a ligula.
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog testId="modal-dialog" appearance="warning">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin aliquet faucibus velit id ornare. Nam urna ante, consequat
          vitae viverra non, hendrerit in lorem. Sed fringilla dolor
          eget nisi eleifend lacinia ut a ligula.
        </ModalDialog>
      );
    }
    `,
        'should remove scrollBehavior="inside" as it is default behaviour',
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
          testId="modal-dialog"
          scrollBehavior="inside-wide"
          appearance="warning"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin aliquet faucibus velit id ornare. Nam urna ante, consequat
          vitae viverra non, hendrerit in lorem. Sed fringilla dolor
          eget nisi eleifend lacinia ut a ligula.
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog testId="modal-dialog" appearance="warning">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin aliquet faucibus velit id ornare. Nam urna ante, consequat
          vitae viverra non, hendrerit in lorem. Sed fringilla dolor
          eget nisi eleifend lacinia ut a ligula.
        </ModalDialog>
      );
    }
    `,
        'should remove scrollBehavior="inside-wide" as it is now default behaviour',
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
          testId="modal-dialog"
          scrollBehavior={scrollBehavior}
          appearance="warning"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin aliquet faucibus velit id ornare. Nam urna ante, consequat
          vitae viverra non, hendrerit in lorem. Sed fringilla dolor
          eget nisi eleifend lacinia ut a ligula.
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog
          testId="modal-dialog"
          shouldScrollInViewport={scrollBehavior === "outside"}
          appearance="warning"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin aliquet faucibus velit id ornare. Nam urna ante, consequat
          vitae viverra non, hendrerit in lorem. Sed fringilla dolor
          eget nisi eleifend lacinia ut a ligula.
        </ModalDialog>
      );
    }
    `,
        'should assert scrollBehavior variable to convert to shouldScrollInViewport',
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
          testId="modal-dialog"
          scrollBehavior={"outside"}
          appearance="warning"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin aliquet faucibus velit id ornare. Nam urna ante, consequat
          vitae viverra non, hendrerit in lorem. Sed fringilla dolor
          eget nisi eleifend lacinia ut a ligula.
        </ModalDialog>
      );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    export default function modalDialog() {
      return (
        <ModalDialog
          testId="modal-dialog"
          shouldScrollInViewport
          appearance="warning"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin aliquet faucibus velit id ornare. Nam urna ante, consequat
          vitae viverra non, hendrerit in lorem. Sed fringilla dolor
          eget nisi eleifend lacinia ut a ligula.
        </ModalDialog>
      );
    }
    `,
        'should change scrollBehavior value passed in an expression container to shouldScrollInViewport',
      );
    });
  });
});
