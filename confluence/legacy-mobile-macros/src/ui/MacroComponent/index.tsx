import React, { ComponentType, FC, useEffect, useState } from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';

import Button from '@atlaskit/button/standard-button';
import Spinner from '@atlaskit/spinner';
import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

import { legacyMobileMacrosMessages } from '../../messages';

import {
  TAP_TO_LOAD_PROMISE,
  TAP_TO_REFRESH_EVENT,
  TAP_TO_REFRESH_PAGE_PROMISE,
  TAP_TO_VIEW_PROMISE,
} from './constants';
import { MacroCard } from './MacroCard';
import { ActionProps, CreateMacro, MacroRendererProps } from './types';

const noop = () => {};

const Action = styled.span<ActionProps>`
  color: ${(props) =>
    props.callToAction
      ? themed({ light: colors.B300, dark: colors.B100 })
      : themed({ light: colors.N90, dark: colors.DN100 })};
  align-self: center;
  text-align: right;
  white-space: nowrap;
  padding-left: 16px;
  min-width: 50px;
`;

const cardStyles = (componentType: ComponentType<any>) => {
  return styled(componentType)`
    && {
      background-color: ${themed({ light: colors.N0, dark: colors.DN0 })};
      border: solid 2px ${themed({ light: colors.N30, dark: colors.DN50 })};
      color: ${themed({ light: colors.N800, dark: colors.DN900 })} !important;
      display: flex;
      height: unset;
      min-height: 44px;
      white-space: normal;
      text-align: left;
      min-width: 150px;
      align-items: center;
      line-height: 22px;
    }
  `;
};

