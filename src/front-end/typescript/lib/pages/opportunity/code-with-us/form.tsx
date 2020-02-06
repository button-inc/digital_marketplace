import { makePageMetadata } from 'front-end/lib';
import { isUserType } from 'front-end/lib/access-control';
import { Route, SharedState } from 'front-end/lib/app/types';
import * as FormField from 'front-end/lib/components/form-field';
import * as DateField from 'front-end/lib/components/form-field/date';
import * as LongText from 'front-end/lib/components/form-field/long-text';
import * as ShortText from 'front-end/lib/components/form-field/short-text';
import { ComponentView, GlobalComponentMsg, immutable, Immutable, mapComponentDispatch, PageComponent, PageInit, Update, updateComponentChild } from 'front-end/lib/framework';
import * as api from 'front-end/lib/http/api';
import Link, { iconLinkSymbol, leftPlacement } from 'front-end/lib/views/link';
import Radio from 'front-end/lib/views/radio';
import makeInstructionalSidebar from 'front-end/lib/views/sidebar/instructional';
import React from 'react';
import { Col, Nav, NavItem, NavLink, Row } from 'reactstrap';
import * as CWUOpportunityResource from 'shared/lib/resources/code-with-us';
// import { CWUOpportunity } from 'shared/lib/resources/code-with-us';
import { UserType } from 'shared/lib/resources/user';
import { adt, ADT } from 'shared/lib/types';
import { ErrorTypeFrom, invalid, valid, Validation } from 'shared/lib/validation';
import * as opportunityValidation from 'shared/lib/validation/code-with-us';

type TabValues = 'Overview' | 'Description' | 'Details' | 'Attachments';

export interface State {
  activeTab: TabValues;

  // Overview Tab
  title: Immutable<ShortText.State>;
  teaser: Immutable<LongText.State>;
  location: Immutable<ShortText.State>;
  reward: Immutable<ShortText.State>;
  skills: Immutable<ShortText.State>;
  remoteOk: boolean;
    // If remoteOk
    remoteDesc: Immutable<ShortText.State>;

  // Description Tab
  description: Immutable<LongText.State>;

  // Details Tab
  proposalDeadline: Immutable<DateField.State>;
  startDate: Immutable<DateField.State>;
  assignmentDate: Immutable<DateField.State>;
  completionDate: Immutable<DateField.State>;
  submissionInfo: Immutable<ShortText.State>;
  acceptanceCriteria: Immutable<LongText.State>;
  evaluationCriteria: Immutable<LongText.State>;

  // Attachments tab
  // TODO(Jesse): Do attachments @file-attachments
  // attachments: File[];
}

type InnerMsg
  = ADT<'updateActiveTab',   TabValues>

  // Details Tab
  | ADT<'title',             ShortText.Msg>
  | ADT<'teaser',            LongText.Msg>
  | ADT<'location',          ShortText.Msg>
  | ADT<'reward',            ShortText.Msg>
  | ADT<'skills',            ShortText.Msg>
  | ADT<'remoteOk',          boolean>
  | ADT<'remoteDesc',        ShortText.Msg>

  // Description Tab
  | ADT<'description',       LongText.Msg>

  // Details Tab
  | ADT<'proposalDeadline',    DateField.Msg>
  | ADT<'startDate',           DateField.Msg>
  | ADT<'assignmentDate',      DateField.Msg>
  | ADT<'completionDate',      DateField.Msg>
  | ADT<'submissionInfo',      ShortText.Msg>
  | ADT<'acceptanceCriteria',  LongText.Msg>
  | ADT<'evaluationCriteria',  LongText.Msg>

  // Attachments tab
  // @file-attachments
  ;

export type Msg = GlobalComponentMsg<InnerMsg, Route>;

export type RouteParams = null;

export function validateRewardString(raw: string): Validation<string> {
  const validationResult = opportunityValidation.validateReward(parseInt(raw, 10));
  if (validationResult.tag === 'valid') {
    const value = validationResult.value.toString();
    return({ tag: 'valid', value });
  } else {
    return validationResult;
  }
}

export function validateDate(raw: DateField.Value): Validation<DateField.Value> {
  const value = DateField.valueToString(raw);
  if (opportunityValidation.validateDate(value).tag === 'valid') {
    return valid(raw);
  } else {
    return invalid(['Please enter a valid date.']);
  }
}

