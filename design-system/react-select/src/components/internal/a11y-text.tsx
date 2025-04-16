/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import Compiled from '../../compiled/components/internal/a11y-text';
import Emotion from '../../emotion/components/internal/a11y-text';

const A11yText = (props: JSX.IntrinsicElements['span']) =>
	fg('compiled-react-select') ? <Compiled {...props} /> : <Emotion {...props} />;

export default A11yText;
