import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/users";
import { sanitizeEmail, sanitizeString, isValidEmail } from "@/lib/sanitization";
import { validatePassword } from "@/lib/password-validation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting por IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = checkRateLimit(`register:${ip}`);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: `Demasiadas solicitudes. Intenta de nuevo en ${rateLimitResult.resetIn} segundos.` },
        { status: 429 }
      );
    }

    const { email, password, name } = await request.json();

    // Validar campos requeridos
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, contraseña y nombre son requeridos" },
        { status: 400 }
      );
    }

    // Sanitizar inputs
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedName = sanitizeString(name);

    // Validar email
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "El formato del email no es válido" },
        { status: 400 }
      );
    }

    // Validar contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: "Contraseña no cumple requisitos", details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = findUserByEmail(sanitizedEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 409 }
      );
    }

    // Crear usuario
    const user = await createUser(sanitizedEmail, password, sanitizedName);

    return NextResponse.json({
      message: "Usuario registrado exitosamente",
      user: { id: user.id, email: user.email, name: user.name }
    }, { status: 201 });

  } catch {
    return NextResponse.json(
      { error: "Error al procesar el registro. Intenta de nuevo." },
      { status: 500 }
    );
  }
}