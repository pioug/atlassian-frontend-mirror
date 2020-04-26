import { render } from '../../__mocks__/render';
import { extractIconFromTask } from '../extractIconFromTask';
import { mount } from 'enzyme';
import {
  JIRA_GENERATOR_ID,
  JIRA_TASK,
  JIRA_SUB_TASK,
  JIRA_STORY,
  JIRA_BUG,
  JIRA_EPIC,
  JIRA_INCIDENT,
  JIRA_SERVICE_REQUEST,
  JIRA_CHANGE,
  JIRA_PROBLEM,
  JIRA_CUSTOM_TASK_TYPE,
} from '../../../constants';
import { TEST_URL } from '../../__mocks__/jsonld';

describe('extractors.icon.task', () => {
  it('returns default icon if no opts given', () => {
    const icon = extractIconFromTask({});
    expect(mount(render(icon)).find('Task16Icon')).toHaveLength(1);
  });

  it('returns jira icon if jira task', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_TASK },
    });
    expect(mount(render(icon)).find('Task16Icon')).toHaveLength(1);
  });

  it('returns jira icon if jira sub task', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_SUB_TASK },
    });
    expect(mount(render(icon)).find('Subtask16Icon')).toHaveLength(1);
  });

  it('returns jira icon if jira story', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_STORY },
    });
    expect(mount(render(icon)).find('Story16Icon')).toHaveLength(1);
  });

  it('returns jira icon if jira bug', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_BUG },
    });
    expect(mount(render(icon)).find('Bug16Icon')).toHaveLength(1);
  });

  it('returns jira icon if jira epic', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_EPIC },
    });
    expect(mount(render(icon)).find('Epic16Icon')).toHaveLength(1);
  });

  it('returns jira icon if jira incident', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_INCIDENT },
    });
    expect(mount(render(icon)).find('Incident16Icon')).toHaveLength(1);
  });

  it('returns jira icon if jira service request', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_SERVICE_REQUEST },
    });
    expect(mount(render(icon)).find('Issue16Icon')).toHaveLength(1);
  });

  it('returns jira icon if jira change', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_CHANGE },
    });
    expect(mount(render(icon)).find('Changes16Icon')).toHaveLength(1);
  });

  it('returns jira icon if jira problem', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_PROBLEM },
    });
    expect(mount(render(icon)).find('Problem16Icon')).toHaveLength(1);
  });

  it('returns icon if jira custom task - task type icon defined', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_CUSTOM_TASK_TYPE, icon: TEST_URL },
    });
    expect(icon).toBe(TEST_URL);
  });

  it('returns icon if jira custom task - top-level icon defined', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_CUSTOM_TASK_TYPE },
      icon: TEST_URL,
    });
    expect(icon).toBe(TEST_URL);
  });

  it('returns icon if jira custom task - provider icon defined', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira', icon: TEST_URL },
      taskType: { id: JIRA_CUSTOM_TASK_TYPE },
    });
    expect(icon).toBe(TEST_URL);
  });

  it('returns icon if jira custom task - default fallback icon', () => {
    const icon = extractIconFromTask({
      provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
      taskType: { id: JIRA_CUSTOM_TASK_TYPE },
    });
    expect(mount(render(icon)).find('Task16Icon')).toHaveLength(1);
  });
});
