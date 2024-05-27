import React from 'react';
import { SmartCardProvider } from '@atlaskit/link-provider';
import VRTestWrapper from '../utils/vr-test-wrapper';
import LozengeActionItemsGroup from '../../src/view/FlexibleCard/components/elements/lozenge/lozenge-action/lozenge-action-items-group';
import { type LozengeItem } from '../../src/view/FlexibleCard/components/elements/lozenge/lozenge-action/types';

const items: LozengeItem[] = [
  { id: '1', text: 'In Progress', appearance: 'inprogress' },
  { id: '2', text: 'Done', appearance: 'success' },
  { id: '3', text: 'To Do', appearance: 'default' },
  { id: '4', text: 'Explore', appearance: 'default' },
  { id: '5', text: 'In Review', appearance: 'inprogress' },
];

export default () => (
  <VRTestWrapper>
    <SmartCardProvider>
      <LozengeActionItemsGroup items={items} />
    </SmartCardProvider>
  </VRTestWrapper>
);
