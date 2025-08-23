import fs from "fs";

const FILE = "./tareas.json";

function leerTareas(){
    if(!fs.existsSync(FILE))
        return [];
    return JSON.parse(fs.readFileSync(FILE,"utf-8"));
}

function guardarTareas(tareas){
    fs.writeFileSync(FILE, JSON.stringify(tareas, null, 2));
}

function agregarTarea(titulo, descripcion, categoria){
    const tareas = leerTareas();
    const nueva = {
        id:Date.now(),
        titulo,
        descripcion,
        categoria,
        estado: "pendiente",
    }
    tareas.push(nueva);
    guardarTareas(tareas)
    console.log(`Tarea agregada: "${titulo}" en [${categoria}]`);
}

function listarTareas(filtroEstado = null, filtroCat = null){
    const tareas = leerTareas();
    if (tareas.lenght === 0)
        return console.log("No hay tareas para mostrar");

    const categorias = {};
    tareas.forEach((t) => {
        if (filtroEstado && t.estado !== filtroEstado) return;
        if (filtroCat && t.categoria !== filtroCat) return;

        if (!categorias[t.categoria]) categorias[t.categoria] = [];
        categorias[t.categoria].push(t);
    })

    for (const [cat, lista] of Object.entries(categorias)){
        console.log(`\n=== Categoría: ${cat} ===`);
        lista.forEach((t) => {
            console.log(`- [${t.estado}] ${t.id}: ${t.titulo} - ${t.descripcion}`);
        });
    }
}

function completarTarea(id){
    const tareas = leerTareas();
    const index = tareas.findIndex((t) => t.id === id);
    if (index === -1)
        return console.log(`No se encontró tarea con ID ${id}`);
    tareas.estado = "completada";
    guardarTareas(tareas);
    console.log(`Tarea "${tareas.titulo}" marcada como completada.`);
}

const args = process.argv.slice(2);
const cmd = args[0];

switch(cmd){
    case "agregar":
        agregarTarea(args[1], args[2], args[3] || "general");
        break;
    case "listar":
        if (args[1] === "pendientes")
            listarTareas("pendiente");
        else if (args[1] === "completadas")
            listarTareas("completada");
        else if (args[1] === "categoria")
            listarTareas(null, args[2]);
        else
            listarTareas();
        break;
    case "completar":
        completarTarea((args[1]));
        break;
    default:
        console.log(`
            Uso:
                node app.js agregar "Título" "Descripción" "Categoría"
                node app.js listar 
                node app.js listar pendientes
                node app.js listar completadas
                node app.js listar categoria <nombre>
                node app.js completar <id>
            `);
}
