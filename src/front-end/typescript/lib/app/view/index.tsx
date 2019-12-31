import { DEFAULT_USER_AVATAR_IMAGE_PATH, PROCUREMENT_CONCIERGE_URL } from 'front-end/config';
import { Msg, Route, State } from 'front-end/lib/app/types';
import Footer from 'front-end/lib/app/view/footer';
import * as Nav from 'front-end/lib/app/view/nav';
import ViewPage, { Props as ViewPageProps } from 'front-end/lib/app/view/page';
import { AppMsg, ComponentView, ComponentViewProps, Dispatch, Immutable, mapComponentDispatch, View } from 'front-end/lib/framework';
import Icon from 'front-end/lib/views/icon';
import Link, { externalDest, iconLinkSymbol, imageLinkSymbol, leftPlacement, rightPlacement, routeDest } from 'front-end/lib/views/link';
import { compact } from 'lodash';
import { default as React } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { fileBlobPath } from 'shared/lib/resources/file';
import { UserType } from 'shared/lib/resources/user';
import { ADT, adt, adtCurried } from 'shared/lib/types';

import * as PageLanding from 'front-end/lib/pages/landing';
import * as PageNotice from 'front-end/lib/pages/notice';
import * as PageOrgCreate from 'front-end/lib/pages/organization/create';
import * as PageOrgEdit from 'front-end/lib/pages/organization/edit';
import * as PageOrgList from 'front-end/lib/pages/organization/list';
import * as PageSignIn from 'front-end/lib/pages/sign-in';
import * as PageSignOut from 'front-end/lib/pages/sign-out';
import * as PageSignUpStepOne from 'front-end/lib/pages/sign-up/step-one';
import * as PageSignUpStepTwo from 'front-end/lib/pages/sign-up/step-two';
import * as PageUserList from 'front-end/lib/pages/user/list';
import * as PageUserProfile from 'front-end/lib/pages/user/profile';

function makeViewPageProps<RouteParams, PageState, PageMsg>(
  props: ComponentViewProps<State, Msg>,
  component: ViewPageProps<RouteParams, PageState, PageMsg>['component'],
  getPageState: ((state: Immutable<State>) => Immutable<PageState> | undefined),
  mapPageMsg: ViewPageProps<RouteParams, PageState, PageMsg>['mapPageMsg']
): ViewPageProps<RouteParams, PageState, PageMsg> {
  return {
    dispatch: props.dispatch,
    pageState: getPageState(props.state),
    mapPageMsg,
    component
  };
}

function pageToViewPageProps(props: ComponentViewProps<State, Msg>): ViewPageProps<any, any, any> {
  switch (props.state.activeRoute.tag) {

    case 'landing':
      return makeViewPageProps(
        props,
        PageLanding.component,
        state => state.pages.landing,
        value => ({ tag: 'pageLanding', value })
      );

    case 'orgEdit':
      return makeViewPageProps(
        props,
        PageOrgEdit.component,
        state => state.pages.orgEdit,
        value => ({ tag: 'pageOrgEdit', value })
      );

    case 'orgCreate':
      return makeViewPageProps(
        props,
        PageOrgCreate.component,
        state => state.pages.orgCreate,
        value => ({ tag: 'pageOrgCreate', value })
      );

    case 'orgList':
      return makeViewPageProps(
        props,
        PageOrgList.component,
        state => state.pages.orgList,
        value => ({ tag: 'pageOrgList', value })
      );

    case 'userList':
      return makeViewPageProps(
        props,
        PageUserList.component,
        state => state.pages.userList,
        value => ({ tag: 'pageUserList', value })
      );

    case 'userProfile':
      return makeViewPageProps(
        props,
        PageUserProfile.component,
        state => state.pages.userProfile,
        value => ({ tag: 'pageUserProfile', value })
      );

    case 'signIn':
      return makeViewPageProps(
        props,
        PageSignIn.component,
        state => state.pages.signIn,
        value => ({ tag: 'pageSignIn', value })
      );

    case 'signOut':
      return makeViewPageProps(
        props,
        PageSignOut.component,
        state => state.pages.signOut,
        value => ({ tag: 'pageSignOut', value })
      );

    case 'signUpStepOne':
      return makeViewPageProps(
        props,
        PageSignUpStepOne.component,
        state => state.pages.signUpStepOne,
        value => ({ tag: 'pageSignUpStepOne', value })
      );

    case 'signUpStepTwo':
      return makeViewPageProps(
        props,
        PageSignUpStepTwo.component,
        state => state.pages.signUpStepTwo,
        value => ({ tag: 'pageSignUpStepTwo', value })
      );

    case 'notice':
      return makeViewPageProps(
        props,
        PageNotice.component,
        state => state.pages.notice,
        value => ({ tag: 'pageNotice', value })
      );
  }
}

interface ViewModalProps {
  modal: State['modal'];
  dispatch: Dispatch<AppMsg<Msg, Route>>;
}

