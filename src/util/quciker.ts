import os from 'node:os'
import config from '../config/config.js'

export default {
  getSystemHealth: () => {
    return {
      loadAvg: os.loadavg(),
      totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
      freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
      pid: process.pid,
      nodeVersion: process.version,
    }
  },
  getApplicationHealth: () => {
    const memory = process.memoryUsage()
    return {
      env: config.ENV,
      upTime: `${process.uptime().toFixed(4)} seconds`,
      memoryUsage: {
        heapTotal: `${(memory.heapTotal / 1024 / 1024).toFixed(4)} MB`,
        heapUsed: `${(memory.heapUsed / 1024 / 1024).toFixed(4)} MB`,
      },
    }
  },
}
