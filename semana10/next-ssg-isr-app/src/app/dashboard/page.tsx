export default function Dashboard() {
  // Lanzar un error intencional para probar el error boundary
  // throw new Error('Error de prueba en el dashboard');

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Esta página nunca se mostrará porque hay un error arriba.</p>
    </div>
  );
}