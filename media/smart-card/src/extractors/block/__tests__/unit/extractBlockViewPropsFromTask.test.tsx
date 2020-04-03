import React from 'react';
import { mount } from 'enzyme';

import { atlassianTask } from './_fixtures';
import {
  buildTaskTitle,
  buildTaskDescription,
  buildTaskLink,
  buildTaskByline,
  buildTaskUsers,
  buildTaskCommentCount,
  buildTaskContext,
} from '../../extractPropsFromTask';
import { FormattedRelative, IntlProvider } from 'react-intl';
import { buildTaskLozenge } from '../../../utils/task';

describe('extractPropsFromTask()', () => {
  describe('build a title', () => {
    it('should not fail for empty input', () => {
      expect(buildTaskTitle({})).toEqual({ title: '' });
    });

    it('should build a title', () => {
      expect(buildTaskTitle(atlassianTask)).toEqual({
        title: atlassianTask.name,
      });
    });
  });

  describe('build a description', () => {
    it('should not fail for empty input', () => {
      expect(buildTaskDescription({})).toEqual({ description: '' });
    });

    it('should build a title', () => {
      expect(buildTaskDescription(atlassianTask)).toEqual({
        description: atlassianTask.summary,
      });
    });
  });

  describe('build a link', () => {
    it('should not fail for empty input', () => {
      expect(buildTaskLink({})).toEqual({ link: undefined });
    });

    it('should build a link', () => {
      expect(buildTaskLink(atlassianTask)).toEqual({ link: atlassianTask.url });
    });
  });

  describe('build a byline', () => {
    it('should not fail for empty input', () => {
      expect(buildTaskByline({})).toEqual({});
    });

    it("should include 'updated by user' in byline", () => {
      const mock = {
        updated: '2018-07-27T11:14:57.392Z',
        updatedBy: {
          name: 'Test User',
        },
        dateCreated: '2018-06-27T11:14:57.392Z',
      };
      const props = buildTaskByline(mock);
      expect(props).toHaveProperty('byline');

      const byline = props.byline as React.ReactElement<any>;
      const wrapper = mount(<IntlProvider locale="en">{byline}</IntlProvider>);
      expect(wrapper.find(FormattedRelative).prop('value')).toEqual(
        '2018-07-27T11:14:57.392Z',
      );
      expect(wrapper.text()).toContain('Updated  by Test User');
    });

    it("should include 'updated' in byline", () => {
      const mock = {
        updated: '2018-07-27T11:14:57.392Z',
        dateCreated: '2018-06-27T11:14:57.392Z',
      };
      const props = buildTaskByline(mock);
      expect(props).toHaveProperty('byline');

      const byline = props.byline as React.ReactElement<any>;
      const wrapper = mount(<IntlProvider locale="en">{byline}</IntlProvider>);
      expect(wrapper.find(FormattedRelative).prop('value')).toEqual(
        '2018-07-27T11:14:57.392Z',
      );
      expect(wrapper.text()).toContain('Updated');
    });

    it("should include 'created by user' in byline", () => {
      const mock = {
        dateCreated: '2018-06-27T11:14:57.392Z',
        attributedTo: {
          name: 'Test User',
        },
      };
      const props = buildTaskByline(mock);
      expect(props).toHaveProperty('byline');

      const byline = props.byline as React.ReactElement<any>;
      const wrapper = mount(<IntlProvider locale="en">{byline}</IntlProvider>);
      expect(wrapper.find(FormattedRelative).prop('value')).toEqual(
        '2018-06-27T11:14:57.392Z',
      );
      expect(wrapper.text()).toContain('Created  by Test User');
    });
  });

  describe('build a users', () => {
    it('should not fail for empty input', () => {
      expect(buildTaskUsers({})).toEqual({});
    });

    it('should handle array only', () => {
      const mock = {
        assignedTo: {},
      };
      expect(buildTaskUsers(mock)).toEqual({});
    });

    it('should handle non-array only', () => {
      const mock = {
        assignedTo: [],
      };
      expect(buildTaskUsers(mock)).toEqual({});
    });

    it('should handle non-array only', () => {
      const mock = {
        assignedTo: [
          {
            image: 'user.jpg',
            name: 'The User',
          },
        ],
      };
      expect(buildTaskUsers(mock)).toEqual({
        users: [
          {
            icon: mock.assignedTo[0].image,
            name: mock.assignedTo[0].name,
          },
        ],
      });
    });
  });

  describe('build a comment count', () => {
    it('should not fail for empty input', () => {
      expect(buildTaskCommentCount({})).toEqual(undefined);
    });

    it('should build comment count out of a string', () => {
      const mock = {
        commentCount: '123',
      };
      expect(buildTaskCommentCount(mock)!.text).toEqual('123');
      expect(buildTaskCommentCount(mock)!.icon).toBeDefined();
    });

    it('should build comment count out of a number', () => {
      const mock = {
        commentCount: 123,
      };
      expect(buildTaskCommentCount(mock)!.text).toEqual('123');
      expect(buildTaskCommentCount(mock)!.icon).toBeDefined();
    });
  });

  describe('build details lozenge', () => {
    it('should not fail for empty input', () => {
      expect(buildTaskCommentCount({})).toEqual(undefined);
    });

    it('should build a lozenge', () => {
      const mock = {
        'atlassian:taskStatus': {
          name: 'abc',
        },
      };
      expect(buildTaskLozenge(mock)).toEqual({
        lozenge: {
          text: mock['atlassian:taskStatus'].name,
          appearance: 'success',
        },
      });
    });
  });

  describe('build context', () => {
    it('should handle empty input', () => {
      expect(buildTaskContext({})).toEqual({});
    });

    it('should handle empty input', () => {
      const mock = {
        generator: {
          name: 'test gen',
          icon: 'gen.jpg',
        },
        context: {
          name: 'test cotnext',
        },
      };
      expect(buildTaskContext(mock)).toEqual({
        context: {
          text: `${mock.generator.name} / ${mock.context.name}`,
          icon: mock.generator.icon,
        },
      });
    });
  });
});
