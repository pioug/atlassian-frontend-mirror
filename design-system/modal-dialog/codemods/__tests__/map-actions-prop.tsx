import { createTransformer } from '@atlaskit/codemod-utils';

import { mapActionsProp } from '../migrations/map-actions-prop';

const transformer = createTransformer([mapActionsProp]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('map actions prop', () => {
  ['tsx', 'babylon'].forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
      import React, { useState } from 'react';
      import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

      const DefaultModal = () => {
        const [isOpen, setIsOpen] = useState(true);
        const close = () => setIsOpen(false);
        const actions = [
          { text: 'Close', onClick: close, testId: 'primary' },
          {
            text: 'Secondary Action',
            onClick: ()=>{},
            testId: 'secondary',
          },
        ];

        return (
            <ModalTransition>
              {isOpen && (
                <Modal
                  actions={actions}
                  onClose={close}
                >
                  <p>modal body</p>
                </Modal>
              )}
            </ModalTransition>
        );
      }
    `,
        `
      import React, { useState } from 'react';
      import Button from "@atlaskit/button/standard-button";
      import Modal, { ModalTransition, ModalFooter } from "@atlaskit/modal-dialog";

      const DefaultModal = () => {
        const [isOpen, setIsOpen] = useState(true);
        const close = () => setIsOpen(false);
        const actions = [
          { text: 'Close', onClick: close, testId: 'primary' },
          {
            text: 'Secondary Action',
            onClick: ()=>{},
            testId: 'secondary',
          },
        ];

        return (
          <ModalTransition>
            {isOpen && (
              (<Modal onClose={close}>
                <p>modal body</p>
                <ModalFooter>
                  {actions.map((props, index) => <Button
                    {...props}
                    autoFocus={index === 0}
                    appearance={index === 0 ? "primary" : "subtle"}>{props.text}</Button>).reverse()}
                </ModalFooter>
              </Modal>)
            )}
          </ModalTransition>
        );
      }
    `,
        `should map the actions prop to ModalFooter buttons, add autoFocus primary button, flip buttons when appearance is not present on actions`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
      import React, { useState } from 'react';
      import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
      const actions = [];
      const DefaultModal = () => {
        const [isOpen, setIsOpen] = useState(true);
        const close = () => setIsOpen(false);
        const actions = [
          { text: 'Close', onClick: close, testId: 'primary' },
          {
            text: 'Secondary Action',
            onClick: ()=>{},
            testId: 'secondary',
          },
        ];

        return (
            <ModalTransition>
              {isOpen && (
                <Modal
                  actions={actions}
                  onClose={close}
                >
                  <p>modal body</p>
                </Modal>
              )}
            </ModalTransition>
        );
      }
    `,
        `
      import React, { useState } from 'react';
      import Button from "@atlaskit/button/standard-button";
      import Modal, { ModalTransition, ModalFooter } from "@atlaskit/modal-dialog";
      const actions = [];
      const DefaultModal = () => {
        const [isOpen, setIsOpen] = useState(true);
        const close = () => setIsOpen(false);
        const actions = [
          { text: 'Close', onClick: close, testId: 'primary' },
          {
            text: 'Secondary Action',
            onClick: ()=>{},
            testId: 'secondary',
          },
        ];

        return (
          <ModalTransition>
            {isOpen && (
              /* TODO: (from codemod)\u0020
              In this codemod, we are moving the position of the primary button to the right-hand side of
              modal footer to align with the design guidelines while we convert your usage of 'actions' prop.

              However, we could not definitively determine if the 'appearance' prop has been included in the 'actions' prop in this file,
              so in this case, we have converted the 'actions' prop into Button components without moving the position of the primary button.
              To complete the migration and align with the design guidelines, please make the necessary changes manually. */
              (<Modal onClose={close}>
                <p>modal body</p>
                <ModalFooter>
                  {actions.map((props, index) => <Button
                    {...props}
                    appearance={index === 0 ? props.appearance || "primary" : props.appearance || "subtle"}>{props.text}</Button>)}
                </ModalFooter>
              </Modal>)
            )}
          </ModalTransition>
        );
      }
    `,
        `should add the comment when there are multiple variables as with same name as actions prop`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
      import React, { useState } from 'react';
      import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

      const DefaultModal = () => {
        const [isOpen, setIsOpen] = useState(true);
        const close = () => setIsOpen(false);
        const actions = [
          { text: 'Close', onClick: close, testId: 'primary', appearance:'some-appearance' },
          {
            text: 'Secondary Action',
            onClick: ()=>{},
            testId: 'secondary',
          },
        ];

        return (
            <ModalTransition>
              {isOpen && (
                <Modal
                  actions={actions}
                  onClose={close}
                >
                  <p>modal body</p>
                </Modal>
              )}
            </ModalTransition>
        );
      }
    `,
        `
      import React, { useState } from 'react';
      import Button from "@atlaskit/button/standard-button";
      import Modal, { ModalTransition, ModalFooter } from "@atlaskit/modal-dialog";

      const DefaultModal = () => {
        const [isOpen, setIsOpen] = useState(true);
        const close = () => setIsOpen(false);
        const actions = [
          { text: 'Close', onClick: close, testId: 'primary', appearance:'some-appearance' },
          {
            text: 'Secondary Action',
            onClick: ()=>{},
            testId: 'secondary',
          },
        ];

        return (
          <ModalTransition>
            {isOpen && (
              (<Modal onClose={close}>
                <p>modal body</p>
                <ModalFooter>
                  {actions.map((props, index) => <Button
                    {...props}
                    appearance={index === 0 ? props.appearance || "primary" : props.appearance || "subtle"}>{props.text}</Button>)}
                </ModalFooter>
              </Modal>)
            )}
          </ModalTransition>
        );
      }
    `,
        `should map the actions prop to ModalFooter buttons, shouldn't autoFocus primary button, shouldn't flip buttons when appearance is present on any actions item`,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
      import React, { useState } from 'react';
      import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
      import Button from "@atlaskit/button/standard-button";

      const DefaultModal = () => {
        const [isOpen, setIsOpen] = useState(true);
        const close = () => setIsOpen(false);

        return (
            <ModalTransition>
              {isOpen && (
                <Modal
                  actions={[
                    { text: 'Close', onClick: close, testId: 'primary' },
                    {
                      text: 'Secondary Action',
                      onClick: ()=>{},
                    },
                  ]}
                  onClose={close}
                  appearance="danger"
                >
                  <p>modal body</p>
                </Modal>
              )}
            </ModalTransition>
        );
      }
    `,
        `
      import React, { useState } from 'react';
      import Modal, { ModalTransition, ModalFooter } from "@atlaskit/modal-dialog";
      import Button from "@atlaskit/button/standard-button";

      const DefaultModal = () => {
        const [isOpen, setIsOpen] = useState(true);
        const close = () => setIsOpen(false);

        return (
          <ModalTransition>
            {isOpen && (
              (<Modal onClose={close} appearance="danger">
                <p>modal body</p>
                <ModalFooter>
                  {[
                    { text: 'Close', onClick: close, testId: 'primary' },
                    {
                      text: 'Secondary Action',
                      onClick: ()=>{},
                    },
                  ].map((props, index) => <Button
                    {...props}
                    autoFocus={index === 0}
                    appearance={index === 0 ? "danger" || "primary" : "subtle"}>{props.text}</Button>).reverse()}
                </ModalFooter>
              </Modal>)
            )}
          </ModalTransition>
        );
      }
    `,
        `should map the actions prop to ModalFooter buttons and take apperance prop from modal, should autoFocus primary button and flip actions buttons `,
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
      import React, { useState } from 'react';
      import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

      const DefaultModal = () => {
        const [isOpen, setIsOpen] = useState(true);
        const close = () => setIsOpen(false);
        const secondaryAction = () => alert('Secondary button has been clicked!');
        const actions = [
          { text: 'Close', onClick: close, testId: 'primary', appearance: "primary" },
          {
            text: 'Secondary Action',
            onClick: secondaryAction,
            testId: 'secondary',
            appearance: "subtle"
          },
        ];

        const appearanceValue = 'danger'

        return (
            <ModalTransition>
              {isOpen && (
                <Modal
                  actions={actions}
                  onClose={close}
                  testId="modal"
                  appearance={appearanceValue}
                >
                  <p>modal body</p>
                </Modal>
              )}
            </ModalTransition>
        );
      }
    `,
        `
      import React, { useState } from 'react';
      import Button from "@atlaskit/button/standard-button";
      import Modal, { ModalTransition, ModalFooter } from "@atlaskit/modal-dialog";

      const DefaultModal = () => {
        const [isOpen, setIsOpen] = useState(true);
        const close = () => setIsOpen(false);
        const secondaryAction = () => alert('Secondary button has been clicked!');
        const actions = [
          { text: 'Close', onClick: close, testId: 'primary', appearance: "primary" },
          {
            text: 'Secondary Action',
            onClick: secondaryAction,
            testId: 'secondary',
            appearance: "subtle"
          },
        ];

        const appearanceValue = 'danger'

        return (
          <ModalTransition>
            {isOpen && (
              (<Modal onClose={close} testId="modal" appearance={appearanceValue}>
                <p>modal body</p>
                <ModalFooter>
                  {actions.map((props, index) => <Button
                    {...props}
                    appearance={index === 0 ? props.appearance || appearanceValue || "primary" : props.appearance || "subtle"}>{props.text}</Button>)}
                </ModalFooter>
              </Modal>)
            )}
          </ModalTransition>
        );
      }
    `,
        `should map the actions prop to ModalFooter buttons, not take apperance prop from modal, not add autoFocus and not flip buttons when apperance is defined in actions`,
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
    import React, { useState } from 'react';
    import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

    import { getModalDialogActions } from './utils';

    const DefaultModal = () => {
      const [isOpen, setIsOpen] = useState(true);
      const close = () => setIsOpen(false);
      const secondaryAction = () => alert('Secondary button has been clicked!');

      const appearanceValue = 'danger';

      return (
          <ModalTransition>
            {isOpen && (
              <Modal
                actions={getModalDialogActions(close)}
                onClose={close}
                testId="modal"
                appearance={appearanceValue}
              >
                <p>modal body</p>
              </Modal>
            )}
          </ModalTransition>
      );
    }
    `,
        `
    import React, { useState } from 'react';
    import Button from "@atlaskit/button/standard-button";
    import Modal, { ModalTransition, ModalFooter } from "@atlaskit/modal-dialog";

    import { getModalDialogActions } from './utils';

    const DefaultModal = () => {
      const [isOpen, setIsOpen] = useState(true);
      const close = () => setIsOpen(false);
      const secondaryAction = () => alert('Secondary button has been clicked!');

      const appearanceValue = 'danger';

      return (
        <ModalTransition>
          {isOpen && (
            (<Modal onClose={close} testId="modal" appearance={appearanceValue}>
              <p>modal body</p>
              <ModalFooter>
                {getModalDialogActions(close).map((props, index) => <Button
                  {...props}
                  appearance={index === 0 ? props.appearance || appearanceValue || "primary" : props.appearance || "subtle"}>{props.text}</Button>)}
              </ModalFooter>
            </Modal>)
          )}
        </ModalTransition>
      );
    }
    `,
        `should map the actions prop to ModalFooter buttons, NOT add autoFocus and NOT flip buttons when actions are not declared in the same file`,
      );
    });
  });
});
