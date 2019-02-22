const Worker = require(`jest-worker`).default
const numWorkers = require(`physical-cpu-count`) || 1

module.exports = new Worker(require.resolve(`./workers`), {
  numWorkers,
  forkOptions: {
    silent: false
  },
})