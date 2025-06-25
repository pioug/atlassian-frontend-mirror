/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React from 'react';

import Compiled from '../../compiled/components/internal/a11y-text';

const A11yText = (props: JSX.IntrinsicElements['span']) => <Compiled {...props} />;

export default A11yText;
