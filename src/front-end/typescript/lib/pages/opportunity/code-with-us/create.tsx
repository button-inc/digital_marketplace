import { getAlertsValid, getContextualActionsValid, getModalValid, makePageMetadata, makeStartLoading, makeStopLoading, updateValid, viewValid } from 'front-end/lib';
import { isUserType } from 'front-end/lib/access-control';
import { Route, SharedState } from 'front-end/lib/app/types';
import { ComponentView, emptyPageAlerts, GlobalComponentMsg, immutable, Immutable, mapComponentDispatch, newRoute, PageComponent, PageInit, replaceRoute, Update, updateComponentChild } from 'front-end/lib/framework';
import * as Form from 'front-end/lib/pages/opportunity/code-with-us/lib/components/form';
import Link, { iconLinkSymbol, leftPlacement, routeDest } from 'front-end/lib/views/link';
import makeInstructionalSidebar from 'front-end/lib/views/sidebar/instructional';
import React from 'react';
import { CWUOpportunityStatus } from 'shared/lib/resources/opportunity/code-with-us';
import { UserType } from 'shared/lib/resources/user';
import { adt, ADT } from 'shared/lib/types';
import { invalid, valid, Validation } from 'shared/lib/validation';

type ModalId = 'publish' | 'cancel';

interface ValidState {
  showModal: ModalId | null;
  publishLoading: number;
  saveDraftLoading: number;
  showErrorAlert: 'publish' | 'save' | null;
  form: Immutable<Form.State>;
}

export type State = Validation<Immutable<ValidState>, null>;

type InnerMsg
  = ADT<'dismissErrorAlert'>
  | ADT<'showModal', ModalId>
  | ADT<'hideModal'>
  | ADT<'publish'>
  | ADT<'saveDraft'>
  | ADT<'form', Form.Msg>;

export type Msg = GlobalComponentMsg<InnerMsg, Route>;

export type RouteParams = null;

const init: PageInit<RouteParams, SharedState, State, Msg> = isUserType<RouteParams, State, Msg>({
  userType: [UserType.Government, UserType.Admin],
  async success() {
    return valid(immutable({
      showModal: null,
      publishLoading: 0,
      saveDraftLoading: 0,
      showErrorAlert: null,
      form: immutable(await Form.init({}))
    }));
  },
  async fail({ dispatch }) {
    dispatch(replaceRoute(adt('notice' as const, adt('notFound' as const))));
    return invalid(null);
  }
});

const startPublishLoading = makeStartLoading<ValidState>('publishLoading');
const stopPublishLoading = makeStopLoading<ValidState>('publishLoading');
const startSaveDraftLoading = makeStartLoading<ValidState>('saveDraftLoading');
const stopSaveDraftLoading = makeStopLoading<ValidState>('saveDraftLoading');

const update: Update<State, Msg> = updateValid(({ state, msg }) => {
  switch (msg.tag) {
    case 'dismissErrorAlert':
      return [state.set('showErrorAlert', null)];
    case 'showModal':
      return [state.set('showModal', msg.value)];
    case 'hideModal':
      return [state.set('showModal', null)];
    case 'publish':
    case 'saveDraft':
      const isPublish = msg.tag === 'publish';
      state = state.set('showModal', null);
      return [
        isPublish ? startPublishLoading(state) : startSaveDraftLoading(state),
        async (state, dispatch) => {
          const result = await Form.persist(state.form, adt('create', isPublish ? CWUOpportunityStatus.Published as const : CWUOpportunityStatus.Draft as const));
          switch (result.tag) {
            case 'valid':
              dispatch(newRoute(adt('opportunityCWUEdit' as const, {
                opportunityId: result.value[1].id,
                tab: isPublish ? 'summary' as const : 'opportunity' as const
              })));
              return state.set('form', result.value[0]);
            case 'invalid':
              state = isPublish ? stopPublishLoading(state) : stopSaveDraftLoading(state);
              return state
                .set('showErrorAlert', isPublish ? 'publish' : 'save')
                .set('form', result.value);
          }
        }
      ];

    case 'form':
      return updateComponentChild({
        state,
        childStatePath: ['form'],
        childUpdate: Form.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('form', value)
      });

    default:
      return [state];
  }
});

