const { asyncHandler } = require("./_helper");

exports.command = '$0';
exports.describe = 'Default Help';
exports.builder = {};

exports.handler = asyncHandler(async (argv) => {
  return `Usage: !ql <command> [options]

Commands:
  !ql item  Get details about a Questland Item
  !ql orb   Get details about a Questland Orb
`;
});
