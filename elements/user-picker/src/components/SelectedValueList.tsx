/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	createContext,
	Fragment,
	type ReactElement,
	type ReactNode,
	useContext,
	useMemo,
} from 'react';

// Use the package's existing runtime styling dependency; @atlaskit/css is dev-only here.
import { cssMap, jsx } from '@compiled/react';
import memoizeOne from 'memoize-one';

import { token } from '@atlaskit/tokens';

const styles = cssMap({
	list: {
		display: 'contents',
		marginBlockStart: token('space.0'),
		marginBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
	},
	item: {
		display: 'contents',
		listStyleType: 'none',
	},
});

const SelectedKeysContext = createContext<ReadonlyArray<React.Key | null>>([]);

const SelectedValueListItem = ({
	children,
	valueKey,
}: {
	children: ReactNode;
	valueKey: React.Key | null;
}) => {
	const isSelected = useContext(SelectedKeysContext).includes(valueKey);
	return (
		<li
			css={styles.item}
			role={isSelected ? 'listitem' : 'presentation'}
			aria-hidden={isSelected ? undefined : true}
		>
			{children}
		</li>
	);
};

type ChildrenProps = { children?: ReactNode };

export const SelectedValueList = ({
	children,
	hasValue,
}: ChildrenProps & { hasValue: boolean }): ReactNode => {
	const getSelectedKeys = useMemo(() => memoizeOne((...keys: (React.Key | null)[]) => keys), []);

	const renderList = (values: ReactNode, collection?: ReactElement<ChildrenProps>) => {
		const elements = React.Children.toArray(values).filter(React.isValidElement);
		const items = elements.map((value) => (
			<SelectedValueListItem key={value.key} valueKey={value.key}>
				{value}
			</SelectedValueListItem>
		));
		return (
			// Persistence can retain an empty tag wrapper after its motion finishes.
			// Live keys keep exiting values out of the accessible list immediately.
			<SelectedKeysContext.Provider value={getSelectedKeys(...elements.map((value) => value.key))}>
				<ul css={styles.list} role={hasValue ? 'list' : 'presentation'}>
					{collection ? React.cloneElement(collection, { children: items }) : items}
				</ul>
			</SelectedKeysContext.Provider>
		);
	};

	if (React.isValidElement<ChildrenProps>(children) && children.type === Fragment) {
		// Select's motion path supplies a fragment containing its existing persistence
		// boundary and placeholder. Wrap values inside that boundary so each list item
		// contains the complete default/custom renderer, including its motion wrapper.
		const [collection, placeholder] = React.Children.toArray(children.props.children);
		if (React.isValidElement<ChildrenProps>(collection)) {
			return (
				<Fragment>
					{(hasValue || !placeholder) && renderList(collection.props.children, collection)}
					{placeholder}
				</Fragment>
			);
		}
	}

	return Array.isArray(children) ? renderList(children) : children;
};
