import React from 'react';
import { AnnotationContext } from '@atlaskit/renderer';

export const AnnotationContextProviderWrapper: React.FC<{
  value: React.ContextType<typeof AnnotationContext> | null;
}> = props => {
  if (!props.value) {
    return <>{props.children}</>;
  }

  return (
    <AnnotationContext.Provider value={props.value}>
      {props.children}
    </AnnotationContext.Provider>
  );
};
