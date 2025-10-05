document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  checkTokenExpiration();

  // === NAVEGACIÓN DINÁMICA ===
  function initNavigation() {
    const token = sessionStorage.getItem("token");
    const navDesktop = document.getElementById("nav-desktop");
    const navMobile = document.getElementById("mobile-nav");
    
    if (token && isTokenValid(token)) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isAdmin = payload.roles.includes("admin");
      
      // Navegación para usuarios autenticados
      const navItemsAuth = `
        ${isAdmin ? '<li><a href="/dashboard-admin"><i class="material-icons left">dashboard</i>Admin</a></li>' : ''}
        <li><a href="/dashboard-user"><i class="material-icons left">home</i>Dashboard</a></li>
        <li><a href="/profile"><i class="material-icons left">person</i>Perfil</a></li>
        <li><a href="#" id="logoutBtn"><i class="material-icons left">logout</i>Cerrar Sesión</a></li>
      `;
      
      if (navDesktop) navDesktop.innerHTML = navItemsAuth;
      if (navMobile) navMobile.innerHTML = navItemsAuth;
      
      // Configurar logout
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          logout();
        });
      }
    } else {
      // Navegación para usuarios no autenticados
      const navItemsGuest = `
        <li><a href="/signIn"><i class="material-icons left">login</i>Iniciar Sesión</a></li>
        <li><a href="/signUp"><i class="material-icons left">person_add</i>Registrarse</a></li>
      `;
      
      if (navDesktop) navDesktop.innerHTML = navItemsGuest;
      if (navMobile) navMobile.innerHTML = navItemsGuest;
    }
  }

  // === VERIFICACIÓN DE TOKEN ===
  function isTokenValid(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  function checkTokenExpiration() {
    const token = sessionStorage.getItem("token");
    if (token && !isTokenValid(token)) {
      M.toast({ html: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente." });
      logout();
    }
  }

  function logout() {
    sessionStorage.removeItem("token");
    M.toast({ html: "Sesión cerrada exitosamente" });
    setTimeout(() => location.href = "/signIn", 1000);
  }

  // === PROTECCIÓN DE RUTAS ===
  function protectRoute() {
    const token = sessionStorage.getItem("token");
    const currentPath = window.location.pathname;
    
    // Rutas públicas que no necesitan autenticación
    const publicPaths = ["/", "/signIn", "/signUp", "/403", "/404"];
    
    // Rutas protegidas específicas que requieren autenticación
    const protectedPaths = ["/dashboard-user", "/dashboard-admin", "/profile"];
    
    // Si es una ruta pública, no hacer nada
    if (publicPaths.includes(currentPath)) {
      return true;
    }
    
    // Solo proteger rutas específicas conocidas
    if (protectedPaths.includes(currentPath)) {
      if (!token || !isTokenValid(token)) {
        M.toast({ html: "Debes iniciar sesión para acceder a esta página" });
        location.href = "/signIn";
        return false;
      }
    }
    
    // Para cualquier otra ruta (incluyendo 404s), no redirigir
    return true;
  }

  // === LOGIN ===
  const signInForm = document.getElementById("signInForm");
  if (signInForm) {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitButton = signInForm.querySelector('button[type="submit"]');

    signInForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        M.toast({ html: "Por favor, completa todos los campos" });
        return;
      }

      // Deshabilitar botón durante la petición
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="material-icons left">hourglass_empty</i>Iniciando...';

      try {
        const res = await fetch("/api/auth/signIn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          sessionStorage.setItem("token", data.token);
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          
          M.toast({ html: `¡Bienvenido ${payload.name}!` });
          
          setTimeout(() => {
            if (payload.roles.includes("admin")) {
              location.href = "/dashboard-admin";
            } else {
              location.href = "/dashboard-user";
            }
          }, 1000);
        } else {
          M.toast({ html: data.message || "Credenciales incorrectas" });
        }
      } catch (error) {
        M.toast({ html: "Error de conexión. Intenta nuevamente." });
      } finally {
        // Rehabilitar botón
        submitButton.disabled = false;
        submitButton.innerHTML = 'Entrar <i class="material-icons right">login</i>';
      }
    });
  }

  // === REGISTRO ===
  const signUpForm = document.getElementById("signUpForm");
  if (signUpForm) {
    const submitButton = signUpForm.querySelector('button[type="submit"]');

    signUpForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(signUpForm);
      const user = {
        name: formData.get('name')?.trim(),
        lastName: formData.get('lastName')?.trim(),
        email: formData.get('email')?.trim(),
        password: formData.get('password')?.trim(),
        phoneNumber: formData.get('phoneNumber')?.trim(),
        birthdate: formData.get('birthdate'),
        address: formData.get('address')?.trim() || '',
        url_profile: formData.get('url_profile')?.trim() || ''
      };

      // Validaciones básicas
      if (!user.name || !user.lastName || !user.email || !user.password || !user.phoneNumber || !user.birthdate) {
        M.toast({ html: "Por favor, completa todos los campos obligatorios" });
        return;
      }

      // Validar formato de contraseña
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@]).{8,}$/;
      if (!passwordRegex.test(user.password)) {
        M.toast({ html: "La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo (#, $, %, &, *, @)" });
        return;
      }

      // Deshabilitar botón durante la petición
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="material-icons left">hourglass_empty</i>Registrando...';

      try {
        const res = await fetch("/api/auth/signUp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        const data = await res.json();
        
        if (res.ok) {
          M.toast({ html: "¡Registro exitoso! Redirigiendo al login..." });
          setTimeout(() => location.href = "/signIn", 2000);
        } else {
          M.toast({ html: data.message || "Error al registrarse" });
        }
      } catch (error) {
        M.toast({ html: "Error de conexión. Intenta nuevamente." });
      } finally {
        // Rehabilitar botón
        submitButton.disabled = false;
        submitButton.innerHTML = 'Registrarse <i class="material-icons right">person_add</i>';
      }
    });
  }

  // === PERFIL - EDITAR ===
  const editProfileForm = document.getElementById("editProfileForm");
  if (editProfileForm) {
    editProfileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const token = sessionStorage.getItem("token");
      if (!token) {
        M.toast({ html: "Sesión expirada" });
        location.href = "/signIn";
        return;
      }

      const formData = new FormData(editProfileForm);
      const userData = {
        name: formData.get('name')?.trim(),
        lastName: formData.get('lastName')?.trim(),
        phoneNumber: formData.get('phoneNumber')?.trim(),
        address: formData.get('address')?.trim() || '',
        url_profile: formData.get('url_profile')?.trim() || ''
      };

      try {
        const res = await fetch("/api/users/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(userData),
        });

        const data = await res.json();
        
        if (res.ok) {
          M.toast({ html: "Perfil actualizado exitosamente" });
          setTimeout(() => location.reload(), 1000);
        } else {
          M.toast({ html: data.message || "Error al actualizar perfil" });
        }
      } catch (error) {
        M.toast({ html: "Error de conexión. Intenta nuevamente." });
      }
    });
  }

  // Ejecutar protección de rutas en páginas protegidas
  protectRoute();
});
