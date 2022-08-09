import transformer from '../12.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('12.0.0-lite-mode', () => {
  ['tsx', 'babylon'].forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
      import React, { useState } from 'react';

      import ModalDialog from '@atlaskit/modal-dialog';

      const Container = (props) => (<form>{props.children}</form>);
      const Header = (props) => (<div><h1>{props.children}</h1></div>);
      const Footer = (props) => (<div>{props.children}</div>);

      export default function modalDialog() {
        const [appearance, setAppearance] = useState(null);

        return (
          <ModalDialog
            appearance={appearance}
            scrollBehavior="outside"
            onClose={noop}
            components={{ Container }}
            header={Header}
            footer={Footer}>
            <p>Content #1</p>
            <p>Content #2</p>
          </ModalDialog>
        );
      }
      `,
        `
      /* TODO: (from codemod)\u0020
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
      import React, { useState } from 'react';

      import ModalDialog, { ModalBody } from "@atlaskit/modal-dialog";

      const Container = (props) => (<form>{props.children}</form>);
      const Header = (props) => (<div><h1>{props.children}</h1></div>);
      const Footer = (props) => (<div>{props.children}</div>);

      export default function modalDialog() {
        const [appearance, setAppearance] = useState(null);

        return (
          <ModalDialog shouldScrollInViewport onClose={noop}>
            {Container({
              children: <>
                {Header({
                  appearance: appearance
                })}
                <ModalBody>
                  <p>Content #1</p>
                  <p>Content #2</p>
                </ModalBody>
                {Footer({
                  appearance: appearance
                })}
              </>
            })}
          </ModalDialog>
        );
      }
      `,
        'should change custom usages in the appropriate order',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
      import React, { useState } from 'react';

      import ModalDialog, {
        AppearanceType,
        HeaderComponentProps,
        FooterComponentProps,
        BodyComponentProps
      } from '@atlaskit/modal-dialog';

      const Container = (props) => (<form>{props.children}</form>);
      const Header = (props: HeaderComponentProps) => (<div><h1>{props.children}</h1></div>);
      const Footer = (props: FooterComponentProps) => (<div>{props.children}</div>);

      export default function modalDialog() {
        const [appearance, setAppearance] = useState<AppearanceType | null>(null);

        return (
          <ModalDialog
            appearance={appearance}
            scrollBehavior="outside"
            onClose={noop}
            components={{ Container }}
            header={Header}
            footer={Footer} />
        );
      }
      `,
        `
      /* TODO: (from codemod)\u0020
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
      import React, { useState } from 'react';

      import ModalDialog, {
        Appearance as AppearanceType,
        ModalHeaderProps as HeaderComponentProps,
        ModalFooterProps as FooterComponentProps,
        ModalBodyProps as BodyComponentProps
      } from '@atlaskit/modal-dialog';

      const Container = (props) => (<form>{props.children}</form>);
      const Header = (props: HeaderComponentProps) => (<div><h1>{props.children}</h1></div>);
      const Footer = (props: FooterComponentProps) => (<div>{props.children}</div>);

      export default function modalDialog() {
        const [appearance, setAppearance] = useState<AppearanceType | null>(null);

        return (
          <ModalDialog shouldScrollInViewport onClose={noop}>
            {Container({
              children: <>
                {Header({
                  appearance: appearance
                })}{Footer({
                  appearance: appearance
                })}
              </>
            })}
          </ModalDialog>
        );
      }
      `,
        'should change custom usages for a self-closing modal without body',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
      import React, { useState } from 'react';

      import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';

      export default function modalDialog(props) {
        const [isOpen, toggleOpen] = useState<boolean>(false);
        const { appearance, multiline, onClose } = props;

        const actions = [
          { text: 'Close', onClick: close, testId: 'primary' },
          {
            text: 'Secondary Action',
            onClick: noop,
            testId: 'secondary',
          },
        ];

        return (
          <ModalTransition>
          {isOpen &&
            <ModalDialog
              appearance={appearance}
              actions={actions}
              onClose={onClose}
              heading="Modal dialog"
              isHeadingMultiline={multiline}
              isChromeless={false}
              scrollBehavior="outside"
              {...props}
            >
              <div>Content #1</div>
              <div>Content #2</div>
            </ModalDialog>
          }
          </ModalTransition>
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
      import React, { useState } from 'react';

      import Button from "@atlaskit/button/standard-button";
      import ModalDialog, { ModalTransition, ModalBody, ModalTitle, ModalHeader, ModalFooter } from "@atlaskit/modal-dialog";

      export default function modalDialog(props) {
        const [isOpen, toggleOpen] = useState<boolean>(false);
        const { appearance, multiline, onClose } = props;

        const actions = [
          { text: 'Close', onClick: close, testId: 'primary' },
          {
            text: 'Secondary Action',
            onClick: noop,
            testId: 'secondary',
          },
        ];

        return (
          <ModalTransition>
          {isOpen &&
            <ModalDialog onClose={onClose} shouldScrollInViewport {...props}>
              <ModalHeader>
                <ModalTitle appearance={appearance} isMultiline={multiline}>
                  Modal dialog
                </ModalTitle>
              </ModalHeader>

              <ModalBody>
                <div>Content #1</div>
                <div>Content #2</div>
              </ModalBody>
              <ModalFooter>
                {actions.map((props, index) => <Button
                  {...props}
                  autoFocus={index === 0}
                  appearance={index === 0 ? appearance || "primary" : "subtle"}>{props.text}</Button>).reverse()}
              </ModalFooter>
            </ModalDialog>
          }
          </ModalTransition>
        );
      }
      `,
        'should change default usages for modal dialog',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
      import React, { useState } from 'react';

      import ModalDialog, { ModalTransition, ModalBody } from '@atlaskit/modal-dialog';

      import { getModalDialogActions } from './utils';

      const Container = (props) => (<form>{props.children}</form>);
      const CustomBody = (props) => (<div><ModalBody>{props.children}</ModalBody></div>);

      export default function modalDialog(props) {
        const [isOpen, toggleOpen] = useState<boolean>(false);
        const { appearance, onClose } = props;

        return (
          <ModalTransition>
          {isOpen &&
            <ModalDialog
              components={{ Container, Body: CustomBody }}
              actions={getModalDialogActions(onClose)}
              onClose={onClose}
              heading="Modal dialog"
              isChromeless={true}
              scrollBehavior="outside"
            >
              <div>Content #1</div>
              <div>Content #2</div>
            </ModalDialog>
          }
          </ModalTransition>
        );
      }
      `,
        `
      /* TODO: (from codemod)\u0020
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
      import React, { useState } from 'react';

      import Button from "@atlaskit/button/standard-button";
      import ModalDialog, { ModalTransition, ModalBody, ModalTitle, ModalHeader, ModalFooter } from "@atlaskit/modal-dialog";

      import { getModalDialogActions } from './utils';

      const Container = (props) => (<form>{props.children}</form>);
      const CustomBody = (props) => (<div><ModalBody>{props.children}</ModalBody></div>);

      export default function modalDialog(props) {
        const [isOpen, toggleOpen] = useState<boolean>(false);
        const { appearance, onClose } = props;

        return (
          <ModalTransition>
          {isOpen &&
            /* TODO: (from codemod)\u0020
            ModalDialog has a new compositional API and the 'isChromeless' prop is no longer supported.
            To have the functionality of the 'isChromeless' prop, you can choose to not use any of the default exports (ModalBody, ModalHeader and ModalFooter).
            The only other change is that ModalDialog's children should have a border radius of 3px to match the box shadow.
            For more information, check the documentation at https://atlassian.design/components/modal-dialog/examples */
            <ModalDialog onClose={onClose} shouldScrollInViewport>
              {Container({
                children: <>
                  <ModalHeader>
                    <ModalTitle>
                      Modal dialog
                    </ModalTitle>
                  </ModalHeader>

                  {CustomBody({
                    children: <>
                      <div>Content #1</div>
                      <div>Content #2</div>
                    </>
                  })}
                  <ModalFooter>
                    {getModalDialogActions(onClose).map((props, index) => <Button
                      {...props}
                      appearance={index === 0 ? props.appearance || "primary" : props.appearance || "subtle"}>{props.text}</Button>)}
                  </ModalFooter>
                </>
              })}
            </ModalDialog>
          }
          </ModalTransition>
        );
      }
      `,
        'should change mixed usages (custom + default) for modal dialog',
      );
    });
  });

  // Only support ts for this case
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React, { useState } from 'react';

    import ModalDialog, {
      AppearanceType,
      HeaderComponentProps,
      FooterComponentProps,
    } from '@atlaskit/modal-dialog';

    import { WidthNames } from '@atlaskit/modal-dialog/shared-variables';

    interface CustomHeaderProps extends HeaderComponentProps {
      size?: WidthNames;
    }

    const Container = (props) => (<form>{props.children}</form>);
    const Header = (props: CustomHeaderProps) => (<div><h1>{props.children}</h1></div>);
    const Footer = (props: FooterComponentProps) => (<div>{props.children}</div>);

    export default function modalDialog() {
      const [appearance, setAppearance] = useState<AppearanceType | null>(null);

      return (
        <ModalDialog
          appearance={appearance}
          scrollBehavior="outside"
          onClose={noop}
          components={{ Container }}
          header={Header}
          footer={Footer}>
          <p>Content #1</p>
          <p>Content #2</p>
        </ModalDialog>
      );
    }
    `,
    `
    /* TODO: (from codemod)\u0020
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
    import React, { useState } from 'react';

    import ModalDialog, {
      Appearance as AppearanceType,
      ModalHeaderProps as HeaderComponentProps,
      ModalFooterProps as FooterComponentProps,
      ModalBody,
    } from "@atlaskit/modal-dialog";

    interface CustomHeaderProps extends HeaderComponentProps {
      size?: "small" | "medium" | "large" | "x-large";
    }

    const Container = (props) => (<form>{props.children}</form>);
    const Header = (props: CustomHeaderProps) => (<div><h1>{props.children}</h1></div>);
    const Footer = (props: FooterComponentProps) => (<div>{props.children}</div>);

    export default function modalDialog() {
      const [appearance, setAppearance] = useState<AppearanceType | null>(null);

      return (
        <ModalDialog shouldScrollInViewport onClose={noop}>
          {Container({
            children: <>
              {Header({
                appearance: appearance
              })}
              <ModalBody>
                <p>Content #1</p>
                <p>Content #2</p>
              </ModalBody>
              {Footer({
                appearance: appearance
              })}
            </>
          })}
        </ModalDialog>
      );
    }
    `,
    'should change custom usages and types in the appropriate order',
  );
});
