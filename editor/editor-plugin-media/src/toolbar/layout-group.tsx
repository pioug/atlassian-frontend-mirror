/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { ButtonGroup } from '@atlaskit/button';
import type {
  Command,
  FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import {
  FloatingToolbarButton as Button,
  FloatingToolbarSeparator,
} from '@atlaskit/editor-common/ui';
import { token } from '@atlaskit/tokens';

const containerStyles = css({
  marginLeft: token('space.100', '8px'),
});

type Props = {
  layoutButtons: FloatingToolbarItem<Command>[];
  dispatchCommand: (command: Command) => void;
  hide: () => void;
};

export const LayoutGroup = ({
  layoutButtons,
  dispatchCommand,
  hide,
}: Props) => {
  return (
    <div css={containerStyles}>
      <ButtonGroup>
        {layoutButtons.map((item, idx) => {
          switch (item.type) {
            case 'separator':
              return <FloatingToolbarSeparator key={idx} />;
            case 'button':
              const ButtonIcon = item.icon as React.ComponentClass<any>;
              return (
                <Button
                  key={idx}
                  icon={
                    item.icon ? <ButtonIcon label={item.title} /> : undefined
                  }
                  title={item.title}
                  selected={item.selected}
                  disabled={item.disabled}
                  onClick={() => {
                    dispatchCommand(item.onClick);
                    hide();
                  }}
                />
              );
          }
        })}
      </ButtonGroup>
    </div>
  );
};