const view: ComponentView<State,  Msg> = viewValid(({ state, dispatch }) => {
  const isPublishLoading = state.publishLoading > 0;
  const isSaveDraftLoading = state.saveDraftLoading > 0;
  const isDisabled = isSaveDraftLoading || isPublishLoading;
  return (
    <div className='d-flex flex-column h-100 justify-content-between'>
      <Form.view
        state={state.form}
        dispatch={mapComponentDispatch(dispatch, value => adt('form' as const, value))}
        disabled={isDisabled}
      />
    </div>
  );
});

export const component: PageComponent<RouteParams,  SharedState, State, Msg> = {
  init,
  update,
  view,
  sidebar: {
    size: 'large',
    color: 'blue-light',
    view: makeInstructionalSidebar<State,  Msg>({
      getTitle: () => 'Create a Code With Us Opportunity',
      getDescription: () => 'Introductory text placeholder. Can provide brief instructions on how to create and manage an opportunity (e.g. save draft verion).',
      getFooter: () => (
        <span>
          Need help? <Link newTab color='primary' dest={routeDest(adt('content', 'code-with-us-opportunity-guide'))}>Read the guide</Link> for creating and managing a CWU opportunity
        </span>
      )
    })
  },
  getContextualActions: getContextualActionsValid(({ state, dispatch }) => {
    const isPublishLoading = state.publishLoading > 0;
    const isSaveDraftLoading = state.saveDraftLoading > 0;
    const isLoading = isPublishLoading || isSaveDraftLoading;
    const isValid = Form.isValid(state.form);
    return adt('links', [
      {
        children: 'Publish',
        symbol_: leftPlacement(iconLinkSymbol('bullhorn')),
        button: true,
        loading: isPublishLoading,
        disabled: isLoading || !isValid,
        color: 'primary',
        onClick: () => dispatch(adt('showModal', 'publish' as const))
      },
      {
        children: 'Save Draft',
        symbol_: leftPlacement(iconLinkSymbol('save')),
        loading: isSaveDraftLoading,
        disabled: isLoading,
        button: true,
        color: 'success',
        onClick: () => dispatch(adt('saveDraft'))
      },
      {
        children: 'Cancel',
        color: 'white',
        disabled: isLoading,
        onClick: () => dispatch(adt('showModal', 'cancel' as const))
      }
    ]);
  }),
  getAlerts: getAlertsValid(state => ({
    ...emptyPageAlerts(),
    errors: state.showErrorAlert
    ? [{
        text: `We were unable to ${state.showErrorAlert} your opportunity. Please fix the errors in the form below and try again.`,
        dismissMsg: adt('dismissErrorAlert')
      }]
      : []
  })),
  getModal: getModalValid<ValidState, Msg>(state => {
    switch (state.showModal) {
      case 'publish':
        return {
          title: 'Publish Code With Us Opportunity?',
          body: () => 'Are you sure you want to publish this opportunity? Once published, all subscribed users will be notified.',
          onCloseMsg: adt('hideModal'),
          actions: [
            {
              text: 'Publish Opportunity',
              icon: 'bullhorn',
              color: 'primary',
              msg: adt('publish'),
              button: true
            },
            {
              text: 'Cancel',
              color: 'secondary',
              msg: adt('hideModal')
            }
          ]
        };
      case 'cancel':
        return {
          title: 'Cancel New Code With Us Opportunity?',
          body: () => 'Are you sure you want to cancel? Any information you may have entered will be lost if you do so.',
          onCloseMsg: adt('hideModal'),
          actions: [
            {
              text: 'Yes, I want to cancel',
              color: 'danger',
              msg: newRoute(adt('opportunities' as const, null)),
              button: true
            },
            {
              text: 'Go Back',
              color: 'secondary',
              msg: adt('hideModal')
            }
          ]
        };
      case null:
        return null;
    }
  }),
  getMetadata() {
    return makePageMetadata('Create Code With Us Opportunity');
  }
};