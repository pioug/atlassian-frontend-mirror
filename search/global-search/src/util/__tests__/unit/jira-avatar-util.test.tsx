import React from 'react';
import { shallow } from 'enzyme';
import BoardIcon from '@atlaskit/icon/glyph/board';
import IssueIcon from '@atlaskit/icon/glyph/issue';
import FilterIcon from '@atlaskit/icon/glyph/filter';

import { getDefaultAvatar } from '../../jira-avatar-util';
import { ContentType } from '../../../model/Result';

const renderAvatar = (avatar: JSX.Element | null) => {
  const Wrapper = (props: { children: React.ReactNode }) => (
    <div>{props.children}</div>
  );
  return shallow(<Wrapper>{avatar}</Wrapper>);
};

describe('Default Jira Avatar', () => {
  [
    { contentType: ContentType.JiraBoard, icon: BoardIcon },
    { contentType: ContentType.JiraIssue, icon: IssueIcon },
    { contentType: ContentType.JiraFilter, icon: FilterIcon },
  ].forEach(({ contentType, icon }) => {
    it(`should return ${contentType} icon`, () => {
      const avatar = getDefaultAvatar(contentType);
      expect(avatar).toBeDefined();
      const wrapper = renderAvatar(avatar);
      expect(wrapper.find(icon).length).toBe(1);
    });
  });

  [null, undefined, ContentType.ConfluencePage].forEach(
    notValidJiraContentType => {
      it('should return null for unsupported content types', () => {
        const avatar = getDefaultAvatar(notValidJiraContentType as ContentType);
        expect(avatar).toBe(null);
      });
    },
  );
});
