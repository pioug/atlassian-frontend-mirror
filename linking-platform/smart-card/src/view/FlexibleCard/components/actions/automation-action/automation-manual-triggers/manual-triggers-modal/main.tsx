import React, { useEffect, useState } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Modal, { ModalBody, ModalFooter } from '@atlaskit/modal-dialog';

import type { ManualRule } from '../manual-triggers-container/common/types';
import { AutomationMenuContextContainer } from './menu-context';

import { AutomationModalHeader } from './sub-components/header';
import { AutomationModalBody } from './sub-components/body';
import { AutomationModalExecutionState } from './sub-components/execution-state-message';
import { AutomationModalFooter } from './sub-components/footer';

export type AutomationModalProps = {
  baseAutomationUrl: string;
  objectAri: string;
  siteAri: string;
  canManageAutomation: boolean;
  analyticsSource: string;
  modalTitle: React.ReactNode;
  modalDescription?: React.ReactNode;
  emptyStateDescription?: React.ReactNode;
  emptyStateAdminDescription?: React.ReactNode;
  onClose: () => void;
  onCloseComplete?: () => void;
};

export const AutomationModal = ({
  baseAutomationUrl,
  siteAri,
  objectAri,
  canManageAutomation,
  onClose,
  onCloseComplete,
  modalTitle,
  modalDescription,
  emptyStateDescription,
  emptyStateAdminDescription,
  analyticsSource,
}: AutomationModalProps) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const [selectedRule, setSelectedRule] = useState<ManualRule | undefined>();

  useEffect(() => {
    createAnalyticsEvent({
      type: 'sendScreenEvent',
      data: {
        name: analyticsSource,
      },
    }).fire();
  }, [createAnalyticsEvent, analyticsSource]);

  return (
    <AutomationMenuContextContainer
      baseAutomationUrl={baseAutomationUrl}
      objectAri={objectAri}
      siteAri={siteAri}
      canManageAutomation={canManageAutomation}
      analyticsSource={analyticsSource}
      emptyStateDescription={emptyStateDescription}
      emptyStateAdminDescription={emptyStateAdminDescription}
      onRuleInvocationSuccess={onClose}
      onRuleInvocationFailure={() => setSelectedRule(undefined)}
    >
      {() => {
        return (
          <Modal
            onClose={onClose}
            onCloseComplete={onCloseComplete}
            width={600}
            height={480}
            testId='smart-card-automation-action-modal'
          >
            <AutomationModalHeader
              modalTitle={modalTitle}
              modalDescription={modalDescription}
            />
            <ModalBody>
              <AutomationModalBody
                selectedRule={selectedRule}
                setSelectedRule={setSelectedRule}
              />
            </ModalBody>
            <AutomationModalExecutionState />
            <ModalFooter>
              <AutomationModalFooter
                selectedRule={selectedRule}
                onClose={onClose}
              />
            </ModalFooter>
          </Modal>
        );
      }}
    </AutomationMenuContextContainer>
  );
};
