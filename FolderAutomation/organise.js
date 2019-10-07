const fs = require('fs');
const paths = require('/home/darksun27/100DaysofCode/Scripts/FolderAutomation/paths.json')["pathData"];


var pathToWatch = process.argv[2];
var totalFiles = 0;
var movingFile = false;
var workingFile = "";
var extension = "";

 function countFiles() {
    return new Promise((resolve, reject) => {
        var getFileCount = new Promise(function(resolve, reject){
            fs.readdir(`${pathToWatch}`, (err,files) => {
                if(err) {
                    console.log("Path Reading Error")
                    reject(err);
                }
                resolve({"length" : files.length, "filenames" : files});
            })
        })
        getFileCount.then((len) => {
            resolve(len);
        }).catch((err) => {
            console.Error("Can't Get File Count!");
            reject(err);
        });
    })
}

 function checkDir(pathToCheck) {
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

 function moveFile(extension, filename) {
    return new Promise((resolve, reject) => {
        checkDir(`${pathToWatch}/${paths[extension]}`).then(() => {
            fs.rename(`${pathToWatch}/${filename}`, `${pathToWatch}/${paths[extension]}/${filename}`, (err) => {
                if (err) {
                    reject("Error Moving File\n",err);
                }
                resolve();
            })
        }).catch((err) => {
            reject(err);
        })
    }); 
}

countFiles().then((files) => {
    totalFiles = files["length"];
    console.log("Total Files Present in the Folder: ", totalFiles);
    files["filenames"].forEach(file => {
        workingFile = file.split('.');
        if(workingFile.length > 1) {
            extension = workingFile.pop();
            if(paths[extension]) {
                movingFile = true;
                moveFile(extension, file).then(() => {
                    //console.log("File Moved");
                    movingFile = false;
                }).catch((err) => {
                    console.Error(err);
                    movingFile = false;
                });
            }
        }
    });
}).catch((err) => {
    console.Error(err);
});

fs.watch(`${pathToWatch}`, (eventType, filename) => {
    if(filename) {
        //console.log("Event Occured: ", eventType," File Changed: ",filename);
        countFiles().then((files) => {
            if(files["length"] > totalFiles) {
                workingFile = filename.split('.');
                extension = workingFile.pop();
                if(paths[extension] && !movingFile && workingFile.length > 1){
                    try {
                        moveFile(extension, filename).then(() => {
                            console.log("File Moved")
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                    catch(err) {
                        console.Error("Adding Error\n",err);
                    }
                }
            }
            else if( files["length"] < totalFiles) {
                console.log("delete");
            }
            else { 
                workingFile = filename.split('.');
                extension = workingFile.pop();
                if(paths[extension] && !movingFile && workingFile.length > 1){
                    try {
                        moveFile(extension, filename).then(() => {
                            console.log("File Moved")
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                    catch(err) {
                        console.Error("Renaming Error\n",err);
                    }
                }
            }
            totalFiles = files["length"];
        }).catch((err) => {
            console.Error(err);
        });
    }
});