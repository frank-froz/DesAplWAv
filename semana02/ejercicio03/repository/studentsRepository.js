let students = [
    { id: 1, name: "Juan.Pérez", grade: 18, email: "juan.perez@example.com", phone: "+51 992768678", enrollementNumber: "2025001", course: "Diseño y Desarrollo de Software C24", year: "3", subject: ["Algoritmos", "Base de datos", "Redes"], gpa: "Activo", adminissionDate: "2022-03-1" },
    { id: 2, name: "Luis Garcia", grade: 15, email: "luis@example.com", phone: "+51 987654321", enrollementNumber: "2025002", course: "Ingeniería de Sistemas C24", year: "2", subject: ["Matemáticas", "Física", "Química"], gpa: "Activo", adminissionDate: "2021-08-15" },
    { id: 3, name: "Pedro Flores", grade: 20, email: "pedro@example.com", phone: "+51 998877665", enrollementNumber: "2025003", course: "Arquitectura de Software C24", year: "1", subject: ["Programación", "Sistemas Operativos", "Base de datos"], gpa: "Activo", adminissionDate: "2022-01-10" },
    { id: 4, name: "Maria del Carme", grade: 17, email: "maria@example.com", phone: "+51 966554433", enrollementNumber: "2025004", course: "Desarrollo Web C24", year: "4", subject: ["HTML", "CSS", "JavaScript"], gpa: "Activo", adminissionDate: "2020-09-05" }
]

function getAll() {
    return students;
}

function create(student) {
    student.id = students.length + 1;
    students.push(student);
    return student;
}

function getById(id) {
    return students.find(student => student.id === parseInt(id));
}

function update(id, updateData) {
    const index = students.findIndex(student => student.id === parseInt(id));
    if (index !== -1) {
        students[index] = { ...students[index], ...updateData };
        return students[index];
    }
    return null;
}

function remove(id) {
    const index = students.findIndex(student => student.id === parseInt(id));
    if (index !== -1) {
        return students.splice(index, 1)[0];
    }
    return null;
}

module.exports = { getAll, getById, create, update, remove };