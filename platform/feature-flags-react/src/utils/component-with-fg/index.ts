import type { ComponentType, FC, PropsWithoutRef, PropsWithRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { componentWithCondition, type GetRefAttributes } from '../component-with-condition';

export const componentWithFG = <A extends NonNullable<unknown>, B extends NonNullable<unknown>>(
	featureFlagName: string,
	ComponentTrue: ComponentType<A>,
	ComponentFalse: ComponentType<B>,
): FC<
	PropsWithoutRef<A> & PropsWithoutRef<B> & GetRefAttributes<PropsWithRef<A>, PropsWithRef<B>>
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-registration, @atlaskit/platform/static-feature-flags
> => componentWithCondition(() => fg(featureFlagName), ComponentTrue, ComponentFalse);
