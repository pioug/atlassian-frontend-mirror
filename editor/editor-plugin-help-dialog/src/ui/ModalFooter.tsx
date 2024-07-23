/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { openHelp } from '@atlaskit/editor-common/keymaps';
import { helpDialogMessages as messages } from '@atlaskit/editor-common/messages';

import { footer } from './styles';
import { getComponentFromKeymap } from './utils';

const ModalFooter = () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	<div css={footer}>
		<FormattedMessage
			{...messages.helpDialogTips}
			values={{ keyMap: getComponentFromKeymap(openHelp) }}
		/>
	</div>
);

export default ModalFooter;
