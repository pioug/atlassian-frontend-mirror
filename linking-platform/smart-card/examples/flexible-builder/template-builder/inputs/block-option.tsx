/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useCallback } from 'react';
import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select/Select';
import { BlockName } from '../../constants';

const blockSelectStyles = css({
	display: 'flex',
	alignItems: 'center',
	gap: '0.5rem',
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.block-select': {
		flex: '1 1 auto',
	},
});

const blockOptions = Object.values(BlockName).map((value) => ({
	label: value,
	value,
}));

const BlockOption = ({ onClick }: { onClick: (name: BlockName) => void }) => {
	const handleOnChange = useCallback(
		(option: any) => {
			onClick(option.value);
		},
		[onClick],
	);
	return (
		<Field name="block" defaultValue={null}>
			{({ fieldProps: { id, ...rest } }) => (
				<div css={blockSelectStyles}>
					<Select
						inputId="block-select"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className="block-select"
						placeholder="Add a block"
						{...rest}
						onChange={handleOnChange}
						options={blockOptions}
					/>
				</div>
			)}
		</Field>
	);
};

export default BlockOption;
