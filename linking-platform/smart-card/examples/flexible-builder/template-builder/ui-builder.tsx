/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useMemo } from 'react';
import EnumOption from './inputs/enum-option';
import { SmartLinkSize, SmartLinkTheme } from '../../../src';
import { type FlexibleUiOptions } from '../../../src/view/FlexibleCard/types';
import CheckboxOption from './inputs/checkbox-option';
import { type FlexibleTemplate } from '../types';
import Fieldset from './fieldset';

const UiBuilder = ({
	onChange,
	template = {},
}: {
	onChange: (ui: FlexibleUiOptions) => void;
	template?: FlexibleTemplate;
}) => {
	const { ui = {} } = template;
	const showHoverPreview = useMemo(
		() => template.cardProps?.showHoverPreview,
		[template.cardProps?.showHoverPreview],
	);
	return (
		<Fieldset legend="Flexible Smart Links: UI Options">
			<EnumOption
				defaultValue={SmartLinkTheme.Link}
				label="Theme"
				name="ui.theme"
				onChange={onChange}
				propName="theme"
				source={SmartLinkTheme}
				template={ui}
			/>
			<EnumOption
				defaultValue={SmartLinkSize.Medium}
				label="Size (inherit)"
				name="ui.size"
				onChange={onChange}
				propName="size"
				source={SmartLinkSize}
				template={ui}
			/>
			<CheckboxOption
				label="Hide background"
				name="ui.hideBackground"
				onChange={onChange}
				propName="hideBackground"
				template={ui}
			/>
			<CheckboxOption
				label="Hide elevation"
				name="ui.hideElevation"
				onChange={onChange}
				propName="hideElevation"
				template={ui}
			/>
			<CheckboxOption
				label="Hide padding"
				name="ui.hidePadding"
				onChange={onChange}
				propName="hidePadding"
				template={ui}
			/>
			<CheckboxOption
				label="Container is clickable as link"
				name="ui.clickableContainer"
				onChange={onChange}
				propName="clickableContainer"
				template={ui}
			/>
			<CheckboxOption
				exclude={!showHoverPreview}
				label="Hide hover preview's full screen action"
				name="ui.hideHoverCardPreviewButton"
				onChange={onChange}
				propName="hideHoverCardPreviewButton"
				template={ui}
				tooltipMessage="Required showHoverPreview"
			/>
		</Fieldset>
	);
};

export default UiBuilder;
