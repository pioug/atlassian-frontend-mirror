import { useMemo } from 'react';

import { TaskDecisionProvider } from '@atlaskit/task-decision';

import { createTaskDecisionProvider } from '../../providers';

export function useTaskAndDecision(): Promise<TaskDecisionProvider> {
  return useMemo(() => {
    return Promise.resolve(createTaskDecisionProvider());
  }, []);
}
