import React, { useCallback, useMemo, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { cssMap } from '@atlaskit/css';
import { Label } from '@atlaskit/form';
import { Grid } from '@atlaskit/primitives/compiled';
import Select from '@atlaskit/select/Select';
import Textfield from '@atlaskit/textfield';

import { ActionName } from '../../../../src';
import { type BlockTemplate } from '../../types';
import { type ChangeParams, getCustomActionIcon, handleOnChange } from '../../utils';

const gridStyles = cssMap({
	root: {
		gridTemplateColumns: '1fr 67px',
	},
});

type ActionProp = {
	name: ActionName;
	content?: string;
	hideIcon?: boolean;
	hideContent?: boolean;
	icon?: React.ReactNode;
};

const options = Object.values(ActionName).map((name) => ({
	label: name,
	value: name,
}));

const ActionOption = ({
	name,
	onChange,
	propName,
	template,
}: {
	name: string;
	onChange: (template: BlockTemplate) => void;
	propName: keyof BlockTemplate;
	template: BlockTemplate;
}) => {
	const [actionName, setActionName] = useState<ActionName>();
	const [hideIcon, setHideIcon] = useState<boolean>(false);
	const [hideContent, setHideContent] = useState<boolean>(false);

	const actions = useMemo(() => template[propName] || [], [propName, template]);

	const handleOnActionChange = useCallback((option: any) => {
		if (option) {
			setActionName(option.value);
		}
	}, []);

	const handleOnHideIconChange = useCallback(
		(...params: ChangeParams<BlockTemplate>) =>
			(e: React.SyntheticEvent<HTMLInputElement>) => {
				const isChecked = e.currentTarget.checked;
				setHideIcon(isChecked);

				const arr = actions.map((action: ActionProp) => {
					const { icon, hideIcon, ...rest } = action;
					if (!isChecked) {
						const isCustom = action.name === ActionName.CustomAction;
						return {
							...rest,
							...(isCustom && { icon: icon || getCustomActionIcon() }),
						};
					}
					return { ...rest, hideIcon: true };
				});
				handleOnChange<BlockTemplate>(...params, arr);
			},
		[actions],
	);

	const handleOnHideContentChange = useCallback(
		(...params: ChangeParams<BlockTemplate>) =>
			(e: React.SyntheticEvent<HTMLInputElement>) => {
				const isChecked = e.currentTarget.checked;
				setHideContent(isChecked);

				const arr = actions.map((action: ActionProp) => {
					if (!isChecked) {
						const { hideContent, content, ...rest } = action;
						const isCustom = action.name === ActionName.CustomAction;
						return {
							...rest,
							...(isCustom && { content: content || 'Custom' }),
						};
					}
					return { ...action, hideContent: true };
				});
				handleOnChange<BlockTemplate>(...params, arr);
			},
		[actions],
	);

	const handleOnAddClick = useCallback(
		(...params: ChangeParams<BlockTemplate>) =>
			() => {
				if (actionName) {
					const isCustom = actionName === ActionName.CustomAction;
					const action = {
						name: actionName,
						onClick: () => {},
						...(hideIcon && { hideIcon }),
						...(hideContent && { hideContent }),
						...(isCustom && !hideContent && { content: 'Custom' }),
						...(isCustom && !hideIcon && { icon: getCustomActionIcon() }),
					};
					const arr = [...actions, action];
					handleOnChange<BlockTemplate>(...params, arr);
				}
			},
		[actionName, hideIcon, hideContent, actions],
	);

	const handleOnDeleteClick = useCallback(
		(idx: number, ...params: ChangeParams<BlockTemplate>) =>
			() => {
				const arr = Array.from(actions);
				arr.splice(idx, 1);
				handleOnChange<BlockTemplate>(...params, arr);
			},
		[actions],
	);

	const handleOnActionNameChange = useCallback(
		(idx: number, ...params: ChangeParams<BlockTemplate>) =>
			(e: React.SyntheticEvent<HTMLInputElement>) => {
				const arr = actions.map((action: ActionProp, i: number) =>
					idx === i ? { ...action, content: e.currentTarget.value } : action,
				);
				handleOnChange<BlockTemplate>(...params, arr);
			},
		[actions],
	);

	return (
		<Grid rowGap="space.050">
			<Label htmlFor={name}>Actions</Label>
			<Grid alignItems="center" columnGap="space.100" xcss={gridStyles.root}>
				<Select onChange={handleOnActionChange} options={options} placeholder="Choose an action" />
				<Button onClick={handleOnAddClick(onChange, template, propName, [])}>Add</Button>
			</Grid>
			<Checkbox
				isChecked={hideIcon}
				label="Hide action icon"
				onChange={handleOnHideIconChange(onChange, template, propName, [])}
			/>
			<Checkbox
				isChecked={hideContent}
				label="Hide action content"
				onChange={handleOnHideContentChange(onChange, template, propName, [])}
			/>
			{actions.map(({ name, content = '' }: ActionProp, idx: number) => (
				<Grid
					alignItems="center"
					columnGap="space.100"
					key={`${name}-${idx}`}
					xcss={gridStyles.root}
				>
					{name === ActionName.CustomAction ? (
						<Textfield
							onChange={handleOnActionNameChange(idx, onChange, template, propName, [])}
							placeholder="Custom action text"
							value={content}
						/>
					) : (
						<span>{name}</span>
					)}
					<Button
						appearance="danger"
						onClick={handleOnDeleteClick(idx, onChange, template, propName, [])}
					>
						Delete
					</Button>
				</Grid>
			))}
		</Grid>
	);
};

export default ActionOption;
