/** @jsx jsx */
import { jsx } from '@emotion/core';

import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';
import { N50, N90 } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';

import { Frame } from '../components/Frame';
import { gs } from '../utils';
import { FormattedMessage } from 'react-intl';
import { messages } from '../../messages';

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
    <DocumentFilledIcon size="small" primaryColor={N50} label="document-icon" />
    <span
      css={{
        fontSize: `${fontSize()}px`,
        color: N90,
        marginLeft: gs(0.5),
      }}
    >
      <FormattedMessage {...messages.loading} />
    </span>
  </Frame>
);
