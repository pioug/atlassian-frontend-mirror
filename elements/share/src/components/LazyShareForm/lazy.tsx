import React, { FunctionComponent } from 'react';

import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

import Spinner from '@atlaskit/spinner';

import { ShareFormWrapper } from '../ShareFormWrapper';

import type { LazyShareFormProps } from './LazyShareForm';

const LazyShareFormLazy = lazyForPaint<FunctionComponent<LazyShareFormProps>>(
  () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_share-form" */
      './LazyShareForm'
    ),
  { ssr: false },
);

type LoadingDialog = Pick<
  LazyShareFormProps,
  'shareFormTitle' | 'showTitle' | 'setIsLoading'
>;

const LoadingDialog: React.FC<LoadingDialog> = ({
  shareFormTitle,
  showTitle,
  setIsLoading,
}) => {
  React.useEffect(() => {
    setIsLoading(true);
  });

  return (
    <ShareFormWrapper
      shareFormTitle={shareFormTitle}
      // if `showTitle` is passed, we use it. Otherwise, we will show title for loading dialog.
      shouldShowTitle={typeof showTitle === 'boolean' ? showTitle : true}
    >
      <div
        css={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Spinner />
      </div>
    </ShareFormWrapper>
  );
};

export default (props: LazyShareFormProps) => (
  <LazySuspense
    fallback={
      <LoadingDialog
        shareFormTitle={props.shareFormTitle}
        showTitle={props.showTitle}
        setIsLoading={props.setIsLoading}
      />
    }
  >
    <LazyShareFormLazy {...props} />
  </LazySuspense>
);
