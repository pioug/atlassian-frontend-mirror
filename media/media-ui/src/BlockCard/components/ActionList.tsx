/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';

import Item from '@atlaskit/item';
import DropList from '@atlaskit/droplist';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import { ActionProps, Action } from './Action';
import { gs, mq } from '../utils';

export interface ActionListProps {
  /* An array of action props, which will generate action buttons with the first passed appearing on the left (in LTR reading) */
  items: Array<ActionProps>;
}

export const ActionList = ({ items }: ActionListProps) => {
  const [isOpen, setOpen] = useState(false);

  const actionsToShow = items.slice(0, 2);
  const actionsToList = items.slice(2, items.length);

  return (
    <div css={mq({ display: 'flex', marginTop: [gs(2), 0] })}>
      <ButtonGroup>
        {actionsToShow.map((action) => (
          <Action key={action.id} {...action} />
        ))}
      </ButtonGroup>
      {actionsToList.length ? (
        <div css={{ marginLeft: gs(0.5) }}>
          <DropList
            appearance="default"
            position="right top"
            isTriggerNotTabbable
            onOpenChange={() => setOpen(true)}
            onClick={() => setOpen(!isOpen)}
            isOpen={isOpen}
            trigger={<Button spacing="compact">...</Button>}
          >
            {actionsToList.map((actionToList) => (
              <Item key={actionToList.id}>{actionToList.text}</Item>
            ))}
          </DropList>
        </div>
      ) : null}
    </div>
  );
};
