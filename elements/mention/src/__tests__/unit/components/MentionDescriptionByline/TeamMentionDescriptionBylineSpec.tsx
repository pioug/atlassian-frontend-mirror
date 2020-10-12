import { render } from 'enzyme';
import React from 'react';
import TeamMentionDescriptionByline from '../../../../components/MentionDescriptionByline';
import { MentionDescription } from '../../../..//types';
import { teamMention } from './_commonData';

const renderByline = (teamData: MentionDescription) => {
  return render(<TeamMentionDescriptionByline mention={teamData} />);
};

const buildTeamData = (memberCount: number, includesYou: boolean) => ({
  ...teamMention,
  context: {
    members: [
      {
        id: 'user-1234',
        name: 'Test User',
      },
    ],
    ...teamMention.context,
    includesYou: includesYou,
    memberCount: memberCount,
    teamLink: '/wiki/people/team/12345',
  },
});

describe('Team mention description', () => {
  it('should render Team Mention description component with less than 50 members, includes you', () => {
    const component = renderByline(buildTeamData(5, true));
    expect(component).toMatchSnapshot();
  });

  it('should render Team Mention description component with more than 50 members, includes you', () => {
    const component = renderByline(buildTeamData(55, true));
    expect(component).toMatchSnapshot();
  });

  it('should render Team Mention description component with less than 50 members, not including you', () => {
    const component = renderByline(buildTeamData(4, false));
    expect(component).toMatchSnapshot();
  });

  it('should render Team Mention description component with more than 50 members, not including you', () => {
    const component = renderByline(buildTeamData(100, false));
    expect(component).toMatchSnapshot();
  });

  it('should not render Team Mention description component if context is not given', () => {
    const newMention = { ...teamMention };
    delete newMention.context;

    const component = renderByline(newMention);
    expect(component).toMatchSnapshot();
  });
});
