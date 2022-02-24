import React from 'react';
import { FooterBlockProps } from './types';
import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkStatus,
  SmartLinkWidth,
} from '../../../../../constants';
import Block from '../block';
import ElementGroup from '../element-group';
import { Provider } from '../../elements';
import ActionGroup from '../action-group';

const FooterBlock: React.FC<FooterBlockProps> = (props) => {
  const { status, actions, testId = 'smart-footer-block' } = props;
  if (status !== SmartLinkStatus.Resolved) {
    return null;
  }

  return (
    <Block {...props} testId={`${testId}-resolved-view`}>
      <Provider testId={`${testId}-provider`} />
      {actions && actions.length > 0 ? (
        <ElementGroup
          testId="smart-element-group-actions"
          align={SmartLinkAlignment.Right}
          direction={SmartLinkDirection.Horizontal}
          width={SmartLinkWidth.Flexible}
        >
          <ActionGroup items={actions} appearance="default" />
        </ElementGroup>
      ) : null}
    </Block>
  );
};

export default FooterBlock;
