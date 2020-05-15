const assert = require('assert')

function validDescription (s) {
    return typeof s === 'string' &&
            s !== '' && 
            s.length < 1000
}

assert(validDescription('foo'))
assert(!validDescription(''))
assert(!validDescription())
assert(!validDescription(null))
assert(!validDescription({}))




// public api

module.exports = {
    validDescription: validDescription
}