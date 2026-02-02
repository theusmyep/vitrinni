/**
 * CONFIGURAÇÃO GLOBAL - VITRINNI LOUNGE
 * Centralize todas as URLs e configurações aqui
 */

const VITRINNI_CONFIG = {
    // Google Sheets Integration
    googleSheets: {
        url: 'https://script.google.com/macros/s/AKfycbyftEhNVd9HrSNsYgP2DekXDKY2Y6LUViV0dX4hUVXlAx82O-cG6llIVRbRgwY7o2g/exec',
        spreadsheetId: '1e4SvVMhkJkMRggY8yaaccfRpluOgh_UjWyK9fJ70NKI'
    },

    // Upload Server
    uploadServer: {
        url: 'http://localhost:3000',
        endpoints: {
            upload: '/upload',
            eventos: '/eventos',
            delete: '/eventos/:filename'
        }
    },

    // Events Configuration
    events: {
        dataFile: 'data/events.json',
        autoRemoveHours: 4, // Remove após 4h da manhã
        carouselAutoplay: true,
        carouselSpeed: 5000
    },

    // Form Validation
    validation: {
        minNameLength: 3,
        maxNameLength: 100
    }
};

// Exportar para uso global
window.VITRINNI_CONFIG = VITRINNI_CONFIG;
