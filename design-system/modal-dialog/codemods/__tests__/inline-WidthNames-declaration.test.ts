import { createTransformer } from '@atlaskit/codemod-utils';

import { inlineWidthNamesDeclaration } from '../migrations/inline-WidthNames-declaration';

const transformer = createTransformer([inlineWidthNamesDeclaration]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

// Only testing for tsx here because it's modifying types
describe('inline WidthNames declaration', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';
    import { WidthNames } from '@atlaskit/modal-dialog/shared-variables';

    type CustomModalDialogProps = {
      isOpen: boolean;
      size?: WidthNames;
      children: React.ReactNode;
      onDismiss: () => void;
    }

    export default function customModalDialog(props: CustomModalDialogProps) {
      const { isOpen, size, children, onDismiss } = props;

      return (
        isOpen && (
          <ModalDialog width={size} onClose={onDismiss}>
            {children}
          </ModalDialog>
        )
      )
    }
    `,
    `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    type CustomModalDialogProps = {
      isOpen: boolean;
      size?: "small" | "medium" | "large" | "x-large";
      children: React.ReactNode;
      onDismiss: () => void;
    }

    export default function customModalDialog(props: CustomModalDialogProps) {
      const { isOpen, size, children, onDismiss } = props;

      return (
        isOpen && (
          <ModalDialog width={size} onClose={onDismiss}>
            {children}
          </ModalDialog>
        )
      )
    }
    `,
    'should inline values of WidthNames in a type declaration and remove shared-variables import',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';
    import { WidthNames as ModalDialogWidths } from '@atlaskit/modal-dialog/shared-variables';

    type CustomModalDialogProps = {
      isOpen: boolean;
      size?: ModalDialogWidths;
      children: React.ReactNode;
      onDismiss: () => void;
    }

    export default function customModalDialog(props: CustomModalDialogProps) {
      const { isOpen, size, children, onDismiss } = props;

      return (
        isOpen && (
          <ModalDialog width={size} onClose={onDismiss}>
            {children}
          </ModalDialog>
        )
      )
    }
    `,
    `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    type CustomModalDialogProps = {
      isOpen: boolean;
      size?: "small" | "medium" | "large" | "x-large";
      children: React.ReactNode;
      onDismiss: () => void;
    }

    export default function customModalDialog(props: CustomModalDialogProps) {
      const { isOpen, size, children, onDismiss } = props;

      return (
        isOpen && (
          <ModalDialog width={size} onClose={onDismiss}>
            {children}
          </ModalDialog>
        )
      )
    }
    `,
    'should inline values of WidthNames imported with an alias and remove shared-variables import',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import ModalDialog, { ModalDialogProps } from '@atlaskit/modal-dialog';
    import { WidthNames } from '@atlaskit/modal-dialog/shared-variables';

    interface CustomModalDialogProps extends ModalDialogProps {
      isOpen: boolean;
      size: WidthNames;
      children: React.ReactNode;
      onDismiss: () => void;
    }

    export default function customModalDialog(props: CustomModalDialogProps) {
      const { isOpen, size, children, onDismiss } = props;

      return (
        isOpen && (
          <ModalDialog width={size} onClose={onDismiss}>
            {children}
          </ModalDialog>
        )
      )
    }
    `,
    `
    import React from 'react';

    import ModalDialog, { ModalDialogProps } from '@atlaskit/modal-dialog';

    interface CustomModalDialogProps extends ModalDialogProps {
      isOpen: boolean;
      size: "small" | "medium" | "large" | "x-large";
      children: React.ReactNode;
      onDismiss: () => void;
    }

    export default function customModalDialog(props: CustomModalDialogProps) {
      const { isOpen, size, children, onDismiss } = props;

      return (
        isOpen && (
          <ModalDialog width={size} onClose={onDismiss}>
            {children}
          </ModalDialog>
        )
      )
    }
    `,
    'should inline values of WidthNames in an interface declaration and remove shared-variables import',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';
    import { WidthNames } from '@atlaskit/modal-dialog/shared-variables';

    import { getStyles } from './styles';

    type CustomBodyProps = {
      size: WidthNames;
      children: React.ReactNode;
    }

    interface CustomModalDialogProps {
      isOpen: boolean;
      size: WidthNames;
      children: React.ReactNode;
      onDismiss: () => void;
    }

    function CustomBody(props: CustomBodyProps) {
      return (
        <div style={getStyles(props.size)}>{props.children}</div>
      )
    }

    export default function customModalDialog(props: CustomModalDialogProps) {
      const { isOpen, size, children, onDismiss } = props;

      return (
        isOpen && (
          <ModalDialog width={size} onClose={onDismiss}>
            <CustomBody size={size}>
              {children}
            </CustomBody>
          </ModalDialog>
        )
      )
    }
    `,
    `
    import React from 'react';

    import ModalDialog from '@atlaskit/modal-dialog';

    import { getStyles } from './styles';

    type CustomBodyProps = {
      size: "small" | "medium" | "large" | "x-large";
      children: React.ReactNode;
    }

    interface CustomModalDialogProps {
      isOpen: boolean;
      size: "small" | "medium" | "large" | "x-large";
      children: React.ReactNode;
      onDismiss: () => void;
    }

    function CustomBody(props: CustomBodyProps) {
      return (
        <div style={getStyles(props.size)}>{props.children}</div>
      )
    }

    export default function customModalDialog(props: CustomModalDialogProps) {
      const { isOpen, size, children, onDismiss } = props;

      return (
        isOpen && (
          <ModalDialog width={size} onClose={onDismiss}>
            <CustomBody size={size}>
              {children}
            </CustomBody>
          </ModalDialog>
        )
      )
    }
    `,
    'should inline values of WidthNames in both type and interface declarations and remove shared-variables import',
  );
});
