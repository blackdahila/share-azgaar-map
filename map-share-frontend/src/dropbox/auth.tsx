import camelCase from 'camelcase';
import { Component, h } from 'hyperapp';

import { dbx } from './dbx';
// tslint:disable-next-line:no-import-side-effect
import './styles.scss';

const AUTHENTICATION_URL = dbx.getAuthenticationUrl(`${location.href}auth`);

function parseQueryString(query: string) {
  const ret: { [k: string]: string[] | string | null } = Object.create(null);

  if (typeof query !== 'string') {
    return ret;
  }

  const str = query.trim().replace(/^(\?|#|&)/, '');

  if (!str) {
    return ret;
  }

  str.split('&').forEach(param => {
    const parts = param.replace(/\+/g, ' ').split('=');
    let key = parts.shift();
    let val: string | undefined | null =
      parts.length > 0 ? parts.join('=') : undefined;

    key = decodeURIComponent(key || '');

    val = val === undefined ? '' : decodeURIComponent(val);

    const retVal = ret[key];
    if (ret[key] === undefined) {
      ret[key] = val;
    } else if (Array.isArray(retVal)) {
      retVal.push(val);
    } else {
      ret[key] = [ret[key] as string, val];
    }
  });

  return ret;
}

export const state = {
  auth: {
    data: null,
  },
};

export type State = typeof state;

export const actions = {
  auth: {
    parseDropboxQuery: () => {
      const data = parseQueryString(location.hash);
      location.hash = '';

      return { data };
    },
  },
};

export type Actions = typeof actions;

export type LoginButtonAttrs = {};
export const LoginButton: Component<LoginButtonAttrs> = () => (
  <a className="anchor-button button button--big" href={AUTHENTICATION_URL}>
    Login
  </a>
);

export type AdminLoginLinkAttrs = {};
export const AdminLoginLink: Component<AdminLoginLinkAttrs> = () => (
  <a className="admin-login-link" href={AUTHENTICATION_URL}>
    admin
  </a>
);

export function handleDropboxAuthQueryString(main: Actions) {
  if (location.pathname === '/auth') {
    main.auth.parseDropboxQuery();
  }
}
