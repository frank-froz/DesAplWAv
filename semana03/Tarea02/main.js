const http = require('http');
const ExcelJS = require('exceljs');

const PORT = 3000;

const server = http.createServer(async (req, res) =>{
    if (req.url === '/reporte'){
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Ventas');

            worksheet.columns = [
                {header: 'Producto', key: 'producto'},
                {header: 'Cantidad', key: 'cantidad'},
                {header: 'Precio', key: 'precio'}
            ];

            const productos = ['Laptop', 'Mouse', 
                'Teclado', 'Monitor', 'Audífonos', 'Impresora', 
                'Tablet', 'Smartphone', 'Cámara', 'Router', 
                'Disco Duro', 'Memoria USB', 'Altavoces', 
                'Micrófono', 'Webcam', 'Proyector', 'Smartwatch', 
                'Tarjeta Gráfica', 'Fuente de Poder', 'Placa Base'];
            
            const cantidades = [20, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
            const precios = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

            for (let i = 0; i < 20; i++) {
                worksheet.addRow({
                    producto: productos[Math.floor(Math.random() * productos.length)],
                    cantidad: cantidades[Math.floor(Math.random() * cantidades.length)],
                    precio: precios[Math.floor(Math.random() * precios.length)]
                });
            }

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx'); 

            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error('Error al generar el reporte:', error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Error al generar el reporte');
        }
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Visita /reporte para descargar el Excel');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});