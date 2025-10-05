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
    
    // Verificar que tenga rol de usuario
    if (!user.roles.some(role => role.name === 'user')) {
      location.href = '/403';
      return;
    }

    // Rellenar los datos en la página
    populateUserDashboard(user);
    
  } catch (error) {
    console.error('Error:', error);
    M.toast({ html: 'Error al cargar los datos del usuario' });
    setTimeout(() => location.href = '/signIn', 1500);
  }
});

function populateUserDashboard(user) {
  // Actualizar elementos con los datos del usuario
  const elements = {
    userName: document.querySelector('.user-name'),
    userEmail: document.querySelector('.user-email'),
    userPhone: document.querySelector('.user-phone'),
    userAge: document.querySelector('.user-age'),
    userAddress: document.querySelector('.user-address'),
    userFullName: document.querySelector('.user-full-name'),
    userRegistrationDate: document.querySelector('.user-registration-date'),
    userRoles: document.querySelector('.user-roles'),
    userLastUpdate: document.querySelector('.user-last-update'),
    userAvatar: document.querySelectorAll('.user-avatar')
  };

  // Actualizar avatar
  elements.userAvatar.forEach(img => {
    img.src = user.url_profile || 'https://via.placeholder.com/150';
  });

  // Actualizar textos
  if (elements.userName) elements.userName.textContent = user.name;
  if (elements.userEmail) elements.userEmail.textContent = user.email;
  if (elements.userPhone) elements.userPhone.textContent = user.phoneNumber;
  if (elements.userAge) elements.userAge.textContent = `${user.age} años`;
  if (elements.userAddress) elements.userAddress.textContent = user.address || 'No especificada';
  if (elements.userFullName) elements.userFullName.textContent = `${user.name} ${user.lastName}`;
  
  if (elements.userRegistrationDate) {
    elements.userRegistrationDate.textContent = new Date(user.createdAt).toLocaleDateString('es-ES');
  }
  
  if (elements.userLastUpdate) {
    elements.userLastUpdate.textContent = new Date(user.updatedAt).toLocaleDateString('es-ES');
  }

  if (elements.userRoles) {
    elements.userRoles.innerHTML = user.roles.map(role => 
      `<span class="chip blue white-text">${role.name}</span>`
    ).join(' ');
  }

  // Rellenar formulario de edición si existe
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

function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}