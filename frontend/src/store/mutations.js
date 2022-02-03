import CalendarData from "../../../storage/data/CalendarData.json";
import WorkDetailsData from "../../../storage/data/WorkDetailsData.json";
import WorkOverviewPersonDaysData from "../../../storage/data/WorkOverviewPersonDaysData.json";
import WorkOverviewPercentageData from "../../../storage/data/WorkOverviewPercentageData.json";
import FeedbackData from "../../../storage/data/FeedbackList.json";

function WorkDetailsAvailableBandwidthPersonDays(state, payload) {
    payload.item[payload.month + " Available Bandwidth (PD)"] =
        state.BusinessDaysList[payload.month] -
        (payload.item[payload.month + " Project Work"] +
            payload.item[payload.month + " Departmental Internal Work"] +
            payload.item[payload.month + " Vacation"]);
}

function WorkDetailsAvailableBandwidthPercentage(state, payload) {
    if (payload.businessDays && payload.businessDays != 0) {
        payload.item[payload.month + " Available Bandwidth (%)"] =
            Math.round(payload.item[payload.month + " Available Bandwidth (PD)"] * 100 / payload.businessDays)
    }
}

function WorkOverviewAvailableBandwidthPersonDays(state, payload) {
    let filteredItems = state.WorkOverviewPersonDaysItems.filter(e =>
        e.Department === payload.item["Department"])
    let filteredItem = filteredItems.find(e => e.Team === payload.item["Team"])
    filteredItem[payload.month] -= (payload.newValue - payload.currentValue)
}

function WorkOverviewAvailableBandwidthPercentage(state, payload) {
    let filteredItems = state.WorkDetailsItems.filter(e =>
        e.Department === payload.item["Department"])
    let filteredItem = filteredItems.filter(e => e.Team === payload.item["Team"])

    let sum = 0
    let length = filteredItem.length !== 0 ? filteredItem.length : 1
    filteredItem.forEach(e => {
        sum += e[payload.month + " Available Bandwidth (%)"]
    })

    let items = state.WorkOverviewPercentageItems.filter(e =>
        e.Department === payload.item["Department"])
    let item = items.find(e => e.Team === payload.item["Team"])
    item[payload.month] = Math.round(sum / length)
}

function UpdatedWorkDetailsItems(state, payload) {

    let currentItem = null
    let modifiedItem = null;

    if (state.UpdatedWorkDetailsItems.has(payload.item["rowid"])) {
        currentItem = state.UpdatedWorkDetailsItems.get(payload.item["rowid"]).currentItem
        modifiedItem = state.UpdatedWorkDetailsItems.get(payload.item["rowid"]).modifiedItem
    }
    else {
        currentItem = new Map()
        currentItem["Department"] = payload.item["Department"]
        currentItem["Team"] = payload.item["Team"]
        currentItem["Employee Name"] = payload.item["Employee Name"]

        modifiedItem = new Map()
        modifiedItem["Department"] = payload.item["Department"]
        modifiedItem["Team"] = payload.item["Team"]
        modifiedItem["Employee Name"] = payload.item["Employee Name"]
    }

    currentItem[payload.col] = payload.currentValue

    modifiedItem[payload.col] = payload.newValue
    modifiedItem[payload.month + " Available Bandwidth (PD)"] = payload.item[payload.month + " Available Bandwidth (PD)"]
    modifiedItem[payload.month + " Available Bandwidth (%)"] = payload.item[payload.month + " Available Bandwidth (%)"]

    state.UpdatedWorkDetailsItems.set(payload.item["rowid"],
        { "currentItem": currentItem, "modifiedItem": modifiedItem })
}

function computeBandwidth(state, payload) {
    WorkDetailsAvailableBandwidthPersonDays(state, payload)
    WorkDetailsAvailableBandwidthPercentage(state, payload)

    WorkOverviewAvailableBandwidthPersonDays(state, payload)
    WorkOverviewAvailableBandwidthPercentage(state, payload)

    UpdatedWorkDetailsItems(state, payload)
}

