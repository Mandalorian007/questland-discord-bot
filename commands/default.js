const { asyncHandler } = require("./_helper");

exports.command = '$0';
exports.describe = 'Default Help';
exports.builder = {};

exports.handler = asyncHandler(async (argv) => {
  return `Usage: !ql <command> [options]

Commands:
  !ql item         Get details about a Questland Item
  !ql orb          Get details about a Questland Orb
  !ql daily-boss   Get SIBB's daily boss build

Examples:
  !ql item Hecatombus         Get the details for Hecatombus at it's base level.
  !ql orb Behemoth Flames     Get the details for Behemoth Flames orb.
  !ql daily-boss Hierophant   Get SIBB's daily boss build to defeat the Hierophant
`;
});
