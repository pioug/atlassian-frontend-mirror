import { css, type SerializedStyles } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

interface DropzoneContainerProps {
	isActive: boolean;
}

export const dropzoneContainerStyles = ({ isActive }: DropzoneContainerProps): SerializedStyles =>
	css(
		{
			width: '600px',
			minHeight: '500px',
			border: '1px dashed transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		isActive ? `border-color: gray;` : '',
	);
