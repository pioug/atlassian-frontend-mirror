import React, { Fragment } from 'react';

export const users = [
  'Daniel Del Core',
  'Greg Smith',
  'Luke Underwood',
  'Meng Xiao',
  'Stephen Mok',
];

const MAX_USERS_DISPLAYED = 5;

export const ReactionsList = ({ reactions }: { reactions: number }) => {
  const numberOfUsersDisplayed = Math.min(reactions, MAX_USERS_DISPLAYED);
  return (
    <Fragment>
      {users.slice(0, numberOfUsersDisplayed).map(user => (
        <Fragment key={user}>
          <br />
          {user}
        </Fragment>
      ))}
      {numberOfUsersDisplayed < reactions && (
        <>
          <br />
          and {reactions - MAX_USERS_DISPLAYED} others
        </>
      )}
    </Fragment>
  );
};
