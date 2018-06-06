exports.getCtxFileExtension = ctx => {
  const filePathnameArr = ctx.body.path.split('/');
  const requestFilename = filePathnameArr[filePathnameArr.length - 1 ];

  const requestFilenamePieces = requestFilename.split('.');
  const requestFileExtension = requestFilenamePieces[requestFilenamePieces.length - 1];

  return requestFileExtension;
}