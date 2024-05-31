import React, { useEffect, useState } from 'react';
import type WebBridgeImpl from '../../../src/editor/native-to-web';
import { type MentionProvider, type MentionDescription } from '@atlaskit/mention';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import Button from '../Toolbar/Button';

interface Props {
	bridge: WebBridgeImpl;
	query: string;
}

const mentionProvider = Promise.resolve(mentionResourceProvider);

const Mention = ({ bridge, query }: Props) => {
	const [provider, setProvider] = useState<MentionProvider | null>(null);
	const [items, setItems] = useState<MentionDescription[] | null>(null);

	useEffect(() => {
		mentionProvider.then((provider) => {
			setProvider(provider);
		});
	}, []);

	useEffect(() => {
		if (provider) {
			provider.subscribe('key', (result, resultQuery) => {
				console.log(result);
				if (resultQuery === query) {
					setItems(result);
				}
			});
		}
	}, [query, provider]);

	useEffect(() => {
		if (provider) {
			provider.filter(query);
		}
	}, [query, provider]);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ display: 'flex', height: 24 }}>
			{items
				? items.map((item) => (
						<Button
							title={item.nickname ?? item.name}
							onClick={() => bridge.insertTypeAheadItem('mention', JSON.stringify(item))}
						/>
					))
				: null}
		</div>
	);
};

export default Mention;