function loadCalendarData(state) {
    if (CalendarData && CalendarData.length > 0) {
        let Months = []
        let BusinessDays = []
        let BusinessDaysList = []
        CalendarData.forEach(e => {
            Months.push(e.Months)
            BusinessDays.push(e.BusinessDays)
            BusinessDaysList[e.Months] = e.BusinessDays
        })
        state.Months = Months
        state.BusinessDays = BusinessDays
        state.BusinessDaysList = BusinessDaysList
    }
}

function loadWorkDetailsData(state) {
    if (WorkDetailsData && WorkDetailsData.length > 0) {
        let WorkDetailsHeaders = []
        let k = Object.keys(WorkDetailsData[0])
        if (k) {
            k.forEach(e => {
                if (e != "rowid" && e != "Department" && e != "Team") {
                    WorkDetailsHeaders.push({ "text": e, "value": e })
                }
            })
        }
        state.WorkDetailsHeaders = WorkDetailsHeaders
        state.WorkDetailsItems = WorkDetailsData
    }
}

function loadWorkOverviewPersonDaysData(state) {
    if (WorkOverviewPersonDaysData && WorkOverviewPersonDaysData.length > 0) {
        let WorkOverviewHeaders = []
        let k = Object.keys(WorkOverviewPersonDaysData[0])
        if (k) {
            k.forEach(e => {
                WorkOverviewHeaders.push({ "text": e, "value": e })
            })
        }
        state.WorkOverviewHeaders = WorkOverviewHeaders
        state.WorkOverviewPersonDaysItems = WorkOverviewPersonDaysData
    }
}

function loadWorkOverviewPercentageData(state) {
    if (WorkOverviewPercentageData && WorkOverviewPercentageData.length > 0) {
        state.WorkOverviewPercentageItems = WorkOverviewPercentageData
    }
}

function loadOrganizationData(state) {
    let OrganizationData = new Map();
    let WorkDetailsItems = state.WorkDetailsItems;
    WorkDetailsItems.filter(function (elements) {
        let Teams = OrganizationData.has(elements.Department)
            ? OrganizationData.get(elements.Department)
            : new Set();
        Teams.add(elements.Team);
        OrganizationData.set(elements.Department, Teams);
    });
    state.OrganizationData = OrganizationData;
}

function onboard(state, DepartmentName, TeamName, EmployeeName) {
    let Department = state.TreeData.find(
        function (e) {
            return e.name === DepartmentName
        });
    if (!Department) {
        Department = { id: state.TreeDataId++, name: DepartmentName, children: [] }
        state.TreeData.push(Department)
    }

    let Team = Department.children.find(
        function (e) {
            return e.name === TeamName
        });

    if (!Team) {
        Team = { id: state.TreeDataId++, name: TeamName, children: [] }
        Department.children.push(Team)
    }

    // ToDo : remove
    Team.children.push({
        id: state.TreeDataId++, name: EmployeeName, events: [{
            name: "Departmental Internal Work",
            start: "2022-02-" + state.TreeDataId + " 00:00:00",
            end: "2022-02-" + (state.TreeDataId + 4) + " 23:59:59",
            color: "cyan",
        }]
    })
}

function loadTreeView(state) {
    state.WorkDetailsItems.filter(function (elements) {
        onboard(state, elements["Department"], elements["Team"], elements["Employee Name"])
    });
}

function loadFeedbackData(state) {
    state.FeedbackList = FeedbackData
}

function load(state) {
    state.isFetching = true
    loadCalendarData(state)
    loadWorkDetailsData(state)
    loadWorkOverviewPersonDaysData(state)
    loadWorkOverviewPercentageData(state)
    loadOrganizationData(state)
    loadTreeView(state)
    loadFeedbackData(state)
    state.isFetching = false
}

export default {
    load, computeBandwidth, onboard
}
