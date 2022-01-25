const dbController = require('./dbController')
const fileController = require('./fileController')
const fs = require('fs')

const sqls = {
    createCalendar: fs.readFileSync('../../storage/sqls/createCalendar.sql').toString(),
    createRMSData: fs.readFileSync('../../storage/sqls/createRMSData.sql').toString(),
    createRMSAudit: fs.readFileSync('../../storage/sqls/createRMSAudit.sql').toString(),
    deleteRMSData: fs.readFileSync('../../storage/sqls/deleteRMSData.sql').toString(),
    insertCalendarData: fs.readFileSync('../../storage/sqls/insertCalendarData.sql').toString(),
    insertRMSData: fs.readFileSync('../../storage/sqls/insertRMSData.sql').toString(),
    insertRMSAuditData: fs.readFileSync('../../storage/sqls/insertRMSAuditData.sql').toString(),
    loadCalendarData: fs.readFileSync('../../storage/sqls/loadCalendarData.sql').toString(),
    loadWorkDetailsData: fs.readFileSync('../../storage/sqls/loadWorkDetailsData.sql').toString(),
    loadWorkOverviewPersonDaysData: fs.readFileSync('../../storage/sqls/loadWorkOverviewPersonDaysData.sql').toString(),
    loadWorkOverviewPercentageData: fs.readFileSync('../../storage/sqls/loadWorkOverviewPercentageData.sql').toString(),
}

const constants = {
    dbName: '../../storage/data/rms.db',
    CalendarDataFile: '../../storage/data/CalendarData.json',
    WorkDetailsDataFile: '../../storage/data/WorkDetailsData.json',
    WorkOverviewPersonDaysDataFile: '../../storage/data/WorkOverviewPersonDaysData.json',
    WorkOverviewPercentageDataFile: '../../storage/data/WorkOverviewPercentageData.json',
}

let loadQueryList = [
    { func: "all", sql: sqls.loadWorkDetailsData, result: constants.WorkDetailsDataFile },
    { func: "all", sql: sqls.loadWorkOverviewPersonDaysData, result: constants.WorkOverviewPersonDaysDataFile },
    { func: "all", sql: sqls.loadWorkOverviewPercentageData, result: constants.WorkOverviewPercentageDataFile }
]

async function init() {

    let createList =
        [{ func: "run", sql: sqls.createRMSData },
        { func: "run", sql: sqls.createRMSAudit },
        { func: "run", sql: sqls.createCalendar },
        { func: "run", sql: sqls.insertCalendarData },
        { func: "all", sql: sqls.loadCalendarData, result: constants.CalendarDataFile }]
    createList.push(...loadQueryList)
    dbController.execute(constants.dbName, createList)
}

async function onBoard(data) {

    if (data.length == 0) { console.log("Empty data for `onBoard` function."); return; }

    let insertQueryList = [
        {
            func: "run", sql: sqls.insertRMSData,
            params: [data.Department, data.Team, data.Name, ...data.Bandwidth, ...data.PercentageBandwidth]
        },
        {
            func: "run", sql: sqls.insertRMSAuditData,
            params: [
                new Date().toLocaleString()
                , 'onBoard'
                , 'currentUser'
                , JSON.stringify({ "Department": data.Department, "Team": data.Team, "Name": data.Name })
            ]
        }]
    insertQueryList.push(...loadQueryList)
    dbController.execute(constants.dbName, insertQueryList)
}

function offBoard(data) {

    if (data.length == 0) { console.log("Empty data for `offBoard` function."); return; }

    let deleteQueryList = [
        {
            func: "run", sql: sqls.deleteRMSData,
            params: [data.Department, data.Team, data.Name]
        },
        {
            func: "run", sql: sqls.insertRMSAuditData,
            params: [
                new Date().toLocaleString()
                , 'offBoard'
                , 'currentUser'
                , JSON.stringify(data)]
        }]
    deleteQueryList.push(...loadQueryList)
    dbController.execute(constants.dbName, deleteQueryList)
}

function load() {
    dbController.execute(constants.dbName, loadQueryList)
}

function save(data) {

    if (data.length == 0) { console.log("Empty data for `save` function."); return; }

    let saveQueryList = []
    data.forEach(row => {
        const keys = Object.keys(row.modifiedItem)
        const values = Object.values(row.modifiedItem)
        let columns = []
        keys.forEach(k => { columns.push("[" + k + "] = ? ") })

        saveQueryList.push(
            {
                func: "run", sql: sqls.insertRMSAuditData,
                params: [
                    new Date().toLocaleString()
                    , 'update'
                    , 'currentUser'
                    , JSON.stringify(row.modifiedItem)
                    , JSON.stringify(row.currentItem)
                ]
            },
            {
                func: "run",
                sql: "UPDATE RMSData SET " + columns.join() + " WHERE [Department] = (?) AND [Team] = (?) AND [Employee Name] = (?)",
                params: [...values, row.modifiedItem["Department"], row.modifiedItem["Team"], row.modifiedItem["Employee Name"]]
            }
        )
    });
    dbController.execute(constants.dbName, saveQueryList)
}

function write(data) {
    if (data.length == 0) { console.log("Empty data for `write` function."); return; }

    data.forEach(row => {
        fileController.write(row.file, row.content)
    })
}

module.exports = {
    init, onBoard, offBoard, load, save, write
}