/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import type { AnnotationDataAttributes } from '@atlaskit/adf-schema/annotation';
import { cssMap, jsx } from '@atlaskit/css';

const styles = cssMap({
	anchor: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		pointerEvents: 'none',
	},
});

/** Full-chart anchors for comment navigation, without wrapping or intercepting the iframe. */
export const ExtensionAnnotation = ({
	id,
	dataAttributes,
	markRef,
}: {
	dataAttributes: AnnotationDataAttributes & {
		'data-block-mark'?: boolean;
		'data-has-focus'?: boolean;
		'data-is-hovered'?: boolean;
		'data-renderer-mark'?: boolean;
	};
	id: string;
	markRef?: React.Ref<HTMLDivElement>;
}): React.JSX.Element => (
	<div
		css={styles.anchor}
		id={id}
		ref={markRef}
		data-id={dataAttributes['data-id']}
		data-mark-type={dataAttributes['data-mark-type']}
		data-mark-annotation-type={dataAttributes['data-mark-annotation-type']}
		data-mark-annotation-state={dataAttributes['data-mark-annotation-state']}
		data-block-mark={dataAttributes['data-block-mark']}
		data-renderer-mark={dataAttributes['data-renderer-mark']}
		data-has-focus={dataAttributes['data-has-focus']}
		data-is-hovered={dataAttributes['data-is-hovered']}
	/>
);
