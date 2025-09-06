const fs = require('fs');

const readable = fs.createReadStream('datos.txt', { encoding: 'utf8' });
// readable.on('data', (chunk) => console.log('Fragmento recibido:', chunk));
// readable.on('end', () => console.log('Lectura completa'));
// readable.on('error', (err) => console.log('Error:', err)); 

const writable = fs.createWriteStream('salida.txt');
// writable.write('Este es un mensaje de prueba.\n');
// writable.end('Fin del mensaje.')
// writable.on('finish', () => console.log('Escritura completa'));

// const zlib = require('zlib');
// const readStream = fs.createReadStream('entrada.txt');
// const writeStream = fs.createWriteStream('entrada.txt.gz');
// const gzip = zlib.createGzip();
// readStream.pipe(gzip).pipe(writeStream);

readable.on('data', chunk => {
    if (!writable.write(chunk)) {
        console.log('pause')
        readable.pause();
    }
})
writable.on('drain', () => { 
    console.log('resume')
    readable.resume(); 
});
