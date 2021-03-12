
// Steem Config
export const STEEM_API_URLS = [
  process.env.STEEM_API_URL || 'https://api.steemitdev.com',
  'https://cn.steems.top',
  'https://api.steemit.com',
  'https://api.justyy.com',
  'https://aksaiapi.wherein.mobi'
]

export const STEEM_CONF_KEY = 'steemNodeKey'

export const LOCALE_KEY = 'localeLanguage'


export const POST_LINK_REG = /@[\w\.\-]+\/[\w\-]+\/?$/;


//  steem account
export const STEEM_DEX_ACCOUNT = process.env.STEEM_DEX_ACCOUNT || 'nutbox.dex'
export const STEEM_GAS_ACCOUNT = process.env.STEEM_GAS_ACCOUNT || 'nutbox.gas'
export const STEEM_MINE_ACCOUNT = process.env.STEEM_MINE_ACCOUNT || 'nutbox.mine'
export const STEEM_TSP_ACCOUNT = process.env.STEEM_TSP_ACCOUNT || 'nutbox-tsp'