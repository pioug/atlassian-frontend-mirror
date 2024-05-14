/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { openHelp } from '@atlaskit/editor-common/keymaps';
import { helpDialogMessages as messages } from '@atlaskit/editor-common/messages';

import { footer } from './styles';
import { getComponentFromKeymap } from './utils';

const ModalFooter = () => (
  <div css={footer}>
    <FormattedMessage
      {...messages.helpDialogTips}
      values={{ keyMap: getComponentFromKeymap(openHelp) }}
    />
  </div>
);

export default ModalFooter;