const ViewModal: View<ViewModalProps> = ({ dispatch, modal }) => {
  const { open, content } = modal;
  const closeModal = () => dispatch({ tag: 'closeModal', value: undefined });
  return (
    <Modal isOpen={open} toggle={closeModal}>
      <ModalHeader className='align-items-center' toggle={closeModal} close={(<Icon name='times' color='secondary' onClick={closeModal} style={{ cursor: 'pointer' }}/>)}>{content.title}</ModalHeader>
      <ModalBody>{content.body}</ModalBody>
      <ModalFooter className='p-0' style={{ overflowX: 'auto', justifyContent: 'normal' }}>
        <div className='p-3 d-flex flex-md-row-reverse justify-content-start align-items-center text-nowrap flex-grow-1'>
          {content.actions.map(({ button, text, color, msg }, i) => {
            const props = {
              key: `modal-action-${i}`,
              color,
              onClick: () => dispatch(msg),
              className: i === 0 ? 'mx-0' : 'ml-3 mr-0 ml-md-0 mr-md-3'
            };
            if (button) {
              return (<Link button {...props}>{text}</Link>);
            } else {
              return (<Link {...props}>{text}</Link>);
            }
          })}
        </div>
      </ModalFooter>
    </Modal>
  );
};

/*const ViewActiveRoute: ComponentView<State, Msg> = ({ state, dispatch }) => {
  switch (state.activeRoute.tag) {

    case 'landing':
      return (
        <ViewPage
          dispatch={dispatch}
          pageState={state.pages.landing}
          mapPageMsg={value => ({ tag: 'pageLanding', value })}
          component={PageLanding.component} />
      );

    case 'orgEdit':
      return (
        <ViewPage
          dispatch={dispatch}
          pageState={state.pages.orgEdit}
          mapPageMsg={value => ({ tag: 'pageOrgEdit', value })}
          component={PageOrgEdit.component} />
      );

    case 'orgCreate':
      return (
        <ViewPage
          dispatch={dispatch}
          pageState={state.pages.orgCreate}
          mapPageMsg={value => ({ tag: 'pageOrgCreate', value })}
          component={PageOrgCreate.component} />
      );

    case 'orgList':
      return (
        <ViewPage
          dispatch={dispatch}
          pageState={state.pages.orgList}
          mapPageMsg={value => ({ tag: 'pageOrgList', value })}
          component={PageOrgList.component} />
      );

    case 'userProfile':
      return (
        <ViewPage
          dispatch={dispatch}
          pageState={state.pages.userProfile}
          mapPageMsg={value => ({ tag: 'pageUserProfile', value })}
          component={PageUserProfile.component} />
      );

    case 'userList':
      return (
        <ViewPage
          dispatch={dispatch}
          pageState={state.pages.userList}
          mapPageMsg={value => ({ tag: 'pageUserList', value })}
          component={PageUserList.component} />
      );

    case 'signIn':
      return (
        <ViewPage
          dispatch={dispatch}
          pageState={state.pages.signIn}
          mapPageMsg={value => ({ tag: 'pageSignIn', value })}
          component={PageSignIn.component} />
      );

    case 'signOut':
      return (
        <ViewPage
          dispatch={dispatch}
          pageState={state.pages.signOut}
          mapPageMsg={value => ({ tag: 'pageSignOut', value })}
          component={PageSignOut.component} />
      );

    case 'signUpStepOne':
      return (
        <ViewPage
          dispatch={dispatch}
          pageState={state.pages.signUpStepOne}
          mapPageMsg={value => ({ tag: 'pageSignUpStepOne', value })}
          component={PageSignUpStepOne.component} />
      );

    case 'signUpStepTwo':
      return (
        <ViewPage
          dispatch={dispatch}
          pageState={state.pages.signUpStepTwo}
          mapPageMsg={value => ({ tag: 'pageSignUpStepTwo', value })}
          component={PageSignUpStepTwo.component} />
      );

    case 'notice':
      return (
        <ViewPage
          dispatch={dispatch}
          pageState={state.pages.notice}
          mapPageMsg={value => ({ tag: 'pageNotice', value })}
          component={PageNotice.component} />
      );
  }
};*/

const navUnauthenticatedMenu = Nav.unauthenticatedAccountMenu([
  Nav.linkAccountAction({
    text: 'Sign In',
    button: true,
    outline: true,
    color: 'white',
    dest: routeDest(adt('signIn', null))
  }),
  Nav.linkAccountAction({
    text: 'Sign Up',
    button: true,
    color: 'primary',
    dest: routeDest(adt('signUpStepOne', null))
  })
]);

const signOutLink: Nav.NavLink = {
  text: 'Sign Out',
  dest: routeDest(adt('signOut', null)),
  symbol_: leftPlacement(iconLinkSymbol('sign-out'))
};

