import React from 'react';
import Toolbar from './Toolbar';
import Typeahead from './Typeahead';
import Options from './Options';
import { getBridge } from '../../src/editor/native-to-web/bridge-initialiser';
import useCollab from './collab/useCollab';

const HUD = () => {
  const bridge = getBridge();
  useCollab(bridge);

  return (
    <div>
      <Options bridge={bridge} />
      <Toolbar bridge={bridge} />
      <Typeahead bridge={bridge} />
    </div>
  );
};

export default HUD;
