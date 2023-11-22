import React, { useState } from 'react';
import Button from '@atlaskit/button';
import ButtonGroup from '@atlaskit/button/button-group';
import AddCircleIcon from '@atlaskit/icon/glyph/add-circle';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import type { MultiBodiedExtensionActions } from '@atlaskit/editor-common/extensions';
import { token } from '@atlaskit/tokens';
import { R300 } from '@atlaskit/theme/colors';

type Props = {
  actions?: MultiBodiedExtensionActions;
};

type TabsProps = {
  amount: number;
  actions: MultiBodiedExtensionActions | undefined;
  decreaseTabCount: () => void;
};

type TabButtonProps = {
  actions: MultiBodiedExtensionActions | undefined;
  index: number;
  activeTabIndex: number;
  decreaseTabCount: () => void;
};
const TabButton = ({
  actions,
  activeTabIndex,
  index,
  decreaseTabCount,
}: TabButtonProps) => {
  const click = React.useCallback(() => {
    if (!actions) {
      return;
    }
    actions.changeActive(index);
  }, [actions, index]);

  const removeClick = React.useCallback(() => {
    if (!actions) {
      return;
    }
    if (actions.removeChild(index)) {
      decreaseTabCount();
    }
  }, [actions, index, decreaseTabCount]);

  return (
    <ButtonGroup>
      <Button
        testId="mbe-button-select-tab"
        appearance={activeTabIndex === index ? 'subtle' : 'default'}
        onClick={click}
      >
        Tab {index + 1}
      </Button>
      <Button
        testId="mbe-button-remove-tab"
        iconBefore={
          <CrossCircleIcon
            label="remove tab"
            primaryColor={token('color.icon.accent.red', R300)}
          />
        }
        onClick={removeClick}
      ></Button>
    </ButtonGroup>
  );
};
const Tabs = ({ amount, actions, decreaseTabCount }: TabsProps) => {
  const buttons = React.useMemo(() => {
    const result = Array(amount)
      .fill(1)
      .map((_, index) => (
        <TabButton
          key={index}
          actions={actions}
          index={index}
          decreaseTabCount={decreaseTabCount}
          activeTabIndex={index}
        />
      ));

    return result;
  }, [amount, actions, decreaseTabCount]);

  return <>{buttons}</>;
};

export default ({ actions }: Props) => {
  const [tabCount, setTabCount] = useState(actions?.getChildrenCount() || 0);
  const increaseTabCount = React.useCallback(() => {
    setTabCount(tabCount + 1);
  }, [tabCount]);
  const decreaseTabCount = React.useCallback(() => {
    setTabCount(Math.max(tabCount - 1, 0));
  }, [tabCount]);

  const click = React.useCallback(() => {
    if (!actions) {
      return;
    }
    const wasAdded = actions.addChild();
    if (wasAdded) {
      increaseTabCount();
      actions.changeActive(tabCount);
    }
  }, [actions, increaseTabCount, tabCount]);

  return (
    <div>
      <header>My Fake Tab!</header>
      <ButtonGroup>
        <Tabs
          amount={tabCount}
          decreaseTabCount={decreaseTabCount}
          actions={actions}
        />
        <Button
          testId="mbe-button-add-tab"
          iconBefore={<AddCircleIcon label="" />}
          onClick={click}
          tabIndex={-1}
        >
          Add
        </Button>
      </ButtonGroup>
    </div>
  );
};
