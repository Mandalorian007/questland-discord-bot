var servers = ['global', 'america', 'europe', 'asia', 'veterans']
exports.serverOptions = servers

exports.serverMatcher = (serverProvided) => {
    if(serverProvided) {
        lowerServer = serverProvided.toLowerCase();
        if(servers.includes(lowerServer)) {
            return lowerServer.toUpperCase();
        }
    }
    return null;
}