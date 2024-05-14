/** @jsx jsx */
/** @jsxFrag */
import React from 'react';

import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { helpDialogMessages as messages } from '@atlaskit/editor-common/messages';
import { browser } from '@atlaskit/editor-common/utils';
import type { OnCloseHandler } from '@atlaskit/modal-dialog';

import type Format from './Format';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';
import { column, content, contentWrapper, line, row, title } from './styles';
import { getComponentFromKeymap, shortcutNamesWithoutKeymap } from './utils';

interface ModalContentProps {
  formatting: Format[];
  onClose: OnCloseHandler | undefined;
}

export const ModalContent = ({ formatting, onClose }: ModalContentProps) => {
  return (
    <>
      <ModalHeader onClose={onClose} />
      <div css={contentWrapper}>
        <div css={line} />
        <div css={content}>
          <div css={column}>
            <h2 css={title}>
              <FormattedMessage {...messages.keyboardShortcuts} />
            </h2>
            <ul>
              {formatting
                .filter(form => {
                  const keymap = form.keymap && form.keymap();
                  return keymap && keymap[browser.mac ? 'mac' : 'windows'];
                })
                .map(form => (
                  <li css={row} key={`textFormatting-${form.name}`}>
                    <span>{form.name}</span>
                    {getComponentFromKeymap(form.keymap!())}
                  </li>
                ))}

              {formatting
                .filter(
                  form => shortcutNamesWithoutKeymap.indexOf(form.type) !== -1,
                )
                .filter(form => form.autoFormatting)
                .map(form => (
                  <li css={row} key={`autoFormatting-${form.name}`}>
                    <span>{form.name}</span>
                    {form.autoFormatting!()}
                  </li>
                ))}
            </ul>
          </div>
          <div css={line} />
          <div css={column}>
            <h2 css={title}>
              <FormattedMessage {...messages.markdown} />
            </h2>
            <ul>
              {formatting
                .filter(
                  form => shortcutNamesWithoutKeymap.indexOf(form.type) === -1,
                )
                .map(
                  form =>
                    form.autoFormatting && (
                      <li key={`autoFormatting-${form.name}`} css={row}>
                        <span>{form.name}</span>
                        {form.autoFormatting()}
                      </li>
                    ),
                )}
            </ul>
          </div>
        </div>
      </div>
      <ModalFooter />
    </>
  );
};

export default ModalContent;
