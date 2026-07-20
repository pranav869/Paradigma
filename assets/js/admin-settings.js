// admin-settings.js

document.addEventListener('AdminAuthenticated', () => {
    initSettingsManager();
});

function initSettingsManager() {
    const supabase = window.supabaseClient;
    const settingsForm = document.getElementById('settings-form');
    const btnSaveSettings = document.getElementById('btn-save-settings');

    const inputs = {
        companyName: document.getElementById('set-company'),
        email: document.getElementById('set-email'),
        phoneNumber: document.getElementById('set-phone'),
        whatsappNumber: document.getElementById('set-whatsapp'),
        address: document.getElementById('set-address'),
        instagram: document.getElementById('set-instagram'),
        linkedin: document.getElementById('set-linkedin'),
        pinterest: document.getElementById('set-pinterest'),
        twitter: document.getElementById('set-twitter')
    };

    // Load settings
    async function loadSettings() {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 'site_settings')
            .maybeSingle();

        if (data) {
            inputs.companyName.value = data.companyName || '';
            inputs.email.value = data.email || '';
            inputs.phoneNumber.value = data.phoneNumber || '';
            inputs.whatsappNumber.value = data.whatsappNumber || '';
            inputs.address.value = data.address || '';
            
            if (data.socialLinks) {
                inputs.instagram.value = data.socialLinks.instagram || '';
                inputs.linkedin.value = data.socialLinks.linkedin || '';
                inputs.pinterest.value = data.socialLinks.pinterest || '';
                inputs.twitter.value = data.socialLinks.twitter || '';
            }
        }
    }

    loadSettings();

    // Save settings
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnSaveSettings.textContent = 'Saving...';
        btnSaveSettings.disabled = true;

        const settingsData = {
            id: 'site_settings',
            companyName: inputs.companyName.value,
            email: inputs.email.value,
            phoneNumber: inputs.phoneNumber.value,
            whatsappNumber: inputs.whatsappNumber.value,
            address: inputs.address.value,
            socialLinks: {
                instagram: inputs.instagram.value,
                linkedin: inputs.linkedin.value,
                pinterest: inputs.pinterest.value,
                twitter: inputs.twitter.value
            }
        };

        try {
            const { error } = await supabase
                .from('settings')
                .upsert(settingsData, { onConflict: 'id' });
                
            if (error) throw error;
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings.");
        } finally {
            btnSaveSettings.textContent = 'Save Settings';
            btnSaveSettings.disabled = false;
        }
    });
}
