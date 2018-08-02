import pollWeb3 from "../util/pollWeb3";

let mutations = {
  registerWeb3Instance(state, payload) {
    console.log('registerWeb3instance Mutation being executed', payload)
    let result = payload
    let web3Copy = state.web3
    web3Copy.coinbase = result.coinbase
    web3Copy.networkId = result.networkId
    web3Copy.balance = parseInt(result.balance, 10)
    web3Copy.isInjected = result.injectedWeb3
    web3Copy.web3Instance = result.web3
    state.web3 = web3Copy
    pollWeb3()
  },
  pollWeb3Instance(state, payload) {
    console.log('pollWeb3Instance mutation being executed', payload)
    state.web3.coinbase = payload.coinbase
    state.web3.balance = parseInt(payload.balance, 10)
  },
  registerContractInstance(state, payload) {
    console.log('Casino contract instance: ', payload)
    state.contractInstance = () => payload
  }
};

export default mutations
