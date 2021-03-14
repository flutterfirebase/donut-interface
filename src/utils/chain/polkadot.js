import jsonrpc from '@polkadot/types/interfaces/jsonrpc';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

import { POLKADOT_WEB_SOCKET } from '../../config'

export const connect = (state, commit) => {
    const { apiState } = state;
    // We only want this function to be performed once
    if (apiState) return;
    commit('saveApiState', 'CONNECT_INIT')
  
    const provider = new WsProvider(POLKADOT_WEB_SOCKET);
    const _api = new ApiPromise({ provider, rpc: jsonrpc });
  
    // Set listeners for disconnection and reconnection event.
    _api.on('connected', () => {
        commit('saveApiState','CONNECT');
      // `ready` event is not emitted upon reconnection and is checked explicitly here.
      _api.isReady.then((_api) => commit('saveApiState','CONNECT_SUCCESS'));
    });
    _api.on('ready', () => commit('saveApiState','CONNECT_SUCCESS'));
    _api.on('error', err => commit('saveApiState','CONNECT_ERROR'));
  };

export const loadAccounts = (state, commit) => {
    const asyncLoadAccounts = async () => {
      try {
        await web3Enable(config.APP_NAME);
        let allAccounts = await web3Accounts();
        allAccounts = allAccounts.map(({ address, meta }) =>
          ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
        keyring.loadAll({ isDevelopment: config.DEVELOPMENT_KEYRING }, allAccounts);
        console.log('keyring:', keyring);
      } catch (e) {
        console.error(e);
      }
    };
    asyncLoadAccounts();
  };