/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useIntl } from 'react-intl';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { highlightMessages as messages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { REMOVE_HIGHLIGHT_COLOR } from '@atlaskit/editor-common/ui-color';
import { useToolbarDropdownMenu } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import ColourNoneIcon from '@atlaskit/icon-lab/core/colour-none';
import { Text } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { TextColorPlugin } from '../textColorPluginType';

const styles = cssMap({
	removeColorButton: {
		marginTop: token('space.075'),
		marginInline: token('space.025'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
	},
	iconContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.075'),
	},
});

type RemoveColorMenuItemButtonProps = {
	api?: ExtractInjectionAPI<TextColorPlugin>;
	parents: ToolbarComponentTypes;
};

export const RemoveColorMenuItem = ({
	api,
	parents,
}: RemoveColorMenuItemButtonProps): JSX.Element => {
	const { formatMessage } = useIntl();
	const context = useToolbarDropdownMenu();
	const closeMenu = context?.closeMenu;

	const onClick = (event: React.MouseEvent) => {
		if (!api) {
			return;
		}
		const defaultColor = api.textColor.sharedState.currentState()?.defaultColor;

		if (!defaultColor) {
			return;
		}

		api.core.actions.execute(({ tr }) => {
			api.textColor.commands.changeColor(
				defaultColor,
				getInputMethodFromParentKeys(parents),
			)({ tr });

			api.highlight?.commands.changeColor({
				color: REMOVE_HIGHLIGHT_COLOR,
				inputMethod: getInputMethodFromParentKeys(parents),
			})({ tr });

			return tr;
		});

		if (!expValEquals('platform_editor_lovability_text_bg_color', 'isEnabled', true)) {
			closeMenu?.(event);
		}
	};

	if (expValEquals('platform_editor_lovability_text_bg_color', 'isEnabled', true)) {
		return (
			<div css={styles.removeColorButton}>
				<Button shouldFitContainer appearance="subtle" onClick={onClick}>
					<span css={styles.iconContainer}>
						<ColourNoneIcon size="medium" label="" />
						<Text weight="medium">{formatMessage(messages.clearColors)}</Text>
					</span>
				</Button>
			</div>
		);
	}

	return (
		<div css={styles.removeColorButton}>
			<Button shouldFitContainer appearance="subtle" onClick={onClick}>
				<Text weight="medium">{formatMessage(messages.removeColor)}</Text>
			</Button>
		</div>
	);
};
