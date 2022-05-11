import config from '../../config'
import axios from 'axios'

const users = {
	state() {
		return {
			user: null,
		}
	},
	getters: {
		user: (state) => state.user,
	},
	actions: {
		async login({ commit }, payload) {
			try {
				const result = await axios({
					method: 'post',
					url: `${config.API_URL}/login`,
					data: payload,
				})
				localStorage.setItem('user', JSON.stringify(result.data));
                const user = result.data

				commit('SET_USER', user)
			} catch (error) {
                return error.response.data.errors
			}
		},
	},
	mutations: {
		SET_USER(state, user) {
			state.user = user
			// localStorage.setItem('user', data.user);
		},
	},
}

export default users
