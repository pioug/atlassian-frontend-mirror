import React from 'react';

import { AtlassianNavigation, SignIn } from '../src';

import { DefaultCreate } from './shared/Create';
import { HelpPopup } from './shared/HelpPopup';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { DefaultSearch } from './shared/Search';
import { SwitcherPopup } from './shared/SwitcherPopup';

const SignInExample = () => <SignIn tooltip="Sign in" />;

const AnonymousExample = () => (
  <AtlassianNavigation
    label="site"
    primaryItems={defaultPrimaryItems}
    renderAppSwitcher={SwitcherPopup}
    renderCreate={DefaultCreate}
    renderHelp={HelpPopup}
    renderProductHome={DefaultProductHome}
    renderSignIn={SignInExample}
    renderSearch={DefaultSearch}
  />
);

export default AnonymousExample;
