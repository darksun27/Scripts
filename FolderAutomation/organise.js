var fs = require('fs');
var totalFiles = 0;
var paths = require('./paths.json')["pathData"];
var pathToWatch = process.argv[2];

async function countFiles() {
    return new Promise((resolve, reject) => {
        var getFileCount = new Promise(function(resolve, reject){
            fs.readdir(`${pathToWatch}`, (err,files) => {
                if(err) {
                    reject(err);
                }
                resolve(files.length);
            })
        })
        getFileCount.then((len) => {
            resolve(len);
        }).catch((err) => {
            reject(err);
        });
    })
}

async function checkDir(pathToCheck) {
    return new Promise((resolve, reject) => {
        fs.exists(`${pathToCheck}`,(exists) => {
            if(!exists) {
                fs.mkdir(`${pathToCheck}`,{recursive : true}, (err) => {
                    if(err) { 
                        console.log(err);
                        reject(err);
                    }
                    resolve();
                });
            }
            resolve();
        })
    })
}

async function moveFile(extension, filename) {
    return new Promise((resolve, reject) => {
        checkDir(`${pathToWatch}/${paths[extension]}`).then(() => {
            fs.rename(`${pathToWatch}/${filename}`, `${pathToWatch}/${paths[extension]}/${filename}`, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            })
        }).catch((err) => {
            reject(err);
        })
    }); 
}

countFiles().then((filesPresent) => {
    totalFiles = filesPresent;
    console.log("Total Files Present in the Folder: ", totalFiles);
}).catch((err) => {
    console.log(err);
});


fs.watch(`${pathToWatch}`, (eventType, filename) => {
    if(filename) {
        //console.log("Event Occured: ", eventType," File Changed: ",filename);
        countFiles().then((filesPresent) => {
            if(filesPresent > totalFiles) {
                console.log("add");
                var extension = filename.split('.').pop();
                console.log(extension)
                if(paths[extension]){
                    try {
                        moveFile(extension, filename).then(() => {
                            console.log("File Moved")
                        }).catch((err) => {
                            throw err;
                        })
                    }
                    catch(err) {
                        console.log(err);
                    }
                }
            }
            else if( filesPresent < totalFiles) {
                console.log("delete");
            }
            else { 
                console.log("other");
                var extension = filename.split('.').pop();
                console.log(extension);
                if(paths[extension]){
                    try {
                        moveFile(extension, filename).then(() => {
                            console.log("File Moved")
                        }).catch((err) => {
                            throw err;
                        })
                    }
                    catch(err) {
                        console.log(err);
                    }
                }
            }
            totalFiles = filesPresent;
        }).catch((err) => {
            console.log(err);
        });
    }
});