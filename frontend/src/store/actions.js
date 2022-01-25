import config from '../../../config/config.json'

const axios = require('axios').default;

async function init(context) {
    axios.post(config.server.baseurl + '/init')
        .then((response) => { /* console.log(response) */ })
        .catch((error) => { console.log(error) })
}

async function onBoard(context, data) {
    axios.post(config.server.baseurl + '/onBoard', data)
        .then((response) => { /* console.log(response) */ })
        .catch((error) => { console.log(error) })
}

async function offBoard(context, data) {
    axios.post(config.server.baseurl + '/offBoard', data)
        .then((response) => { /* console.log(response) */ })
        .catch((error) => { console.log(error) })
}

async function load() {
    axios.get(config.server.baseurl + '/load')
        .then((response) => { /* console.log(response) */ })
        .catch((error) => { console.log(error) })
}

async function save(context, data) {
    axios.put(config.server.baseurl + '/save', data)
        .then((response) => { /* console.log(response) */ })
        .catch((error) => { console.log(error) })
}

async function write(context, data) {
    axios.put(config.server.baseurl + '/write', data)
        .then((response) => { /* console.log(response) */ })
        .catch((error) => { console.log(error) })
}

export default {
    init,
    onBoard,
    offBoard,
    load,
    save,
    write
}