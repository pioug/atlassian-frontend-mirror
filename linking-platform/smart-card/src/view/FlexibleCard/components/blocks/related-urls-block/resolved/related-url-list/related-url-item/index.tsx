import React, { useMemo } from 'react';

import { Inline } from '@atlaskit/primitives';

import { SmartLinkSize } from '../../../../../../../../constants';
import extractFlexibleUiContext from '../../../../../../../../extractors/flexible';
import Icon from '../../../../../elements/icon';
import Link from '../../../../../elements/link';
import { ResolvedResultItemProps } from './types';

const RelatedUrlItem: React.FC<ResolvedResultItemProps> = ({
  results,
  renderers,
  testId,
}) => {
  const flexibleDataContext = useMemo(
    () =>
      extractFlexibleUiContext({
        response: results,
        renderers,
      }),
    [renderers, results],
  );

  return (
    <Inline alignBlock="center" space="space.050" testId={testId}>
      <Icon
        {...flexibleDataContext?.linkIcon}
        testId={`${testId}-icon`}
        size={SmartLinkSize.Small}
      />
      <Link
        testId={`${testId}-link`}
        text={flexibleDataContext?.title}
        url={flexibleDataContext?.url}
        size={SmartLinkSize.Small}
        maxLines={1}
      />
    </Inline>
  );
};

export default RelatedUrlItem;