export async function defaultState() {
  return {
    activeTab: 'Overview' as const,
    remoteOk: true,

    title: immutable(await ShortText.init({
      errors: [],
      validate: opportunityValidation.validateTitle,
      child: {
        type: 'text',
        value: '',
        id: 'opportunity-title'
      }
    })),

    teaser: immutable(await LongText.init({
      errors: [],
      validate: opportunityValidation.validateTeaser,
      child: {
        value: '',
        id: 'opportunity-teaser'
      }
    })),

    location: immutable(await ShortText.init({
      errors: [],
      validate: opportunityValidation.validateLocation,
      child: {
        type: 'text',
        value: '',
        id: 'opportunity-location'
      }
    })),

    reward: immutable(await ShortText.init({
      errors: [],
      validate: validateRewardString,
      child: {
        type: 'text',
        value: '',
        id: 'opportunity-reward'
      }
    })),

    skills: immutable(await ShortText.init({
      errors: [],
      validate: opportunityValidation.validateTitle, // TODO(Dhruv): change to validateSkills during/after creation of skills component
      child: {
        type: 'text',
        value: '',
        id: 'opportunity-skills'
      }
    })),

    remoteDesc: immutable(await ShortText.init({
      errors: [],
      validate: opportunityValidation.validateRemoteDesc,
      child: {
        type: 'text',
        value: '',
        id: 'opportunity-remote-desc'
      }
    })),

    description: immutable(await LongText.init({
      errors: [],
      validate: opportunityValidation.validateDescription,
      child: {
        value: '',
        id: 'opportunity-description'
      }
    })),

    proposalDeadline: immutable(await DateField.init({
      errors: [],
      validate: validateDate,
      child: {
        value: null,
        id: 'opportunity-proposal-deadline'
      }
    })),

    startDate: immutable(await DateField.init({
      errors: [],
      validate: validateDate,
      child: {
        value: null,
        id: 'opportunity-start-date'
      }
    })),

    assignmentDate: immutable(await DateField.init({
      errors: [],
      validate: validateDate,
      child: {
        value: null,
        id: 'opportunity-assignment-date'
      }
    })),

    completionDate: immutable(await DateField.init({
      errors: [],
      validate: validateDate,
      child: {
        value: null,
        id: 'opportunity-completion-date'
      }
    })),

    submissionInfo: immutable(await ShortText.init({
      errors: [],
      validate: opportunityValidation.validateSubmissionInfo,
      child: {
        type: 'text',
        value: '',
        id: 'opportunity-submission-info'
      }
    })),

    acceptanceCriteria: immutable(await LongText.init({
      errors: [],
      validate: opportunityValidation.validateAcceptanceCriteria,
      child: {
        value: '',
        id: 'opportunity-acceptance-criteria'
      }
    })),

    evaluationCriteria: immutable(await LongText.init({
      errors: [],
      validate: opportunityValidation.validateEvaluationCriteria,
      child: {
        value: '',
        id: 'opportunity-evaluation-criteria'
      }
    }))

  };
}

const init: PageInit<RouteParams, SharedState, State, Msg> = isUserType({
  userType: [UserType.Vendor, UserType.Government, UserType.Admin], // TODO(Jesse): Which users should be here?
  async success() {
    return {
      ...(await defaultState())
    };
  },
  async fail() {
    return {
      ...(await defaultState())
    };
  }
});

function setErrors(state: Immutable<State>, errors?: Errors): Immutable<State> {
  if (errors) {
    return state
      .update('title',              s => FormField.setErrors(s, errors.title              || []))
      .update('teaser',             s => FormField.setErrors(s, errors.teaser             || []))
      .update('location',           s => FormField.setErrors(s, errors.location           || []))
      .update('reward',             s => FormField.setErrors(s, errors.reward             || []))
      .update('skills',             s => FormField.setErrors(s, errors.skills             || []))
      .update('description',        s => FormField.setErrors(s, errors.description        || []))
      .update('remoteDesc',         s => FormField.setErrors(s, errors.remoteDesc         || []))
      .update('proposalDeadline',   s => FormField.setErrors(s, errors.proposalDeadline   || []))
      .update('startDate',          s => FormField.setErrors(s, errors.startDate          || []))
      .update('assignmentDate',     s => FormField.setErrors(s, errors.assignmentDate     || []))
      .update('completionDate',     s => FormField.setErrors(s, errors.completionDate     || []))
      .update('submissionInfo',     s => FormField.setErrors(s, errors.submissionInfo     || []))
      .update('acceptanceCriteria', s => FormField.setErrors(s, errors.acceptanceCriteria || []))
      .update('evaluationCriteria', s => FormField.setErrors(s, errors.evaluationCriteria || []));
  } else {
    return state;
  }
}

