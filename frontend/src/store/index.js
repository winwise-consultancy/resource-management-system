import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isFetching: true,
        Months: [],
        BusinessDays: [],
        BusinessDaysList: [],
        WorkDetailsHeaders: [],
        WorkDetailsItems: [],
        WorkOverviewHeaders: [],
        WorkOverviewPersonDaysItems: [],
        WorkOverviewPercentageItems: [],
        UpdatedWorkDetailsItems: new Map(),
        Organization: {},
        TreeData: [],
        TreeDataId: 0,
        FeedbackList: [],
    },
    actions,
    mutations,
    getters
})
