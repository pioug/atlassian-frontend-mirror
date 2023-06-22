import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import Avatar from '@atlaskit/avatar';

import avatarImg from '../../../../examples/utils/sample-avatar';
import CommentAction from '../../../../src/components/action-item';
import CommentAuthor from '../../../../src/components/author';
import CommentEdited from '../../../../src/components/edited';
import CommentTime from '../../../../src/components/time';
import Comment from '../../comment';
import Footer from '../../footer';
import Header from '../../header';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

const actions = [
  <CommentAction>Reply</CommentAction>,
  <CommentAction>Edit</CommentAction>,
  <CommentAction>Like</CommentAction>,
];

it('Basic Comment should not fail aXe audit', async () => {
  const { container } = render(
    <Comment
      avatar={<Avatar src={avatarImg} name="John Smith" size="medium" />}
      author={<CommentAuthor>John Smith</CommentAuthor>}
      type="author"
      edited={<CommentEdited>Edited</CommentEdited>}
      restrictedTo="Restricted to Admins Only"
      time={<CommentTime>30 August, 2023</CommentTime>}
      content={
        <p>
          Content goes here. This can include <a href="/link">links</a> and
          other content.
        </p>
      }
      actions={actions}
    />,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Basic Header should not fail aXe audit', async () => {
  const { container } = render(
    <Header
      author={<CommentAuthor>John Smith</CommentAuthor>}
      type="author"
      edited={<CommentEdited>Edited</CommentEdited>}
      restrictedTo="Restricted to Admins Only"
      time={<CommentTime>30 August, 2023</CommentTime>}
      headingLevel="3"
    />,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Basic Footer should not fail aXe audit', async () => {
  const { container } = render(
    <Footer actions={actions} errorIconLabel={''} isSaving={true} />,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});
