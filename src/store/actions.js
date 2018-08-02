import getContract from "../util/getContract";
import getWeb3 from "../util/getWeb3";

let actions = {
  registerWeb3({commit}) {
    console.log('registerWeb3 Action being executed')
    getWeb3.then(result => {
      console.log('committing result to registerWeb3Instance mutation')
      commit('registerWeb3Instance', result)
    }).catch(e => {
      console.log('error in action registerWeb3', e)
    })
  },
  pollWeb3({commit}, payload) {
    console.log('pollWeb3 action being executed')
    commit('pollWeb3Instance', payload)
  },
  getContractInstance({commit}) {
    getContract.then(result => {
      commit('registerContractInstance', result)
    }).catch(e => console.log(e))
  }
};

export default actions