type Errors = ErrorTypeFrom<CWUOpportunityResource.CreateRequestBody>;

function getFormValues(state: State, status: CWUOpportunityResource.CWUOpportunityStatus): CWUOpportunityResource.CreateRequestBody {

  const proposalDeadline = FormField.getValue(state.proposalDeadline);
  const startDate        = FormField.getValue(state.startDate);
  const assignmentDate   = FormField.getValue(state.assignmentDate);
  const completionDate   = FormField.getValue(state.completionDate);

  const result = {
    title:               FormField.getValue(state.title),
    teaser:              FormField.getValue(state.teaser),
    remoteOk:            state.remoteOk,
    remoteDesc:          FormField.getValue(state.remoteDesc),
    location:            FormField.getValue(state.location),
    reward:              Number.parseInt(FormField.getValue(state.reward), 10),
    skills:              [FormField.getValue(state.skills)], // TODO(Jesse): How's this going to work?
    description:         FormField.getValue(state.description),

    proposalDeadline:    DateField.valueToString(proposalDeadline),
    assignmentDate:      DateField.valueToString(assignmentDate),
    startDate:           DateField.valueToString(startDate),
    completionDate:      DateField.valueToString(completionDate),

    submissionInfo:      FormField.getValue(state.submissionInfo),
    acceptanceCriteria:  FormField.getValue(state.acceptanceCriteria),
    evaluationCriteria:  FormField.getValue(state.evaluationCriteria),

    status,

    attachments: [],
    addenda: []
  };

  return result;
}

export async function persist(state: State, status: CWUOpportunityResource.CWUOpportunityStatus): Promise<Validation<State, string[]>> {
  const formValues: CWUOpportunityResource.CreateRequestBody = getFormValues(state, status);
  const apiResult = await api.cwuOpportunity.create(formValues);

  switch (apiResult.tag) {
    case 'valid':
      return valid(state);
    case 'unhandled':
    case 'invalid':
      setErrors(immutable(state), apiResult.value);
      return invalid(['Error creating the Opportunity.']);
  }
}

export const update: Update<State, Msg> = ({ state, msg }) => {
  switch (msg.tag) {

    case 'remoteOk':
      return[state.set('remoteOk', msg.value)];

    case 'updateActiveTab':
      return [state.set('activeTab', msg.value)];

    case 'title':
      return updateComponentChild({
        state,
        childStatePath: ['title'],
        childUpdate: ShortText.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('title', value)
      });

    case 'teaser':
      return updateComponentChild({
        state,
        childStatePath: ['teaser'],
        childUpdate: LongText.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('teaser', value)
      });

    case 'location':
      return updateComponentChild({
        state,
        childStatePath: ['location'],
        childUpdate: ShortText.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('location', value)
      });

    case 'reward':
      return updateComponentChild({
        state,
        childStatePath: ['reward'],
        childUpdate: ShortText.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('reward', value)
      });

    case 'skills':
      return updateComponentChild({
        state,
        childStatePath: ['skills'],
        childUpdate: ShortText.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('skills', value)
      });

    case 'remoteDesc':
      return updateComponentChild({
        state,
        childStatePath: ['remoteDesc'],
        childUpdate: ShortText.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('remoteDesc', value)
      });

    case 'description':
      return updateComponentChild({
        state,
        childStatePath: ['description'],
        childUpdate: LongText.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('description', value)
      });

    case 'proposalDeadline':
      return updateComponentChild({
        state,
        childStatePath: ['proposalDeadline'],
        childUpdate: DateField.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('proposalDeadline', value)
      });

    case 'startDate':
      return updateComponentChild({
        state,
        childStatePath: ['startDate'],
        childUpdate: DateField.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('startDate', value)
      });

    case 'assignmentDate':
      return updateComponentChild({
        state,
        childStatePath: ['assignmentDate'],
        childUpdate: DateField.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('assignmentDate', value)
      });

    case 'completionDate':
      return updateComponentChild({
        state,
        childStatePath: ['completionDate'],
        childUpdate: DateField.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('completionDate', value)
      });

    case 'submissionInfo':
      return updateComponentChild({
        state,
        childStatePath: ['submissionInfo'],
        childUpdate: ShortText.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('submissionInfo', value)
      });

    case 'acceptanceCriteria':
      return updateComponentChild({
        state,
        childStatePath: ['acceptanceCriteria'],
        childUpdate: LongText.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('acceptanceCriteria', value)
      });

    case 'evaluationCriteria':
      return updateComponentChild({
        state,
        childStatePath: ['evaluationCriteria'],
        childUpdate: LongText.update,
        childMsg: msg.value,
        mapChildMsg: (value) => adt('evaluationCriteria', value)
      });

    default:
      return [state];
  }
};

