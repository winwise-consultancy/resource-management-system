const fs = require('fs');

async function write(file, content) {
    fs.writeFileSync(file, JSON.stringify(content))
}

module.exports = {
    write
}
