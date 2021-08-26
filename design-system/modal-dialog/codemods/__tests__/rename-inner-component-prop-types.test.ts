import { createTransformer } from '@atlaskit/codemod-utils';

import { renameInnerComponentPropTypes } from '../migrations/rename-inner-component-prop-types';

const transformer = createTransformer([renameInnerComponentPropTypes]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

// Only testing for tsx here because it's modifying types
describe('rename inner component prop types', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import {
      HeaderComponentProps,
      BodyComponentProps,
      FooterComponentProps,
      TitleComponentProps,
    } from '@atlaskit/modal-dialog';
    `,
    `
    import React from 'react';
    import {
      ModalHeaderProps as HeaderComponentProps,
      ModalBodyProps as BodyComponentProps,
      ModalFooterProps as FooterComponentProps,
      ModalTitleProps as TitleComponentProps,
    } from '@atlaskit/modal-dialog';
    `,
    'should create aliases for (Header/Body/Footer/Title)ComponentProps as Modal(Header/Body/Footer/Title)Props',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import ModalDialog, {
      HeaderComponentProps,
      BodyComponentProps,
      FooterComponentProps,
      TitleComponentProps,
    } from '@atlaskit/modal-dialog';
    `,
    `
    import React from 'react';
    import ModalDialog, {
      ModalHeaderProps as HeaderComponentProps,
      ModalBodyProps as BodyComponentProps,
      ModalFooterProps as FooterComponentProps,
      ModalTitleProps as TitleComponentProps,
    } from '@atlaskit/modal-dialog';
    `,
    'should create aliases when imported with a default import',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import ModalDialog, {
      HeaderComponentProps as CustomHeaderProps,
      BodyComponentProps as CustomBodyProps,
      FooterComponentProps as CustomFooterProps,
      TitleComponentProps as CustomTitleProps,
    } from '@atlaskit/modal-dialog';
    `,
    `
    import React from 'react';
    import ModalDialog, {
      ModalHeaderProps as CustomHeaderProps,
      ModalBodyProps as CustomBodyProps,
      ModalFooterProps as CustomFooterProps,
      ModalTitleProps as CustomTitleProps,
    } from '@atlaskit/modal-dialog';
    `,
    'should preserve old alias names',
  );
});
