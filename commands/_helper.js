exports.asyncHandler = (cb) => (argv) => {
  argv.handled = cb(argv);
};
