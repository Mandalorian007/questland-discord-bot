const { asyncHandler } = require("./_helper");

exports.command = '$0';
exports.describe = 'Default Help';
exports.builder = {};

exports.handler = asyncHandler(async (argv) => {
  return `Usage: !ql <command> [options]

Commands:
  !ql item         Get details about a Questland Item
  !ql orb          Get details about a Questland Orb
  !ql build        Get details for a popular build
  !ql daily-boss   Get SIBB's daily boss build
  !ql get-ql-bot   Get QL Bot on your server

Examples:
  !ql item Hecatombus         Get the details for Hecatombus at it's base level.
  !ql orb Behemoth Flames     Get the details for Behemoth Flames orb.
  !ql build Turtle            Get details for the Turtle build.
  !ql daily-boss Hierophant   Get SIBB's daily boss build to defeat the Hierophant.
  !ql get-ql-bot              Get details about how to get QL Bot on your discord server.
`;
});
