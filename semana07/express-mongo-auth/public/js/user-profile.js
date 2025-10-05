document.addEventListener('DOMContentLoaded', async function() {
  const token = sessionStorage.getItem('token');
  
  if (!token || !isTokenValid(token)) {
    M.toast({ html: 'Debes iniciar sesión para acceder a esta página' });
    setTimeout(() => location.href = '/signIn', 1500);
    return;
  }

  try {
    // Obtener datos del usuario
    const response = await fetch('/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos del usuario');
    }

    const user = await response.json();
    
    // Rellenar los datos en la página
    populateUserProfile(user);
    
  } catch (error) {
    console.error('Error:', error);
    M.toast({ html: 'Error al cargar los datos del usuario' });
    setTimeout(() => location.href = '/signIn', 1500);
  }
});

function populateUserProfile(user) {
  // Actualizar elementos con clase específica
  const avatar = document.querySelector('.user-profile-avatar');
  if (avatar) {
    avatar.src = user.url_profile || 'https://via.placeholder.com/150';
  }

  const name = document.querySelector('.user-profile-name');
  if (name) {
    name.textContent = `${user.name} ${user.lastName}`;
  }

  const email = document.querySelector('.user-profile-email');
  if (email) {
    email.textContent = user.email;
  }

  const roles = document.querySelector('.user-profile-roles');
  if (roles) {
    roles.innerHTML = user.roles.map(role => 
      `<span class="chip ${role.name === 'admin' ? 'red white-text' : 'blue white-text'}">
        <i class="material-icons left">${role.name === 'admin' ? 'admin_panel_settings' : 'person'}</i>
        ${role.name.toUpperCase()}
      </span>`
    ).join(' ');
  }

  // Actualizar información personal
  const personalInfo = {
    '.user-full-name': `${user.name} ${user.lastName}`,
    '.user-birthdate': new Date(user.birthdate).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) + ` (${user.age} años)`,
    '.user-phone': user.phoneNumber,
    '.user-address': user.address || 'No especificada'
  };

  Object.entries(personalInfo).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  });

  // Actualizar información de cuenta
  const accountInfo = {
    '.user-email': user.email,
    '.user-registration-date': new Date(user.createdAt).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    '.user-last-update': new Date(user.updatedAt).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  Object.entries(accountInfo).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  });

  // Mostrar botón de admin si tiene el rol
  const adminButton = document.querySelector('.admin-button');
  if (adminButton && user.roles.some(role => role.name === 'admin')) {
    adminButton.style.display = 'block';
  }

  // Rellenar formulario de edición
  const editForm = document.getElementById('editProfileForm');
  if (editForm) {
    editForm.elements.name.value = user.name;
    editForm.elements.lastName.value = user.lastName;
    editForm.elements.phoneNumber.value = user.phoneNumber;
    editForm.elements.address.value = user.address || '';
    editForm.elements.url_profile.value = user.url_profile || '';
    
    // Actualizar labels de Materialize
    M.updateTextFields();
  }
}

function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}