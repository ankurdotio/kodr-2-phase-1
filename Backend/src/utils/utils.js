const { v4: uuid4 } = require("uuid")



function createId() {
    return uuid4();
}


module.exports = { createId }