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

    var assurance = await supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel();

    if (assurance.error) {
        return {
            ok: false,
            error: "No se ha podido comprobar la verificación."
        };
    }

    // Comprobar si necesita el segundo factor
    if (assurance.data.nextLevel === "aal2" &&
        assurance.data.currentLevel !== "aal2") {

        var factors = await supabaseClient.auth.mfa.listFactors();

        if (factors.error) {
            return { ok: false, error: "Error al consultar MFA." };
        }

        var totp = factors.data.totp.filter(function(factor) {
            return factor.status === "verified";
        });

        if (totp.length === 0) {
            return {
                ok: false,
                enrollRequired: true,
                error: "Debes configurar la verificación en dos pasos."
            };
        }

        var challenge = await supabaseClient.auth.mfa.challenge({
            factorId: totp[0].id
        });

        if (challenge.error) {
            return { ok: false, error: "No se pudo generar el código." };
        }

        return {
            ok: false,
            mfaRequired: true,
            factorId: totp[0].id,
            challengeId: challenge.data.id
        };
    }

    return { ok: true };
}


// Verificar el código de seis cifras al iniciar sesión
async function verifyMFA(factorId, challengeId, code) {
    var result = await supabaseClient.auth.mfa.verify({
        factorId: factorId,
        challengeId: challengeId,
        code: code
    });

    if (result.error) {
        return {
            ok: false,
            error: "Código incorrecto o caducado."
        };
    }

    return { ok: true };
}


// Registrar una aplicación autenticadora
async function enrollMFA() {
    var result = await supabaseClient.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Krypta Authenticator"
    });

    if (result.error) {
        return {
            ok: false,
            error: result.error.message
        };
    }

    return {
        ok: true,
        factorId: result.data.id,
        qrCode: result.data.totp.qr_code,
        secret: result.data.totp.secret
    };
}


// Verificar el primer código durante el registro MFA
async function verifyEnrollment(factorId, code) {
    var challenge = await supabaseClient.auth.mfa.challenge({
        factorId: factorId
    });

    if (challenge.error) {
        return {
            ok: false,
            error: challenge.error.message
        };
    }

    var result = await supabaseClient.auth.mfa.verify({
        factorId: factorId,
        challengeId: challenge.data.id,
        code: code
    });

    if (result.error) {
        return {
            ok: false,
            error: "No se ha podido verificar el código."
        };
    }

    return { ok: true };
}


// Obtener la sesión actual
async function getSession() {
    var result = await supabaseClient.auth.getSession();

    if (result.error) {
        return null;
    }

    return result.data.session;
}


// Comprobar que el usuario tiene MFA verificado
async function hasMFA() {
    var result = await supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel();

    if (result.error) {
        return false;
    }

    return result.data.currentLevel === "aal2";
}


// Cerrar sesión
async function logout() {
    await supabaseClient.auth.signOut();
    location.href = "login.html";
}
