import React, { type Dispatch, type SetStateAction, useEffect } from 'react';

import type { ManualRule } from '../../../manual-triggers-container/common/types';
import { useAutomationMenu } from '../../menu-context';
import { Skeleton } from '../skeleton';
import { AutomationModalErrorState } from '../error-state';
import { AutomationModalRuleList } from '../rule-list';

type AutomationModalBodyProps = {
  selectedRule: ManualRule | undefined;
  setSelectedRule: Dispatch<SetStateAction<ManualRule | undefined>>;
};

export const AutomationModalBody = ({
  selectedRule,
  setSelectedRule,
}: AutomationModalBodyProps) => {
  const { triggerFetch, initialised, rules, fetchError } = useAutomationMenu();

  useEffect(() => {
    void triggerFetch();
    // Want to ensure that triggerFetch is only called once when the component is mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!initialised) {
    return <Skeleton lineCount={10} />;
  } else if (fetchError && rules.length === 0) {
    return <AutomationModalErrorState />;
  }

  return (
    <AutomationModalRuleList
      selectedRule={selectedRule}
      setSelectedRule={setSelectedRule}
    />
  );
};