const OverviewView: ComponentView<State, Msg> = ({ state, dispatch }) => {
  return (
    <Row>

      <Col xs='12'>
        <ShortText.view
          extraChildProps={{}}
          label='Title'
          required
          state={state.title}
          dispatch={mapComponentDispatch(dispatch, value => adt('title' as const, value))} />
      </Col>

      <Col xs='12'>
        <LongText.view
          extraChildProps={{}}
          label='Teaser'
          state={state.teaser}
          dispatch={mapComponentDispatch(dispatch, value => adt('teaser' as const, value))} />
      </Col>

      <Col md='12' className='py-2'>
        <div className=''><strong>Remote Ok?</strong></div>
          <Radio
            id='remote-ok-true'
            label='Yes'
            checked={state.remoteOk}
            onClick={ () => { dispatch(adt('remoteOk' as const, true)); } } />
          <Radio
            id='remote-ok-false'
            label='No'
            checked={!state.remoteOk}
            onClick={ () => { dispatch(adt('remoteOk' as const, false)); } } />
      </Col>

      { state.remoteOk ?
          <Col xs='12'>
            <ShortText.view
              extraChildProps={{}}
              label='Remote Description'
              state={state.remoteDesc}
              dispatch={mapComponentDispatch(dispatch, value => adt('remoteDesc' as const, value))} />
          </Col>
          :
          null
      }

      <Col md='8' xs='12'>
        <ShortText.view
          extraChildProps={{}}
          label='Location'
          required
          state={state.location}
          dispatch={mapComponentDispatch(dispatch, value => adt('location' as const, value))} />
      </Col>

      <Col md='8' xs='12'>
        <ShortText.view
          extraChildProps={{}}
          label='Fixed-Price Reward'
          required
          state={state.reward}
          dispatch={mapComponentDispatch(dispatch, value => adt('reward' as const, value))} />
      </Col>

      <Col xs='12'>
        <ShortText.view
          extraChildProps={{}}
          label='Required Skills'
          required
          state={state.skills}
          dispatch={mapComponentDispatch(dispatch, value => adt('skills' as const, value))} />
      </Col>

    </Row>
  );
};

const DescriptionView: ComponentView<State,  Msg> = ({ state, dispatch }) => {
  return (
    <Row>

      <Col xs='12'>
        <LongText.view
          extraChildProps={{}}
          label='Description'
          state={state.description}
          dispatch={mapComponentDispatch(dispatch, value => adt('description' as const, value))} />
      </Col>

    </Row>
  );
};

