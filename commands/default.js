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
  !ql item Hecatombus              Get the details for Hecatombus at its base level.
  !ql item Truncheon -a 2          Get the details for Truncheon at Artifact 2 quality.
  !ql orb Behemoth Flames          Get the details for Behemoth Flames orb at its base level.
  !ql orb Requiem -a 1             Get the details for Requiem orb at Artifact 1 quality.
  !ql build Turtle                 Get details for the Turtle build.
  !ql daily-boss Today -s europe   Get SIBB's daily boss build for today's boss on the Europe server.
  !ql daily-boss Hierophant        Get SIBB's daily boss build to defeat the Hierophant.
  !ql get-ql-bot                   Get details about how to get QL Bot on your discord server.
`;
});
