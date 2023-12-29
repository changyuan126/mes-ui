const state = {
  companyImg:localStorage.getItem("logo"),
  isLogo:false
}

const mutations = {
  SET_LOGO(state,img){
    state.companyImg = img
  },
  SET_IS_LOGO(state,isLogo) {
    state.isLogo = isLogo;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
}