// create standard translated error messages here????
const MacroComponent: FC<MacroRendererProps & InjectedIntlProps> = (props) => {
  const {
    createPromise,
    eventDispatcher,
    extension,
    macroWhitelist,
    intl,
  } = props;
  const { extensionKey, parameters } = extension;

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const cardProps: CreateMacro = {
    isDisabled: false,
    action: <></>,
    onClick: null,
    secondaryAction: <></>,
  };

  const getMacroId = () => {
    return parameters?.macroMetadata?.macroId?.value;
  };

  const getIconUrl = () => {
    return (
      parameters?.macroMetadata?.placeholder?.[0]?.type === 'icon' &&
      parameters.macroMetadata.placeholder[0].data?.url
    );
  };

  const getMacroName = () => {
    const macroTitle = parameters?.macroMetadata?.title;

    // a title can be a long string eg com.atlassian.packages.label
    // or excerpt-include vs Excerpt include
    // or toc vs Table of contents
    if (
      macroTitle &&
      typeof macroTitle === 'string' &&
      !/(\w+\.\w+)+/.test(macroTitle) &&
      !/(\w+-\w+)+/.test(macroTitle) &&
      macroTitle.length >= extensionKey.length
    ) {
      return macroTitle;
    } else {
      return extensionKey;
    }
  };

  // action can be view/retry/spinner/nothing
  const createCard = ({
    action,
    errorMessage,
    onClick,
    isDisabled,
    secondaryAction,
  }: CreateMacro) => {
    // fallback to the extensionkey while the changes soak for the title to be f
    // title might not be a string??
    const macroName = getMacroName();
    const iconUrl = getIconUrl();

    const CardButton = cardStyles(Button.type);

    return (
      <CardButton
        onClick={onClick || noop}
        isDisabled={isDisabled}
        shouldFitContainer
      >
        <MacroCard
          action={action}
          errorMessage={errorMessage}
          extensionKey={extensionKey}
          iconUrl={iconUrl}
          loading={loading}
          macroName={macroName}
          secondaryAction={secondaryAction}
        />
      </CardButton>
    );
  };

  const setLoadingErrorState = () => {
    setLoaded(false);
    setLoading(false);
    setErrorMessage(
      intl.formatMessage(legacyMobileMacrosMessages.errorLoadingMacro),
    );
  };

  const setLoadingRetryState = () => {
    setLoaded(false);
    setLoading(true);
    setErrorMessage('');
    setRetryCount(retryCount + 1);
  };

  const setErrorUnableToLoadState = () => {
    setLoaded(false);
    setLoading(false);
    setErrorMessage(
      intl.formatMessage(legacyMobileMacrosMessages.finalErrorLoadingMacro),
    );
  };

  const setLoadingSuccessState = () => {
    setLoaded(true);
    setLoading(false);
    setErrorMessage('');
  };

  const tapToLoad = () => {
    // on button click
    // set state to loading
    setLoading(true);

    createPromise(
      TAP_TO_LOAD_PROMISE.name,
      JSON.stringify({
        macroId: getMacroId(),
        retryCount,
      }),
    )
      .submit()
      .then((isSuccessful: boolean) => {
        if (isSuccessful) {
          setLoadingSuccessState();
        } else {
          setLoadingErrorState();
        }
      })
      .catch(() => {
        setErrorUnableToLoadState();
      });
  };

  const tapToView = () => {
    // on button click
    // do not set state to loading
    createPromise(
      TAP_TO_VIEW_PROMISE.name,
      JSON.stringify({ macroId: getMacroId() }),
    )
      .submit()
      .catch(() => {
        setErrorUnableToLoadState();
      });
  };

  const tapToRetry = () => {
    setLoadingRetryState();

    createPromise(
      TAP_TO_LOAD_PROMISE.name,
      JSON.stringify({
        macroId: getMacroId(),
        retryCount,
      }),
    )
      .submit()
      .then((isSuccessful: boolean) => {
        if (isSuccessful) {
          setLoadingSuccessState();
        } else if (retryCount > 2) {
          setErrorUnableToLoadState();
        } else {
          setLoadingErrorState();
        }
      })
      .catch(() => {
        setErrorUnableToLoadState();
      });
  };

  const tapToRefreshPage = () => {
    // Emit a refresh event with no data
    eventDispatcher.emit(TAP_TO_REFRESH_EVENT, null);
    // on button click
    // do not set state to loading
    createPromise(TAP_TO_REFRESH_PAGE_PROMISE.name)
      .submit()
      .then(() => {
        // re-invoking the load method of the macro
        tapToLoad();
      })
      .catch(() => {
        setErrorUnableToLoadState();
      });
  };

  const getTapToLoadCardProps = (cardProps: CreateMacro): CreateMacro => {
    const newProps = {
      action: (
        <Action>
          {intl.formatMessage(legacyMobileMacrosMessages.tapToLoadMacro)}
        </Action>
      ),
      isDisabled: false,
      onClick: tapToLoad,
    };

    return { ...cardProps, ...newProps };
  };

  const getLoadingCardProps = (cardProps: CreateMacro): CreateMacro => {
    const newProps = {
      action: (
        <Action data-testid="macro-card-spinner">
          <Spinner />
        </Action>
      ),
      isDisabled: true,
      errorMessage,
    };

    return { ...cardProps, ...newProps };
  };

  const getTapToViewCardProps = (cardProps: CreateMacro): CreateMacro => {
    const newProps = {
      action: (
        <Action callToAction>
          {intl.formatMessage(legacyMobileMacrosMessages.tapToViewMacro)}
        </Action>
      ),
      isDisabled: false,
      onClick: tapToView,
    };

    return { ...cardProps, ...newProps };
  };

  const getTapToRetryCardProps = (cardProps: CreateMacro): CreateMacro => {
    const newProps = {
      action: (
        <Action callToAction>
          {intl.formatMessage(
            legacyMobileMacrosMessages.tapToRetryLoadingMacro,
          )}
        </Action>
      ),
      isDisabled: false,
      onClick: tapToRetry,
      errorMessage,
    };

    return { ...cardProps, ...newProps };
  };

  const getTapToRefreshPageCardProps = (
    cardProps: CreateMacro,
  ): CreateMacro => {
    const newProps = {
      isDisabled: false,
      onClick: tapToRefreshPage,
      errorMessage,
      secondaryAction: (
        <Action callToAction>
          {intl.formatMessage(legacyMobileMacrosMessages.tapToRefreshPage)}
        </Action>
      ),
    };

    return { ...cardProps, ...newProps };
  };

  const onTapToRefresh = () => {
    setLoaded(false);
    setLoading(false);
    setErrorMessage('');
    setRetryCount(0);
  };

  useEffect(() => {
    // Attach a listener to the tapToRefresh event emitted during refresh.
    eventDispatcher.on(TAP_TO_REFRESH_EVENT, onTapToRefresh);

    return () => {
      // Removing the listener to the event before the component is unMounted.
      eventDispatcher.off(TAP_TO_REFRESH_EVENT, onTapToRefresh);
    };
  }, [eventDispatcher]);

  if (macroWhitelist) {
    // check if macroWhitelist has been passed
    if (!macroWhitelist.includes(extensionKey)) {
      // check if macroname is NOT in macrowhitelist
      if (!loaded && !loading && !errorMessage) {
        // show tap to load
        return createCard(getTapToLoadCardProps(cardProps));
      } else if (loaded && !loading && !errorMessage) {
        // show tap to show button
        // promise to show button
        return createCard(getTapToViewCardProps(cardProps));
      } else if (!loaded && loading) {
        // show loading state, possible to have error message and loading
        return createCard(getLoadingCardProps(cardProps));
      } else {
        // loaded && loading should not be a possible state unless an error has occurred
        // check retry count state
        if (retryCount < 3) {
          // allow to retry
          return createCard(getTapToRetryCardProps(cardProps));
        } else {
          // show tap to refresh page
          return createCard(getTapToRefreshPageCardProps(cardProps));
        }
      }
    } else {
      // macro is on whitelist
      return null; // we don't have any actual component yet to return
    }
  } else {
    // what to show while getting the whitelist is pending
    // an unclickable card ?
    cardProps.isDisabled = true;
  }

  return createCard(cardProps);
};

export default injectIntl(MacroComponent);
