import React from 'react';
import { TitleBlockProps } from './types';
import { SmartLinkStatus } from '../../../../../constants';
import TitleBlockResolvedView from './resolved';
import TitleBlockErroredView from './errored';
import TitleBlockResolvingView from './resolving';

const TitleBlock: React.FC<TitleBlockProps> = ({
  status = SmartLinkStatus.Fallback,
  testId = 'smart-block-title',
  ...props
}) => {
  switch (status) {
    case SmartLinkStatus.Pending:
    case SmartLinkStatus.Resolving:
      return <TitleBlockResolvingView {...props} testId={testId} />;
    case SmartLinkStatus.Resolved:
      return <TitleBlockResolvedView {...props} testId={testId} />;
    case SmartLinkStatus.Unauthorized:
    case SmartLinkStatus.Forbidden:
    case SmartLinkStatus.NotFound:
    case SmartLinkStatus.Errored:
    case SmartLinkStatus.Fallback:
    default:
      return <TitleBlockErroredView {...props} testId={testId} />;
  }
};

export default TitleBlock;
