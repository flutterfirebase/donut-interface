import jsonrpc from '@polkadot/types/interfaces/jsonrpc';

import {
  ApiPromise,
  WsProvider
} from '@polkadot/api';
import {
  web3Accounts,
  web3Enable
} from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

import {
  POLKADOT_WEB_SOCKET,
  DONUT_PRECISION
} from '../../config'

export const connect = (state, commit, callback) => {
  const {
    apiState
  } = state;
  // We only want this function to be performed once
  if (apiState) return;
  commit('saveApiState', {
    'apiState': 'CONNECT_INIT'
  })

  const provider = new WsProvider(POLKADOT_WEB_SOCKET);
  const _api = new ApiPromise({
    provider,
    rpc: jsonrpc
  });

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    commit('saveApiState', {
      'apiState': 'CONNECT',
      _api
    });
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then((_api) => commit('saveApiState', {
      'apiState': 'CONNECT_SUCCESS'
    }));
  });
  _api.on('ready', () => {
    commit('saveApiState', {
      'apiState': 'CONNECT_SUCCESS'
    });
    if (callback) {
      console.log('call back');
      callback(_api);
    }
  });
  _api.on('error', err => {
    console.error('connect error', err);
    commit('saveApiState', {
      'apiState': 'CONNECT_ERROR'
    })
  });
};

export const loadAccounts = async (store) => {
  try {
    await web3Enable('Donut');
    let allAccounts = await web3Accounts();
    allAccounts = allAccounts.map(({
        address,
        meta
      }) =>
      ({
        address,
        meta: {
          ...meta,
          name: `${meta.name} (${meta.source})`
        }
      }));
    keyring.loadAll({
      isDevelopment: true
    }, allAccounts);
    if (store.state.donutAccount) {
      store.dispatch('saveDonutAccount', store.state.donutAccount)
    } else {
      store.commit('savePolkadotAccounts', allAccounts)
    }
    console.log('keyring:', keyring);
    console.log('accs:', allAccounts);

    // TODO: let user choose which injected user they use rather than default accounts[0]
    // Give user a drop-down list to choose from the injected accounts
  } catch (e) {
    console.error(e);
  }
};

export const getAccountBalance = async (acc, api) => {
  const { nonce, data: balance } = await api.query.system.account(acc.address)
  return balance.free / DONUT_PRECISION
}