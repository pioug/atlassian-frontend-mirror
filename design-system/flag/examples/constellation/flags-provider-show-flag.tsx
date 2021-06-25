import React, { useRef } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import Info from '@atlaskit/icon/glyph/info';
import { P300 } from '@atlaskit/theme/colors';

import { FlagsProvider, useFlags } from '../../src';

const actions = [
  {
    content: 'Nice one!',
    onClick: () => {},
  },
];

const FlagGroupExample = () => {
  const flagCount = useRef(1);

  const { showFlag } = useFlags();

  const addFlag = () => {
    const id = flagCount.current++;
    showFlag({
      actions,
      description: 'Added from the context.',
      icon: <Info label="Info" primaryColor={P300} />,
      id: id,
      title: `${id}: Whoa a new flag!`,
    });
  };

  const addFlagNoId = () => {
    showFlag({
      actions,
      description: 'I was not given an id.',
      icon: <Info label="Info" primaryColor={P300} />,
      title: `${flagCount.current++}: Whoa a new flag!`,
    });
  };

  const addAutoDismissFlag = () => {
    showFlag({
      actions,
      description: 'I will automatically dismiss after 8 seconds.',
      icon: <Info label="Info" primaryColor={P300} />,
      title: `${flagCount.current++}: Whoa a new flag!`,
      isAutoDismiss: true,
    });
  };

  return (
    <ButtonGroup>
      <Button onClick={addFlag}>Add Flag</Button>
      <Button onClick={addFlagNoId}>Add Flag without id</Button>
      <Button onClick={addAutoDismissFlag}>Add AutoDismissFlag</Button>
    </ButtonGroup>
  );
};

export default () => (
  <FlagsProvider>
    <FlagGroupExample />
  </FlagsProvider>
);
