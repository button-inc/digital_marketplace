import { ComponentView, Init, Update, View } from 'front-end/lib/framework';
import Icon, { AvailableIcons } from 'front-end/lib/views/icon';
import Link, { Dest, iconLinkSymbol, leftPlacement } from 'front-end/lib/views/link';
import Sticky from 'front-end/lib/views/sidebar/sticky';
import React from 'react';
import { ADT, adt } from 'shared/lib/types';

export interface SidebarLink {
  text: string;
  icon: AvailableIcons;
  active: boolean;
  dest?: Dest;
  onClick?(): void;
}

export interface State {
  isOpen: boolean;
  links: SidebarLink[];
}

export type Params = Pick<State, 'links'>;

export type Msg
  = ADT<'toggleOpen', boolean | undefined>;

export const init: Init<Params, State> = async ({ links }) => ({
  isOpen: false,
  links
});

export const update: Update<State, Msg> = ({ state, msg }) => {
  switch (msg.tag) {
    case 'toggleOpen':
      return [state.update('isOpen', v => msg.value !== undefined ? msg.value : !v)];
  }
};

interface SidebarLinkProps extends SidebarLink {
  className?: string;
  caret?: 'up' | 'down';
}

const SidebarLink: View<SidebarLinkProps> = props => {
  const { caret, className = '', dest, onClick, icon, text, active } = props;
  return (
    <Link
      button
      dest={dest}
      onClick={onClick}
      symbol_={leftPlacement(iconLinkSymbol(icon))}
      symbolClassName={`align-self-start mt-1 text-${active ? 'primary' : 'info'}`}
      color={active ? 'info' : 'light'}
      className={`${className} ta-left text-wrap ${active ? '' : 'text-primary'}`}>
      <span className={caret ? 'mr-2' : undefined}>{text}</span>
      {caret
        ? (<Icon name='caret-down' color='white' className='ml-auto align-self-start mt-1' style={{ transform: caret === 'up' ? 'rotate(180deg)' : undefined }}/>)
        : null}
    </Link>
  );
};

const linksByActive = (links: SidebarLink[], activePredicate: boolean) => links.filter(({ active }) => active === activePredicate);

export const view: ComponentView<State, Msg> = props => {
  const { state, dispatch } = props;
  if (!state.links.length) { return null; }
  const [activeLink, ...otherActiveLinks] = linksByActive(state.links, true);
  const inactiveLinks = linksByActive(state.links, false);
  return (
    <Sticky>
      <div className='d-none d-md-flex flex-column flex-nowrap align-items-start'>
        {state.links.map((props, i) => (<SidebarLink {...props} className='mb-2' key={`desktop-sidebar-link-${i}`} />))}
      </div>
      <div className='d-flex flex-column flex-nowrap align-items-stretch d-md-none position-relative'>
        <SidebarLink
          {...activeLink}
          caret={state.isOpen ? 'up' : 'down'}
          dest={undefined}
          onClick={() => {
            dispatch(adt('toggleOpen'));
          }} />
        <div
          className='position-absolute w-100 flex-column flex-nowrap align-items-stretch rounded overflow-hidden border shadow-sm'
          style={{
            display: state.isOpen ? 'flex' : 'none',
            top: '100%',
            left: 0,
            zIndex: 99
          }}>
          {[...otherActiveLinks, ...inactiveLinks].map((link, i) => (
            <SidebarLink {...link} active={false} className='rounded-0' key={`mobile-sidebar-link-${i}`} />
          ))}
        </div>
      </div>
    </Sticky>
  );
};
