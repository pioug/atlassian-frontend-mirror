import React, { createContext, useContext, useEffect, useState } from 'react';

import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/new';
import { type PublicPluginAPI } from '@atlaskit/editor-common/types';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { primaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { type ButtonComponent, loomPlugin, type LoomPlugin } from '@atlaskit/editor-plugins/loom';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import Popup from '@atlaskit/popup';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, Text, xcss } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';

import { getLoomProvider } from './utils/provider/loom-provider';

const contentStyles = xcss({
	padding: 'space.200',
});

const LoomButton = ({
	ButtonComponent,
	setShouldInit,
}: {
	ButtonComponent: ButtonComponent;
	setShouldInit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const loomInitContext = useContext(LoomInitContext);

	useEffect(() => {
		if (loomInitContext?.finishedInit) {
			setIsDisabled(false);
		}
	}, [loomInitContext?.finishedInit]);
	return loomInitContext?.finishedInit ? (
		<ButtonComponent onClickBeforeInit={() => {}} />
	) : (
		<Popup
			isOpen={isOpen}
			placement="bottom-start"
			onClose={() => setIsOpen(false)}
			content={() => {
				return (
					<Box xcss={contentStyles}>
						<Stack space="space.100">
							<Box>
								<Text>Do you want to sign up Loom ?</Text>
							</Box>
						</Stack>
						<br />
						<Stack alignBlock="end">
							<ButtonGroup>
								<Button
									appearance="default"
									onClick={() => {
										setIsOpen(false);
									}}
								>
									No
								</Button>
								<Button
									appearance="primary"
									onClick={() => {
										setShouldInit(true);
										setIsOpen(false);
										setIsDisabled(true);
									}}
								>
									Yes
								</Button>
							</ButtonGroup>
						</Stack>
					</Box>
				);
			}}
			shouldRenderToParent
			trigger={(triggerProps) => {
				return isDisabled ? (
					<Spinner />
				) : (
					<ButtonComponent
						{...triggerProps}
						href="https://www.google.com/"
						onClickBeforeInit={() => {
							setShouldInit(true);
						}}
						onMouseEnter={() => {
							setIsOpen(true);
						}}
						onFocus={() => setIsOpen(true)}
						isDisabled={isDisabled}
					/>
				);
			}}
		/>
	);
};

function Editor() {
	const [shouldInit, setShouldInit] = useState(false);
	const [api, setApi] = useState<PublicPluginAPI<LoomPlugin>>();
	const loomInitContext = useContext(LoomInitContext);

	useEffect(() => {
		const init = async () => {
			if (shouldInit) {
				await api?.loom?.actions.initLoom({
					loomProvider: getLoomProvider({
						publicAppId: '4dc78821-b6d2-44ee-ab43-54d0494290c8',
					}).loomProvider!,
				});
				loomInitContext?.setFinishedInit(true);
			}
		};
		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouldInit]);

	const { preset, editorApi } = usePreset((builder) =>
		builder
			.add(basePlugin)
			.add(typeAheadPlugin)
			.add(quickInsertPlugin)
			.add(hyperlinkPlugin)
			.add(widthPlugin)
			.add(primaryToolbarPlugin)
			.add([
				loomPlugin,
				{
					renderButton: (ButtonComponent) => {
						return <LoomButton ButtonComponent={ButtonComponent} setShouldInit={setShouldInit} />;
					},
					shouldShowToolbarButton: true,
				},
			]),
	);

	useEffect(() => {
		editorApi && setApi(editorApi);
	}, [editorApi]);

	return <ComposableEditor appearance="full-page" preset={preset} />;
}

interface LoomInitContext {
	finishedInit: boolean;
	setFinishedInit: React.Dispatch<React.SetStateAction<boolean>>;
}
const LoomInitContext = createContext<LoomInitContext | undefined>(undefined);

export default () => {
	const [finishedInit, setFinishedInit] = useState(false);
	return (
		<LoomInitContext.Provider value={{ finishedInit, setFinishedInit }}>
			<Editor />
		</LoomInitContext.Provider>
	);
};
