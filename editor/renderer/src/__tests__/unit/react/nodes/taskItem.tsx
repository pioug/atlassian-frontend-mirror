import React from 'react';
import { mount, shallow } from 'enzyme';
import { ResourcedTaskItem as AkTaskItem } from '@atlaskit/task-decision';
import FabricAnalyticsListener, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import TaskItem from '../../../../react/nodes/taskItem';
import ReactSerializer from '../../../../react';

describe('Renderer - React/Nodes/TaskItem', () => {
  let analyticsWebClientMock: AnalyticsWebClient;
  let serialiser = new ReactSerializer({});

  beforeEach(() => {
    analyticsWebClientMock = {
      sendUIEvent: jest.fn(),
      sendOperationalEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
    };
  });

  it('should wrap content with <AkTaskItem>-tag', () => {
    const text = 'This is a task item';
    const taskItem = mount(
      <TaskItem
        marks={[]}
        serializer={serialiser}
        nodeType="taskItem"
        dataAttributes={{ 'data-renderer-start-pos': 0 }}
        localId="task-1"
      >
        {text}
      </TaskItem>,
    );
    expect(taskItem.find(AkTaskItem).length).toEqual(1);
    taskItem.unmount();
  });

  it('should render if no children', () => {
    const taskItem = shallow(
      <TaskItem
        marks={[]}
        serializer={serialiser}
        nodeType="taskItem"
        dataAttributes={{ 'data-renderer-start-pos': 0 }}
        localId="task-2"
      />,
    );
    expect(taskItem.isEmptyRender()).toEqual(false);
  });

  describe('analytics', () => {
    it('check action fires an event', () => {
      const component = mount(
        <FabricAnalyticsListener client={analyticsWebClientMock}>
          <TaskItem
            marks={[]}
            serializer={serialiser}
            nodeType="taskItem"
            dataAttributes={{ 'data-renderer-start-pos': 0 }}
            localId="task-1"
          >
            Hello <b>world</b>
          </TaskItem>
        </FabricAnalyticsListener>,
      );
      component.find('input').simulate('change');
      expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
      expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'checked',
          actionSubject: 'action',
          attributes: {
            localId: 'task-1',
            objectAri: '',
            userContext: 'document',
          },
        }),
      );
    });

    it('uncheck action fires an event', () => {
      const component = mount(
        <FabricAnalyticsListener client={analyticsWebClientMock}>
          <TaskItem
            marks={[]}
            serializer={serialiser}
            nodeType="taskItem"
            dataAttributes={{ 'data-renderer-start-pos': 0 }}
            localId="task-1"
            state="DONE"
          >
            Hello <b>world</b>
          </TaskItem>
        </FabricAnalyticsListener>,
      );
      component.find('input').simulate('change');
      expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledTimes(1);
      expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'unchecked',
          actionSubject: 'action',
          attributes: {
            localId: 'task-1',
            objectAri: '',
            userContext: 'document',
          },
        }),
      );
    });
  });
});
