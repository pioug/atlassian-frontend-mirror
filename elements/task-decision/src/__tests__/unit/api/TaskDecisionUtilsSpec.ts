import { serviceTask } from '../_test-data';
import { convertServiceTaskToTask } from '../../../api/TaskDecisionUtils';

describe('TaskDecisionUtils', () => {
  it('convertServiceTaskToTask', () => {
    const task = convertServiceTaskToTask(serviceTask);
    const {
      creationDate,
      creator,
      lastUpdater,
      lastUpdateDate,
      localId,
      objectAri,
      participants,
      state,
    } = task;

    expect(creator).toEqual(serviceTask.creatorId);
    expect(lastUpdater).toEqual(serviceTask.lastUpdaterId);
    expect(localId).toEqual(serviceTask.localId);
    expect(objectAri).toEqual(serviceTask.objectAri);
    expect(participants).toEqual(serviceTask.participants);
    expect(state).toEqual(serviceTask.state);

    expect(creationDate).toEqual(
      (serviceTask.creationDate && new Date(serviceTask.creationDate)) ||
        undefined,
    );
    expect(lastUpdateDate).toEqual(new Date(serviceTask.lastUpdateDate));
  });
});
