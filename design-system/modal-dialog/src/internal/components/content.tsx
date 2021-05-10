/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import ScrollLock from 'react-scrolllock';

import warnOnce from '@atlaskit/ds-lib/warn-once';

import { bodyStyles, wrapperStyles } from '../styles/content';
import { KeyboardOrMouseEvent, ModalDialogProps } from '../types';

import Footer from './footer';
import Header from './header';
import ScrollContainer from './scroll-container';

type ForcedRequired = 'onClose';

interface ContentProps
  extends Omit<ModalDialogProps, ForcedRequired>,
    Required<Pick<ModalDialogProps, ForcedRequired>> {
  shouldScroll: boolean;
  headingId: string;
  onClose: (e: KeyboardOrMouseEvent) => void;
}

const emptyObject: Required<ContentProps>['components'] = {};

export default function Content(props: ContentProps) {
  const {
    actions,
    appearance,
    body: DeprecatedBody,
    children,
    components = emptyObject,
    footer,
    header,
    heading,
    isChromeless,
    isHeadingMultiline,
    onClose,
    shouldScroll,
    testId,
    headingId,
    stackIndex,
  } = props;

  const { Container = 'div', Body: CustomBody } = components;
  const Body = CustomBody || DeprecatedBody || 'div';

  if (process.env.NODE_ENV !== 'production') {
    if (header) {
      warnOnce(
        "@atlaskit/modal-dialog: Deprecation warning - Use of the header prop in ModalDialog is deprecated. Please compose your ModalDialog using the 'components' prop instead",
      );
    }

    if (footer) {
      warnOnce(
        "@atlaskit/modal-dialog: Deprecation warning - Use of the footer prop in ModalDialog is deprecated. Please compose your ModalDialog using the 'components' prop instead",
      );
    }

    if (DeprecatedBody) {
      warnOnce(
        "@atlaskit/modal-dialog: Deprecation warning - Use of the body prop in ModalDialog is deprecated. Please compose your ModalDialog using the 'components' prop instead",
      );
    }
  }

  return (
    <Container
      css={wrapperStyles}
      data-modal-stack={stackIndex}
      data-testid={testId}
    >
      {isChromeless ? (
        children
      ) : (
        <React.Fragment>
          <Header
            id={headingId}
            appearance={appearance}
            component={components.Header ? components.Header : header}
            heading={heading}
            onClose={onClose}
            isHeadingMultiline={isHeadingMultiline}
            testId={testId}
          />
          <ScrollLock>
            <ScrollContainer shouldScroll={shouldScroll} testId={testId}>
              <Body css={bodyStyles} data-testid={testId && `${testId}--body`}>
                {children}
              </Body>
            </ScrollContainer>
          </ScrollLock>
          <Footer
            actions={actions}
            appearance={appearance}
            component={components.Footer ? components.Footer : footer}
            onClose={onClose}
            testId={testId}
          />
        </React.Fragment>
      )}
    </Container>
  );
}
