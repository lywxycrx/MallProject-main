export default {
    state: {
      highContrastMode: false
    },
    mutations: {
      toggleHighContrastMode(state) {
        state.highContrastMode = !state.highContrastMode;
        // 保存到 localStorage 以便在页面刷新后保持状态
        localStorage.setItem('highContrastMode', state.highContrastMode);
      },
      setHighContrastMode(state, value) {
        state.highContrastMode = value;
        localStorage.setItem('highContrastMode', value);
      }
    },
    actions: {
      initHighContrastMode({ commit }) {
        // 从 localStorage 恢复状态
        const savedMode = localStorage.getItem('highContrastMode');
        if (savedMode !== null) {
          commit('setHighContrastMode', savedMode === 'true');
        }
      }
    },
    getters: {
      highContrastMode: state => state.highContrastMode
    }
  };