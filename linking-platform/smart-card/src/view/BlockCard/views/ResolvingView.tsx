/** @jsx jsx */
import { jsx } from '@emotion/react';

import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';
import { N50, N90 } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { Frame } from '../components/Frame';
import { gs } from '../../common/utils';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../messages';

export interface ResolvingProps {
  isSelected?: boolean;
  testId?: string;
  inheritDimensions?: boolean;
}

export const blockCardResolvingViewClassName = 'block-card-resolving-view';

export const ResolvingView = ({
  isSelected = false,
  testId = 'block-card-resolving-view',
  inheritDimensions,
}: ResolvingProps) => (
  <Frame
    inheritDimensions={inheritDimensions}
    compact={true}
    isSelected={isSelected}
    testId={testId}
    className={blockCardResolvingViewClassName}
  >
    <DocumentFilledIcon
      size="small"
      primaryColor={token('color.icon.subtle', N50)}
      label="document-icon"
    />
    <span
      css={{
        fontSize: `${fontSize()}px`,
        color: token('color.text.subtlest', N90),
        marginLeft: gs(0.5),
      }}
    >
      <FormattedMessage {...messages.loading} />
    </span>
  </Frame>
);
