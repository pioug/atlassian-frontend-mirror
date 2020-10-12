import { shallow } from 'enzyme';
import React from 'react';
import { MentionDescription } from '../../../../types';
import MentionDescriptionByline from '../../../../components/MentionDescriptionByline';
import { userMention, teamMention } from './_commonData';

const shallowRender = (mention: MentionDescription) =>
  shallow(<MentionDescriptionByline mention={mention} />);

describe('Mention Description Byline', () => {
  it('should render User Mention description if a user is provided', () => {
    const component = shallowRender(userMention);
    expect(component).toMatchSnapshot();
  });

  it('should render Team Mention description if a team is provided', () => {
    const component = shallowRender(teamMention);
    expect(component).toMatchSnapshot();
  });
});
