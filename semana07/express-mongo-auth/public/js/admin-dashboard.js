document.addEventListener('DOMContentLoaded', async function() {
  const token = sessionStorage.getItem('token');
  
  if (!token || !isTokenValid(token)) {
    M.toast({ html: 'Debes iniciar sesión para acceder a esta página' });
    setTimeout(() => location.href = '/signIn', 1500);
    return;
  }

  try {
    // Verificar que sea admin
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.roles.includes('admin')) {
      location.href = '/403';
      return;
    }

    // Obtener lista de usuarios
    const response = await fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener lista de usuarios');
    }

    const users = await response.json();
    
    // Rellenar los datos en la página
    populateAdminDashboard(users);
    
  } catch (error) {
    console.error('Error:', error);
    M.toast({ html: 'Error al cargar los datos de administrador' });
    setTimeout(() => location.href = '/403', 1500);
  }
});

function populateAdminDashboard(users) {
  // Actualizar estadísticas
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.roles.some(r => r.name === 'admin')).length;
  const regularUsers = users.filter(u => u.roles.some(r => r.name === 'user')).length;

  const statsElements = {
    '.total-users': totalUsers,
    '.admin-users': adminUsers,
    '.regular-users': regularUsers
  };

  Object.entries(statsElements).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  });

  // Poblar tabla de usuarios
  const tableBody = document.getElementById('usersTableBody');
  if (tableBody) {
    tableBody.innerHTML = users.map((user, index) => `
      <tr data-user-id="${user._id}" 
          data-name="${user.name} ${user.lastName}" 
          data-email="${user.email}"
          data-roles="${user.roles.map(r => r.name).join(',')}">
        <td>
          <img src="${user.url_profile || 'https://via.placeholder.com/40'}" 
               alt="Avatar" class="circle" style="width: 40px; height: 40px;">
        </td>
        <td>
          <strong>${user.name} ${user.lastName}</strong>
        </td>
        <td>${user.email}</td>
        <td>${user.phoneNumber}</td>
        <td>${user.age} años</td>
        <td>
          ${user.roles.map(role => 
            `<span class="chip ${role.name === 'admin' ? 'red white-text' : 'blue white-text'}">
              ${role.name}
            </span>`
          ).join('')}
        </td>
        <td>${new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
        <td>
          <a href="#userModal${index}" class="btn-small blue modal-trigger tooltipped" 
             data-tooltip="Ver detalles">
            <i class="material-icons">visibility</i>
          </a>
        </td>
      </tr>
    `).join('');
  }

  // Crear modales para cada usuario
  const modalsContainer = document.getElementById('userModalsContainer') || createModalsContainer();
  modalsContainer.innerHTML = users.map((user, index) => `
    <div id="userModal${index}" class="modal">
      <div class="modal-content">
        <h4>Detalles del Usuario</h4>
        <div class="row">
          <div class="col s12 m4 center-align">
            <img src="${user.url_profile || 'https://via.placeholder.com/150'}" 
                 alt="Avatar" class="circle responsive-img" style="max-width: 150px;">
          </div>
          <div class="col s12 m8">
            <p><strong>Nombre:</strong> ${user.name} ${user.lastName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Teléfono:</strong> ${user.phoneNumber}</p>
            <p><strong>Edad:</strong> ${user.age} años</p>
            <p><strong>Dirección:</strong> ${user.address || 'No especificada'}</p>
            <p><strong>Fecha de nacimiento:</strong> ${new Date(user.birthdate).toLocaleDateString('es-ES')}</p>
            <p><strong>Fecha de registro:</strong> ${new Date(user.createdAt).toLocaleDateString('es-ES')}</p>
            <p><strong>Última actualización:</strong> ${new Date(user.updatedAt).toLocaleDateString('es-ES')}</p>
            <p><strong>Roles:</strong>
              ${user.roles.map(role => 
                `<span class="chip ${role.name === 'admin' ? 'red white-text' : 'blue white-text'}">
                  ${role.name}
                </span>`
              ).join('')}
            </p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
      </div>
    </div>
  `).join('');

  // Reinicializar Materialize components
  setTimeout(() => {
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.Modal.init(document.querySelectorAll('.modal'));
    M.FormSelect.init(document.querySelectorAll('select'));
  }, 100);

  // Configurar botón de logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      sessionStorage.removeItem('token');
      M.toast({ html: 'Sesión cerrada exitosamente' });
      setTimeout(() => location.href = '/signIn', 1000);
    });
  }
}

function createModalsContainer() {
  const container = document.createElement('div');
  container.id = 'userModalsContainer';
  document.body.appendChild(container);
  return container;
}

function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}