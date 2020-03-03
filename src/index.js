const express = require("express");
const fs = require("fs");
const path = require("path");
/* Se inicializa el servidor de express */
const app = express();
//funcion para abrir las carpetas de Guides
function OpenFolders() {
  const directoryPath = path.join(__dirname, "assets/Guides");
  fs.readdir(directoryPath, function(err, files) {
    //handling error
    if (err) {
      return console.log("No se puede escanear el directorio: " + err);
    }
    //listing all files using forEach
    files.forEach(function(file) {
      // Do whatever you want to do with the file
      if (file == ".DS_Store") {
      } else {
        OpenfoldersFile(file);
      }
    });
  });
}

/* funcion, para obtener los archivos de las carpetas, 
el dato de entrada es un string con el nombre de la carpeta */
function OpenfoldersFile(str) {
  const directoryPath2 = path.join(__dirname, `assets/Guides/${str}`);
  fs.readdir(directoryPath2, function(err, files) {
    //handling error
    if (err) {
      return console.log("No se puede escanear el directorio: " + err);
    }
    //listing all files using forEach
    files.forEach(function(file) {
      // Do whatever you want to do with the file
      if (file.indexOf(".json") > 0) {
        openFile(str, file);
      } else if (file.indexOf(".jpg") > 0 || file.indexOf(".JPG") > 0) {
        console.log(str, file);
        replaceNamePng(str, file);
      }
    });
  });
}

/*  funcio, que reemplaza la extencion de las imagenes de lowercase a Upercase,
    Los datos de estrada son dos strings que el primero contiene la carpeta y
    el segundo contiene el nombre del archivo.
*/
function replaceNamePng(strFileImg, fileName) {
  const directoryPath3 = path.join(
    __dirname,
    `assets/Guides/${strFileImg}/${fileName}`
  );
  fs.rename(directoryPath3, directoryPath3.replace(/.JPG/gi, ".jpg"), function(
    err
  ) {
    if (err) throw err;
    console.log("Archivo renombrado");
  });
}

/*  Funcion que trae los datos de los archivos json,
    Los datos de estrada son dos strings que el primero contiene la carpeta y
    el segundo contiene el nombre del archivo.
*/
function openFile(str, strF) {
  const directoryPath3 = path.join(__dirname, `assets/Guides/${str}/${strF}`);
  fs.readFile(directoryPath3, "utf-8", (err, data) => {
    if (err) throw err;
    console.log(directoryPath3);
    let Json = JSON.parse(data);

    Json.content.map(m => {
      if (m.type == "image") {
        m.content = m.content.replace(/.Jpg/gi, ".jpg");
        createFile(directoryPath3, Json);
      }
    });
  });
}

/*  Funcion que cambia los datos de los archivos json,
    Los datos de estrada son dos strings que el primero contiene el path y
    el segundo contiene el nombre del archivo json. 
  */
function createFile(directoryPath3, json) {
  let stringifyJson = JSON.stringify(json);
  try {
    fs.writeFile(directoryPath3, stringifyJson, err => {
      if (err) throw err;
      console.log("Archivo Creado Satisfactoriamente");
    });
  } catch (error) {}
}

app.get("/", function(req, res) {
  OpenFolders();
});

app.listen(8090, function() {
  console.log("Example app listening on port 8090!");
});
