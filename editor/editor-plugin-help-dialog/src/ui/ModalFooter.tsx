/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { openHelp } from '@atlaskit/editor-common/keymaps';
import { helpDialogMessages as messages } from '@atlaskit/editor-common/messages';
import { fg } from '@atlaskit/platform-feature-flags';

import { footer, footerNew } from './styles';
import { getComponentFromKeymap } from './utils';

const ModalFooter = () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	<div css={fg('platform_editor_fix_help_dialog_color_contrast') ? footerNew : footer}>
		<FormattedMessage
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...messages.helpDialogTips}
			values={{ keyMap: getComponentFromKeymap(openHelp) }}
		/>
	</div>
);

export default ModalFooter;
