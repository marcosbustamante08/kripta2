
// Configuración de Supabase - Krypta

const SUPABASE_URL = "https://jzsubncsraouxliwfxpn.supabase.co";

const SUPABASE_KEY = "sb_publishable_h36FkfLGWoyQ4wXgPdsBBQ_VYJzo3Hs";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
