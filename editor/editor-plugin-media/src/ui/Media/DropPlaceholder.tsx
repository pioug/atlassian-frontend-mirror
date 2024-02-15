/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { hexToRgba } from '@atlaskit/adf-schema';
import { dropPlaceholderMessages } from '@atlaskit/editor-common/media';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';
import { B200, B300, B400 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { FILE_WIDTH, MEDIA_HEIGHT } from '../../nodeviews/mediaNodeView/media';

const iconWrapper = css`
  color: ${token('color.icon.accent.blue', hexToRgba(B400, 0.4) || B400)};
  background: ${token(
    'color.background.accent.blue.subtle',
    hexToRgba(B300, 0.6) || B300,
  )};
  border-radius: ${borderRadius()}px;
  margin: 5px 3px 25px;
  width: ${FILE_WIDTH}px;
  min-height: ${MEDIA_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const dropLine = css`
  background: ${token('color.border.focused', B200)};
  border-radius: ${borderRadius()}px;
  margin: ${token('space.025', '2px')} 0;
  width: 100%;
  height: 2px;
`;

export type PlaceholderType = 'single' | 'group';
export interface Props {
  type: PlaceholderType;
}

const IconWrapperComponent = (props: WrappedComponentProps) => {
  const { intl } = props;
  const { dropPlaceholderLabel } = dropPlaceholderMessages;

  return (
    <div css={iconWrapper}>
      <DocumentFilledIcon
        label={intl.formatMessage(dropPlaceholderLabel)}
        size="medium"
      />
    </div>
  );
};

const IntlIconWrapper = injectIntl(IconWrapperComponent);

export default ({ type = 'group' }: Props) =>
  type === 'single' ? <div css={dropLine} /> : <IntlIconWrapper />;
