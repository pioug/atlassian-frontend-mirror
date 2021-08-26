import { createTransformer } from '@atlaskit/codemod-utils';

import { mapHeadingPropToModalTitle } from '../migrations/map-heading-prop';

const transformer = createTransformer([mapHeadingPropToModalTitle]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Modal heading prop to ModalTitle mapping codemods', () => {
  ['tsx', 'babylon'].forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

    const App = () => {
      return <Modal heading="some heading" testId="modal" isBlanketHidden />;
    }
    `,
        `
    import React from 'react';
    import Modal, { ModalTransition, ModalTitle, ModalHeader } from "@atlaskit/modal-dialog";

    const App = () => {
      return (
        <Modal testId="modal" isBlanketHidden>
          <ModalHeader>
            <ModalTitle>
              some heading
            </ModalTitle>
          </ModalHeader>
        </Modal>
      );
    }
    `,
        `should map the "heading" prop to ModalTitle when heading prop value is a string`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

    const App = () => {
      return <Modal testId="modal" isBlanketHidden><p>Modal Body</p></Modal>;
    }
    `,
        `
    import React from 'react';
    import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

    const App = () => {
      return <Modal testId="modal" isBlanketHidden><p>Modal Body</p></Modal>;
    }
    `,
        `should leave other prop as it is when there is no "heading" prop provided`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';

    const App = () => {
      return <Modal heading={"some heading"} testId="modal" isBlanketHidden />;
    }
    `,
        `
    import React from 'react';
    import Modal, { ModalTitle, ModalHeader } from "@atlaskit/modal-dialog";

    const App = () => {
      return (
        <Modal testId="modal" isBlanketHidden>
          <ModalHeader>
            <ModalTitle>
              {"some heading"}
            </ModalTitle>
          </ModalHeader>
        </Modal>
      );
    }
    `,
        `should map the "heading" prop to ModalTitle when heading prop value is an expression`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';
    const x = true;
    const heading = "some-heading"
    const App = () => {
      return <Modal heading={x && heading} testId="modal" isBlanketHidden />;
    }
    `,
        `
    import React from 'react';
    import Modal, { ModalTitle, ModalHeader } from "@atlaskit/modal-dialog";
    const x = true;
    const heading = "some-heading"
    const App = () => {
      return (
        <Modal testId="modal" isBlanketHidden>
          <ModalHeader>
            <ModalTitle>
              {x && heading}
            </ModalTitle>
          </ModalHeader>
        </Modal>
      );
    }
    `,
        `should map the "heading" prop to ModalTitle when heading prop value is a complex expression`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import ModalHeader, { ModalTransition as ModalTitle} from '@atlaskit/modal-dialog';

    const App = () => {
      return <ModalHeader heading={<p><span>my heading</span></p>} testId="modal" isBlanketHidden />;
    }
    `,
        `
    import React from 'react';
    import ModalHeader, {
      ModalTransition as ModalTitle,
      ModalTitle as AKModalTitle,
      ModalHeader as AKModalHeader,
    } from "@atlaskit/modal-dialog";

    const App = () => {
      return (
        <ModalHeader testId="modal" isBlanketHidden>
          <AKModalHeader>
            <AKModalTitle>
              {<p><span>my heading</span></p>}
            </AKModalTitle>
          </AKModalHeader>
        </ModalHeader>
      );
    }
    `,
        `should map the "heading" prop to ModalTitle when heading prop value is a JSX and alias the import when variable with same name exists in scope `,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal from '@atlaskit/modal-dialog';
    const props = {}
    const App = () => {
      return <Modal heading="some-heading" {...props} />;
    }
    `,
        `
    import React from 'react';
    import Modal, { ModalTitle, ModalHeader } from "@atlaskit/modal-dialog";
    const props = {}
    const App = () => {
      return (
        <Modal {...props}>
          <ModalHeader>
            <ModalTitle>
              some-heading
            </ModalTitle>
          </ModalHeader>
        </Modal>
      );
    }
    `,
        `should map "heading" prop when props are being spread over but "heading" prop is present separately`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    const AKModalDialog = lazy(() => import('@atlaskit/modal-dialog'));
    const AKModalTransition = lazy(() =>
      import('@atlaskit/modal-dialog').then((module) => ({
        default: module.ModalTransition,
      })),
    );

    const App = () => {
      return (
        <AKModalTransition>
          <AKModalDialog heading="Configuration">
            <div>modal body</div>
          </AKModalDialog>
        </AKModalTransition>
      );
    }
    `,
        `
    import React from 'react';
    const AKModalDialog = lazy(() => import('@atlaskit/modal-dialog'));

    /* TODO: (from codemod) We have added "React.lazy" here. Feel free to change it to "lazy" or other named import depending upon how you imported. */
    const ModalTitle = React.lazy(() => import("@atlaskit/modal-dialog/modal-title"));

    /* TODO: (from codemod) We have added "React.lazy" here. Feel free to change it to "lazy" or other named import depending upon how you imported. */
    const ModalHeader = React.lazy(() => import("@atlaskit/modal-dialog/modal-header"));

    const AKModalTransition = lazy(() =>
      import('@atlaskit/modal-dialog').then((module) => ({
        default: module.ModalTransition,
      })),
    );

    const App = () => {
      return (
        <AKModalTransition>
          <AKModalDialog>
            <ModalHeader>
              <ModalTitle>
                Configuration
              </ModalTitle>
            </ModalHeader>

            <div>modal body</div>
          </AKModalDialog>
        </AKModalTransition>
      );
    }
    `,
        `should map the "heading" prop to ModalTitle when modal is dynamically imported and heading prop value is a string`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    const ModalTitle = 42;
    const AKModalDialog = lazy(() => import('@atlaskit/modal-dialog'));
    const ModalHeader = 'header';

    const App = () => {
      return (
        <AKModalDialog heading={<div>my modal heading</div>}>
          <div>modal body</div>
        </AKModalDialog>
      );
    }
    `,
        `
    import React from 'react';
    const ModalTitle = 42;
    const AKModalDialog = lazy(() => import('@atlaskit/modal-dialog'));

    /* TODO: (from codemod) We have added "React.lazy" here. Feel free to change it to "lazy" or other named import depending upon how you imported. */
    const AKModalTitle = React.lazy(() => import("@atlaskit/modal-dialog/modal-title"));

    /* TODO: (from codemod) We have added "React.lazy" here. Feel free to change it to "lazy" or other named import depending upon how you imported. */
    const AKModalHeader = React.lazy(() => import("@atlaskit/modal-dialog/modal-header"));

    const ModalHeader = 'header';

    const App = () => {
      return (
        (<AKModalDialog>
          <AKModalHeader>
            <AKModalTitle>
              {<div>my modal heading</div>}
            </AKModalTitle>
          </AKModalHeader>

          <div>modal body</div>
        </AKModalDialog>)
      );
    }
    `,
        `should map the "heading" prop to ModalTitle when modal is dynamically imported and heading prop value is an expression and alias the import the when variable with same name exist in scope`,
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

    const App = () => {
      return <Modal heading="some heading" appearance="warning" testId="modal" isBlanketHidden />;
    }
    `,
        `
    import React from 'react';
    import Modal, { ModalTransition, ModalTitle, ModalHeader } from "@atlaskit/modal-dialog";

    const App = () => {
      return (
        <Modal appearance="warning" testId="modal" isBlanketHidden>
          <ModalHeader>
            <ModalTitle appearance="warning">
              some heading
            </ModalTitle>
          </ModalHeader>
        </Modal>
      );
    }
    `,
        `should map appearance prop declared as string to ModalTitle if exists`,
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

    const App = (props) => {
      return <Modal heading="some heading" appearance={props.appearance} testId="modal" isBlanketHidden />;
    }
    `,
        `
    import React from 'react';
    import Modal, { ModalTransition, ModalTitle, ModalHeader } from "@atlaskit/modal-dialog";

    const App = (props) => {
      return (
        <Modal appearance={props.appearance} testId="modal" isBlanketHidden>
          <ModalHeader>
            <ModalTitle appearance={props.appearance}>
              some heading
            </ModalTitle>
          </ModalHeader>
        </Modal>
      );
    }
    `,
        `should map appearance prop declared as variable to ModalTitle if exists`,
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

    const App = () => {
      return <Modal heading="some heading" isHeadingMultiline={true} testId="modal" isBlanketHidden />;
    }
    `,
        `
    import React from 'react';
    import Modal, { ModalTransition, ModalTitle, ModalHeader } from "@atlaskit/modal-dialog";

    const App = () => {
      return (
        <Modal testId="modal" isBlanketHidden>
          <ModalHeader>
            <ModalTitle isMultiline={true}>
              some heading
            </ModalTitle>
          </ModalHeader>
        </Modal>
      );
    }
    `,
        `should map isHeadingMultiline prop declared as boolean to ModalTitle and removes it from ModalDialog`,
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

    const App = () => {
      return <Modal heading="some heading" isHeadingMultiline testId="modal" isBlanketHidden />;
    }
    `,
        `
    import React from 'react';
    import Modal, { ModalTransition, ModalTitle, ModalHeader } from "@atlaskit/modal-dialog";

    const App = () => {
      return (
        <Modal testId="modal" isBlanketHidden>
          <ModalHeader>
            <ModalTitle isMultiline>
              some heading
            </ModalTitle>
          </ModalHeader>
        </Modal>
      );
    }
    `,
        `should map isHeadingMultiline prop declared without value to ModalTitle and removes it from ModalDialog`,
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React from 'react';
    import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

    const App = (props) => {
      return <Modal heading="some heading" isHeadingMultiline={props.isMultiline} testId="modal" isBlanketHidden />;
    }
    `,
        `
    import React from 'react';
    import Modal, { ModalTransition, ModalTitle, ModalHeader } from "@atlaskit/modal-dialog";

    const App = (props) => {
      return (
        <Modal testId="modal" isBlanketHidden>
          <ModalHeader>
            <ModalTitle isMultiline={props.isMultiline}>
              some heading
            </ModalTitle>
          </ModalHeader>
        </Modal>
      );
    }
    `,
        `should map isHeadingMultiline prop declared as variable to ModalTitle and removes it from ModalDialog`,
      );
    });
  });
});