function navAccountMenus(state: Immutable<State>): Nav.Props['accountMenus'] {
  const sessionUser = state.shared.session && state.shared.session.user;
  // Return standard sign-in/up links if user is not signed in.
  if (!sessionUser) {
    return { mobile: navUnauthenticatedMenu, desktop: navUnauthenticatedMenu };
  }
  // Return separate mobile and desktop authentication menus if the user is signed in.
  const userIdentifier = sessionUser.email || sessionUser.name;
  const userAvatar = sessionUser.avatarImageFile ? fileBlobPath(sessionUser.avatarImageFile) : DEFAULT_USER_AVATAR_IMAGE_PATH;
  return {
    mobile: Nav.authenticatedMobileAccountMenu([
      Nav.linkAccountAction({
        text: userIdentifier,
        dest: routeDest(adt('userProfile', { userId: sessionUser.id })),
        symbol_: leftPlacement(imageLinkSymbol(userAvatar)),
        active: state.activeRoute.tag === 'userProfile'
      }),
      Nav.linkAccountAction(signOutLink)
    ]),
    desktop: Nav.authenticatedDesktopAccountMenu({
      email: userIdentifier,
      dropdown: {
        imageUrl: userAvatar,
        linkGroups: [
          {
            label: `Signed in as ${sessionUser.name}`,
            links: compact([
              {
                text: 'My Profile',
                dest: routeDest(adt('userProfile', { userId: sessionUser.id }))
              },
              sessionUser.type === UserType.Vendor
                ? {
                    text: 'My Organizations',
                    dest: routeDest(adt('userProfile', { userId: sessionUser.id, tab: 'organizations' as const }))
                  }
                : undefined
            ])
          },
          {
            links: [signOutLink]
          }
        ]
      }
    })
  };
}

function navContextualLinks(state: Immutable<State>): Nav.Props['contextualLinks'] {
  const sessionUser = state.shared.session && state.shared.session.user;
  let left: Nav.NavLink[] = [];
  const opporunitiesLink: Nav.NavLink = {
    text: 'Opportunities',
    // TODO add opportunities route when available.
    active: state.activeRoute.tag === 'landing',
    dest: routeDest(adt('landing', null))
  };
  if (sessionUser) {
    // User has signed in.
    left = left.concat([
      {
        text: 'Dashboard',
        // TODO add dashboard route when available.
        active: state.activeRoute.tag === 'landing',
        dest: routeDest(adt('landing', null))
      },
      opporunitiesLink,
      {
        text: 'Organizations',
        active: state.activeRoute.tag === 'orgList',
        dest: routeDest(adt('orgList', null))
      }
    ]);
    if (sessionUser.type === UserType.Admin) {
      // User is an admin.
      left = left.concat([
        {
          text: 'Users',
          active: state.activeRoute.tag === 'userList',
          dest: routeDest(adt('userList', null))
        }
      ]);
    }
  } else {
    // User has not signed in.
    left = left.concat([
      {
        text: 'Home',
        active: state.activeRoute.tag === 'landing',
        dest: routeDest(adt('landing', null))
      },
      opporunitiesLink
    ]);
  }
  return {
    left,
    right: [{
      text: 'Procurement Concierge',
      dest: externalDest(PROCUREMENT_CONCIERGE_URL),
      newTab: true,
      symbol_: rightPlacement(iconLinkSymbol('external-link'))
    }]
  };
}

function regularNavProps({ state, dispatch }: ComponentViewProps<State, Msg>): Nav.Props {
  const dispatchNav = mapComponentDispatch(dispatch, adtCurried<ADT<'nav', Nav.Msg>>('nav'));
  return {
    state: state.nav,
    dispatch: dispatchNav,
    isLoading: state.transitionLoading > 0,
    logoImageUrl: '/images/bcgov_logo.svg',
    title: 'Digital Marketplace',
    homeDest: routeDest(adt('landing', null)),
    accountMenus: navAccountMenus(state),
    contextualLinks: navContextualLinks(state)
  };
}

function simpleNavProps(props: ComponentViewProps<State, Msg>): Nav.Props {
  const accountMenu = Nav.unauthenticatedAccountMenu([Nav.linkAccountAction({
    ...signOutLink,
    button: true,
    outline: true,
    color: 'white'
  })]);
  return {
    ...regularNavProps(props),
    contextualLinks: undefined,
    homeDest: undefined,
    accountMenus: {
      desktop: accountMenu,
      mobile: accountMenu
    }
  };
}

const view: ComponentView<State, Msg> = props => {
  const { state, dispatch } = props;
  if (!state.ready) {
    return null;
  } else {
    const viewPageProps = pageToViewPageProps(props);
    const navProps = viewPageProps.component.simpleNav
      ? simpleNavProps(props)
      : regularNavProps(props);
    return (
      <div className={`route-${state.activeRoute.tag} ${state.transitionLoading > 0 ? 'in-transition' : ''} app d-flex flex-column`} style={{ minHeight: '100vh' }}>
        <Nav.view {...navProps} />
        <ViewPage {...viewPageProps} />
        <Footer session={state.shared.session} />
        <ViewModal dispatch={dispatch} modal={state.modal} />
      </div>
    );
  }
};

export default view;
