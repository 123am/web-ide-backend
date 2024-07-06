const fs = require('fs').promises;
var path = require('path');

const nestedFiler = async (myPathLcl) => {
    let fill = []
    const files = await fs.readdir(myPathLcl, { withFileTypes: true })
    let fileData = files.map(async file => {
        if (file.isFile()) {
            return {
                "type": "file",
                "name": file.name,
                "child": [],
                "path": path.join(myPathLcl, file.name)
            }
        }

        else if (file.isDirectory()) {
            let dte = await nestedFiler(path.join(myPathLcl, file.name))
            return {
                "type": "folder",
                "name": file.name,
                "child": dte,
                "path": path.join(myPathLcl, file.name)
            }
        }
    })
    fill = await Promise.all(fileData);
    return fill
}


module.exports = nestedFiler;