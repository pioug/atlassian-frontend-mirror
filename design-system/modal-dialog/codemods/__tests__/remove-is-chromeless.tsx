import { createTransformer } from '@atlaskit/codemod-utils';

import { removeIsChromeless } from '../migrations/remove-is-chromeless';

const transformer = createTransformer([removeIsChromeless]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Modal isChromeless prop removal codemods', () => {
  ['tsx', 'babylon'].forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';

    const App = () => {
      return (
        <Modal
        testId="modal"
        isChromeless={false}
        />
      );
    }
    `,
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';

    const App = () => {
      return <Modal testId="modal" />;
    }
    `,
        `should remove the "isChromeless" prop without adding comment when its value is false`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';

    const App = () => {
      return (
        <Modal
        testId="modal"
        isBlanketHidden
        autoFocus={false}
        />
      );
    }
    `,
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';

    const App = () => {
      return (
        <Modal
        testId="modal"
        isBlanketHidden
        autoFocus={false}
        />
      );
    }
    `,
        `should leave other props as it is when "isChromeless" prop is not present`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';

    const App = () => {
      return (
        <Modal
        testId="modal"
        isChromeless={true}
        />
      );
    }
    `,
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';

    const App = () => {
      return (
        /* TODO: (from codemod)\u0020
        ModalDialog has a new compositional API and the 'isChromeless' prop is no longer supported.
        To have the functionality of the 'isChromeless' prop, you can choose to not use any of the default exports (ModalBody, ModalHeader and ModalFooter).
        The only other change is that ModalDialog's children should have a border radius of 3px to match the box shadow.
        For more information, check the documentation at https://atlassian.design/components/modal-dialog/examples */
        (<Modal testId="modal" />)
      );
    }
    `,
        `should remove the "isChromeless" prop and add comment when its value is true`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';

    const App = () => {
      return (
        <Modal
        testId="modal"
        onCloseComplete={() => console.log('closed')}
        isChromeless
        isBlanketHidden
        autoFocus={false}
        />
      );
    }
    `,
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';

    const App = () => {
      return (
        /* TODO: (from codemod)\u0020
        ModalDialog has a new compositional API and the 'isChromeless' prop is no longer supported.
        To have the functionality of the 'isChromeless' prop, you can choose to not use any of the default exports (ModalBody, ModalHeader and ModalFooter).
        The only other change is that ModalDialog's children should have a border radius of 3px to match the box shadow.
        For more information, check the documentation at https://atlassian.design/components/modal-dialog/examples */
        (<Modal
          testId="modal"
          onCloseComplete={() => console.log('closed')}
          isBlanketHidden
          autoFocus={false} />)
      );
    }
    `,
        `should remove the "isChromeless" prop and add comment when its value is implicitly true`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';

    const App = () => {
      const val=false;
      return (
        <Modal
        isChromeless={val}
        >
          hello world
        </Modal>
      );
    }
    `,
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';

    const App = () => {
      const val=false;
      return (
        /* TODO: (from codemod)\u0020
        ModalDialog has a new compositional API and the 'isChromeless' prop is no longer supported.
        To have the functionality of the 'isChromeless' prop, you can choose to not use any of the default exports (ModalBody, ModalHeader and ModalFooter).
        The only other change is that ModalDialog's children should have a border radius of 3px to match the box shadow.
        For more information, check the documentation at https://atlassian.design/components/modal-dialog/examples */
        (<Modal>hello world</Modal>)
      );
    }
    `,
        `should remove the "isChromeless" prop and add comment when its value is a variable`,
      );
    });
  });
});
