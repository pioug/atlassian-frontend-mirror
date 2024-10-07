import React from 'react';
import CardViewExample from '../../../examples/card-view';
import customMd from '../../utils/custom-md';
import state_description from '../state-description';

export default customMd`

### States

${state_description}

${(<CardViewExample appearance="inline" frameStyle="show" />)}
`;
