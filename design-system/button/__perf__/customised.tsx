/* eslint-disable @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-20398 */
import React from 'react';

import AddIcon from '@atlaskit/icon/glyph/editor/add';

import { CustomThemeButton } from '../src';

export default () => (
	<CustomThemeButton iconBefore={<AddIcon label="" />}>Button</CustomThemeButton>
);
