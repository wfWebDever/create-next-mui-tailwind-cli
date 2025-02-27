import requestIP from 'request-ip'

const getIp = req => requestIP.getClientIp(req) || req.socket.remoteAddress

export { getIp }
