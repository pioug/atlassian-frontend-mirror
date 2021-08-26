import { createTransformer } from '@atlaskit/codemod-utils';

import { handlePropSpread } from '../migrations/handle-prop-spread';

const transformer = createTransformer([handlePropSpread]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Modal props spread handling codemod', () => {
  ['tsx', 'babylon'].forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';
    const props = {}
    const App = () => {
      return <Modal {...props} />;
    }
    `,
        `
    /* TODO: (from codemod)\u0020
    This file is spreading props on the ModalDialog component, so we could not
    automatically convert this usage to the new API.

    The following props have been deprecated as part of moving to a compositional API:

    - 'heading' prop has been replaced by ModalHeader and ModalTitle components.
    - 'actions' prop has been replaced by ModalFooter component, with Button components from @atlaskit/button.
    - 'scrollBehavior' prop has been replaced by 'shouldScrollInViewport', where "outside" from the previous prop maps to true in the new prop.
    - 'isHeadingMultiline' prop has been replaced by 'isMultiline' prop on the ModalTitle component.
    - 'appearance' prop has been moved to the ModalTitle component. To achieve the feature parity, pass the 'appearance' prop directly to ModalTitle and Button components inside ModalFooter.

    Refer to the docs for the new API at https://atlassian.design/components/modal-dialog/examples
    to complete the migration and use the new composable components. */
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';
    const props = {}
    const App = () => {
      return <Modal {...props} />;
    }
    `,
        `should add a comment when props are being spread`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    const AKModalDialog = lazy(() => import('@atlaskit/modal-dialog'));
    const props = {}
    const App = () => {
      return <AKModalDialog {...props} />;
    }
    `,
        `
    /* TODO: (from codemod)\u0020
    This file is spreading props on the ModalDialog component, so we could not
    automatically convert this usage to the new API.

    The following props have been deprecated as part of moving to a compositional API:

    - 'heading' prop has been replaced by ModalHeader and ModalTitle components.
    - 'actions' prop has been replaced by ModalFooter component, with Button components from @atlaskit/button.
    - 'scrollBehavior' prop has been replaced by 'shouldScrollInViewport', where "outside" from the previous prop maps to true in the new prop.
    - 'isHeadingMultiline' prop has been replaced by 'isMultiline' prop on the ModalTitle component.
    - 'appearance' prop has been moved to the ModalTitle component. To achieve the feature parity, pass the 'appearance' prop directly to ModalTitle and Button components inside ModalFooter.

    Refer to the docs for the new API at https://atlassian.design/components/modal-dialog/examples
    to complete the migration and use the new composable components. */
    import React from 'react';
    const AKModalDialog = lazy(() => import('@atlaskit/modal-dialog'));
    const props = {}
    const App = () => {
      return <AKModalDialog {...props} />;
    }
    `,
        `should add a comment when props are being spread on a dynamically imported modal`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';
    const props = {}
    const App = () => {
      return (
        <>
        <Modal heading={"some heading"} testId="modal" isBlanketHidden />
        <Modal {...props} />
        <Modal heading={"some heading"} testId="modal" isBlanketHidden />
        </>
        );
    }
    `,
        `
    /* TODO: (from codemod)\u0020
    This file is spreading props on the ModalDialog component, so we could not
    automatically convert this usage to the new API.

    The following props have been deprecated as part of moving to a compositional API:

    - 'heading' prop has been replaced by ModalHeader and ModalTitle components.
    - 'actions' prop has been replaced by ModalFooter component, with Button components from @atlaskit/button.
    - 'scrollBehavior' prop has been replaced by 'shouldScrollInViewport', where "outside" from the previous prop maps to true in the new prop.
    - 'isHeadingMultiline' prop has been replaced by 'isMultiline' prop on the ModalTitle component.
    - 'appearance' prop has been moved to the ModalTitle component. To achieve the feature parity, pass the 'appearance' prop directly to ModalTitle and Button components inside ModalFooter.

    Refer to the docs for the new API at https://atlassian.design/components/modal-dialog/examples
    to complete the migration and use the new composable components. */
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';
    const props = {}
    const App = () => {
      return (
        <>
        <Modal heading={"some heading"} testId="modal" isBlanketHidden />
        <Modal {...props} />
        <Modal heading={"some heading"} testId="modal" isBlanketHidden />
        </>
        );
    }
    `,
        `should add a comment when props are being spread on atleast one modal`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    const AKModalDialog = lazy(() => import('@atlaskit/modal-dialog'));
    const props = {}
    const App = () => {
      return (
        <>
        <AKModalDialog heading={"some heading"} testId="modal" isBlanketHidden />
        <AKModalDialog {...props} />
        <AKModalDialog heading={"some heading"} testId="modal" isBlanketHidden />
        </>
        );
    }
    `,
        `
    /* TODO: (from codemod)\u0020
    This file is spreading props on the ModalDialog component, so we could not
    automatically convert this usage to the new API.

    The following props have been deprecated as part of moving to a compositional API:

    - 'heading' prop has been replaced by ModalHeader and ModalTitle components.
    - 'actions' prop has been replaced by ModalFooter component, with Button components from @atlaskit/button.
    - 'scrollBehavior' prop has been replaced by 'shouldScrollInViewport', where "outside" from the previous prop maps to true in the new prop.
    - 'isHeadingMultiline' prop has been replaced by 'isMultiline' prop on the ModalTitle component.
    - 'appearance' prop has been moved to the ModalTitle component. To achieve the feature parity, pass the 'appearance' prop directly to ModalTitle and Button components inside ModalFooter.

    Refer to the docs for the new API at https://atlassian.design/components/modal-dialog/examples
    to complete the migration and use the new composable components. */
    import React from 'react';
    const AKModalDialog = lazy(() => import('@atlaskit/modal-dialog'));
    const props = {}
    const App = () => {
      return (
        <>
        <AKModalDialog heading={"some heading"} testId="modal" isBlanketHidden />
        <AKModalDialog {...props} />
        <AKModalDialog heading={"some heading"} testId="modal" isBlanketHidden />
        </>
        );
    }
    `,
        `should add a comment when props are being spread on atleast one modal when modals are dynamically imported`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';
    const props = {}
    const App = () => {
      return (
        <>
        <Modal heading={"some heading"} testId="modal" isBlanketHidden />
        <Modal heading="some other heading" testId="another-modal" isBlanketHidden={false} autoFocus />
        </>
        );
    }
    `,
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';
    const props = {}
    const App = () => {
      return (
        <>
        <Modal heading={"some heading"} testId="modal" isBlanketHidden />
        <Modal heading="some other heading" testId="another-modal" isBlanketHidden={false} autoFocus />
        </>
        );
    }
    `,
        `should not add a comment when props are not being spread in any of modal`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    const AKModalDialog = lazy(() => import('@atlaskit/modal-dialog'));
    const props = {}
    const App = () => {
      return (
        <>
        <AKModalDialog heading={"some heading"} testId="modal" isBlanketHidden />
        <AKModalDialog heading="some other heading" testId="another-modal" isBlanketHidden={false} autoFocus />
        </>
        );
    }
    `,
        `
    import React from 'react';
    const AKModalDialog = lazy(() => import('@atlaskit/modal-dialog'));
    const props = {}
    const App = () => {
      return (
        <>
        <AKModalDialog heading={"some heading"} testId="modal" isBlanketHidden />
        <AKModalDialog heading="some other heading" testId="another-modal" isBlanketHidden={false} autoFocus />
        </>
        );
    }
    `,
        `should not add a comment when props are not being spread in any of modal when modals are dynamically imported`,
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    import ElementBrowser from './element-browser';

    const App = (props) => {
      return (
        <ModalDialog heading="Modal dialog" testId="modal" isBlanketHidden>
          <ElementBrowser {...props} />
        </ModalDialog>
        );
    }
    `,
        `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    import ElementBrowser from './element-browser';

    const App = (props) => {
      return (
        <ModalDialog heading="Modal dialog" testId="modal" isBlanketHidden>
          <ElementBrowser {...props} />
        </ModalDialog>
        );
    }
    `,
        `should not add a comment if prop spread is NOT on ModalDialog`,
      );
    });
  });
});
