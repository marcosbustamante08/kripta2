// Sistema de autenticación de Krypta
// Gestionado mediante Supabase

// Iniciar sesión
async function login(email, password) {

    var result = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (result.error) {
        return {
            ok: false,
            error: "Correo o contraseña incorrectos."
        };
    }

    return {
        ok: true,
        user: result.data.user
    };
}


// Obtener la sesión actual
async function getSession() {

    var result = await supabaseClient.auth.getSession();

    if (result.error) {
        return null;
    }

    return result.data.session;
}


// Cerrar sesión
async function logout() {

    var result = await supabaseClient.auth.signOut();

    location.replace("login.html");

}
