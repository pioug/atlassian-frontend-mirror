/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { layers } from '@atlaskit/theme/constants';
import Spinner from '@atlaskit/spinner';
import { css, jsx } from '@compiled/react';

const blanketStyles = css({
	position: 'fixed',
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	zIndex: layers.modal() + 10,
});

const spinnerStyles = css({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
});

interface Props {
	blankedColor?: string;
	invertSpinnerColor?: boolean;
}

const defaultProps: Props = {
	blankedColor: 'none',
	invertSpinnerColor: false,
};

export default ({ blankedColor, invertSpinnerColor }: Props) => (
	<div
		style={{ backgroundColor: blankedColor || defaultProps.blankedColor }}
		css={blanketStyles}
		data-testid={'media-modal-spinner-blanket'}
	>
		<div css={spinnerStyles}>
			<Spinner
				size="large"
				appearance={invertSpinnerColor || defaultProps.invertSpinnerColor ? 'invert' : 'inherit'}
				testId={'media-modal-spinner'}
			/>
		</div>
	</div>
);