const DetailsView: ComponentView<State,  Msg> = ({ state, dispatch }) => {
  return (
    <Row>

      <Col xs='12' md='6'>
        <Col xs='12'>
          <DateField.view
            required
            extraChildProps={{}}
            label='Proposal Deadline'
            state={state.proposalDeadline}
            dispatch={mapComponentDispatch(dispatch, value => adt('proposalDeadline' as const, value))} />
        </Col>
        <Col xs='12'>
          <DateField.view
            required
            extraChildProps={{}}
            label='Start Date'
            state={state.startDate}
            dispatch={mapComponentDispatch(dispatch, value => adt('startDate' as const, value))} />
        </Col>
      </Col>

      <Col xs='12' md='6'>
        <Col xs='12'>
          <DateField.view
            required
            extraChildProps={{}}
            label='Assignment Date'
            state={state.assignmentDate}
            dispatch={mapComponentDispatch(dispatch, value => adt('assignmentDate' as const, value))} />
        </Col>
        <Col xs='12'>
          <DateField.view
            required
            extraChildProps={{}}
            label='Assignment Date'
            state={state.completionDate}
            dispatch={mapComponentDispatch(dispatch, value => adt('completionDate' as const, value))} />
        </Col>
      </Col>

      <Col xs='12'>
        <ShortText.view
          extraChildProps={{}}
          label='Project Submission Info'
          state={state.submissionInfo}
          dispatch={mapComponentDispatch(dispatch, value => adt('submissionInfo' as const, value))} />
      </Col>

      <Col xs='12'>
        <LongText.view
          required
          extraChildProps={{}}
          label='Acceptance Criteria'
          state={state.acceptanceCriteria}
          dispatch={mapComponentDispatch(dispatch, value => adt('acceptanceCriteria' as const, value))} />
      </Col>

      <Col xs='12'>
        <LongText.view
          required
          extraChildProps={{}}
          label='Evaluation Criteria'
          state={state.evaluationCriteria}
          dispatch={mapComponentDispatch(dispatch, value => adt('evaluationCriteria' as const, value))} />
      </Col>

    </Row>
  );
};

// @duplicated-attachments-view
const AttachmentsView: ComponentView<State,  Msg> = ({ state, dispatch }) => {
  return (
    <Row>
      <Col xs='12'>

        <p>
          Note(Jesse): Regarding the copy, I believe being exhaustive and
          explicit on which file formats are accepted is better than having an
          etc.
        </p>
        <p>
          Upload any supporting material for your opportunity here. Accepted file
          formats are pdf, jpeg, jpg.
        </p>

        <Link
          button
          color='primary'
          symbol_={leftPlacement(iconLinkSymbol('cog'))}
        >
          Add Attachment
        </Link>

      </Col>
    </Row>
  );
};

// @duplicated-tab-helper-functions
function isActiveTab(state: State, activeTab: TabValues): boolean {
  const Result: boolean = state.activeTab === activeTab;
  return Result;
}

// @duplicated-tab-helper-functions
function renderTab(params: any, tabName: TabValues): JSX.Element {
  const state = params.state;
  const dispatch = params.dispatch;
  return (
    <NavItem>
      <NavLink active={isActiveTab(state, tabName)} onClick={() => {dispatch(adt('updateActiveTab', tabName)); }}> {tabName} </NavLink>
    </NavItem>
  );
}

const view: ComponentView<State,  Msg> = (params) => {
  const state = params.state;

  let activeView = <div>No Active view selected</div>;
  switch (state.activeTab) {
    case 'Overview': {
      activeView = <OverviewView {...params} /> ;
      break;
    }
    case 'Description': {
      activeView = <DescriptionView {...params} /> ;
      break;
    }
    case 'Details': {
      activeView = <DetailsView {...params} /> ;
      break;
    }
    case 'Attachments': {
      activeView = <AttachmentsView {...params} /> ;
      break;
    }
  }

  return (
    <div className='d-flex flex-column h-100 justify-content-between'>
      <div>
        <Nav tabs className='mb-5'>
          {renderTab(params, 'Overview')}
          {renderTab(params, 'Description')}
          {renderTab(params, 'Details')}
          {renderTab(params, 'Attachments')}
        </Nav>

        {activeView}
      </div>
    </div>
  );
};

export const component: PageComponent<RouteParams,  SharedState, State, Msg> = {
  init,
  update,
  view,
  sidebar: {
    size: 'large',
    color: 'light-blue',
    view: makeInstructionalSidebar<State,  Msg>({
      getTitle: () => 'Create a Code With Us Opportunity',
      getDescription: () => 'Intruductory text placeholder.  Can provide brief instructions on how to create and manage an opportunity (e.g. save draft verion).',
      getFooter: () => (
        <span>
          Need help? <a href='# TODO(Jesse): Where does this point?'>Read the guide</a> for creating and managing a CWU opportunity
        </span>
      )
    })
  },
  getMetadata() {
    return makePageMetadata('Create Opportunity');
  }
};
