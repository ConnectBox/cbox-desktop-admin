export const isWin = window.isWin()
export const isDevelopment = window.isDevelopment()

export const unixPathSep = "/"

export const curWindowSize = () => window.curWindowSize()
export const curContentSize = () => window.curContentSize()
export const getAppPath = () => window.getAppPath()
export const outputJsonAsync = (fname, obj) => window.outputJsonAsync(fname, obj)
export const outputJsVarAsync = (fname, varName, obj) => window.outputJsVarAsync(fname, varName, obj)
export const outputFileAsync = (fname, data) => window.outputFileAsync(fname, data)
export const readFileAsync = (fname, encoding) => window.readFileAsync(fname, encoding)
export const readJsonAsync = fname => window.readJsonAsync(fname)
export const readdirAsync = dirname => window.readdirAsync(dirname)
export const statAsync = path => window.statAsync(path)
export const readJson = fname => window.readJson(fname)
export const pathExistsAsync = fname => window.pathExistsAsync(fname)
export const copyAsync = (src, dest) => window.copyAsync(src,dest)
export const ensureDirAsync = dirPath => window.ensureDirAsync(dirPath)
export const moveAsync = (srcPath,destPath) => window.moveAsync(srcPath,destPath)
export const removeAsync = dirPath => window.removeAsync(dirPath)
export const emptyDirAsync = dirPath => window.emptyDirAsync(dirPath)
export const getAllFiles = (dir) => window.getAllFiles(dir)
export const ajaxGetFileAsync = (url) => window.ajaxGetFileAsync(url)
export const getNormalizedPath = (curPath) => window.getNormalizedPath(curPath)
export const getHostPathSep = () => window.getHostPathSep()
export const getRelPath = (orgPath,curPath) => window.getRelPath(orgPath,curPath)
export const getDirName = (curPath) => window.getDirName(curPath)
export const getDirNameSlash = (curPath) => window.getDirNameSlash(curPath)
export const getFileName = (curPath) => window.getFileName(curPath)
export const getFileNameSlash = (curPath) => window.getFileNameSlash(curPath)
export const downloadFiles = (filelist,listProgress,donwloadProgress) => window.downloadFiles(filelist,listProgress,donwloadProgress)
export const getLocale = () => window.getLocale()
export const getLocaleIso639Letter2 = () => window.getLocale().substr(0,2)
