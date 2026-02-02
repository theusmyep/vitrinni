/**
 * Vitrinni Events Manager
 * Sistema de gerenciamento de eventos
 */

class VitrinniEventsManager {
    constructor() {
        this.events = [];
        this.config = {};
        this.dataFile = 'data/events.json';
    }

    /**
     * Inicializa o sistema
     */
    async init() {
        await this.loadEvents();
        this.filterActiveEvents();
        this.renderCarousel();
        this.renderEventCards();
    }

    /**
     * Carrega eventos do JSON
     */
    async loadEvents() {
        let fileEvents = [];
        let fileConfig = {};

        try {
            const response = await fetch(this.dataFile, { cache: 'no-store' });
            const data = await response.json();
            fileEvents = Array.isArray(data.events) ? data.events : [];
            fileConfig = typeof data.config === 'object' && data.config ? data.config : {};
        } catch (error) {
            fileEvents = [];
            fileConfig = {};
        }

        let localEvents = [];
        try {
            const saved = localStorage.getItem('vitrinni_events');
            if (saved) {
                const data = JSON.parse(saved);
                localEvents = Array.isArray(data.events) ? data.events : [];
                if (!fileConfig || Object.keys(fileConfig).length === 0) {
                    fileConfig = typeof data.config === 'object' && data.config ? data.config : {};
                }
            }
        } catch (error) {
            localEvents = [];
        }

        const mapBySlug = new Map();
        [...fileEvents, ...localEvents].forEach(ev => {
            if (ev && ev.slug) {
                mapBySlug.set(ev.slug, ev);
            }
        });

        this.events = Array.from(mapBySlug.values());
        this.config = fileConfig || {};
    }

    /**
     * Filtra eventos ativos baseado na data/hora
     */
    filterActiveEvents() {
        const now = new Date();

        this.events = this.events.filter(event => {
            if (!event.active) return false;

            // Criar data de remoção (dia seguinte às 4h da manhã)
            const eventDate = new Date(event.endDate || event.date);
            const removeHour = this.config.autoRemoveHours || 4;
            const removeDate = new Date(eventDate);
            removeDate.setHours(removeHour, 0, 0, 0);

            // Se já passou do horário de remoção, desativar
            if (now > removeDate) {
                console.log(`Evento ${event.title} expirado em ${removeDate}`);
                return false;
            }

            return true;
        });

        // Ordenar eventos por data (mais próximo primeiro)
        this.events.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });

        console.log('Eventos ativos:', this.events.length);
    }

    /**
     * Renderiza o carrossel na home
     */
    renderCarousel() {
        const carouselContainer = document.querySelector('.lazy.slider');
        if (!carouselContainer) {
            console.warn('Container do carrossel não encontrado');
            return;
        }

        // Limpa carrossel existente
        carouselContainer.innerHTML = '';

        // Adiciona slides dos eventos
        this.events.forEach(event => {
            const slide = document.createElement('div');
            slide.innerHTML = `
                <a href='eventos/${event.slug}.html'>
                    <img src='${event.bannerHome}' alt='${event.title}'>
                </a>
            `;
            carouselContainer.appendChild(slide);
        });

        // Adiciona slide fixo se existir
        const fixedSlide = document.createElement('div');
        fixedSlide.innerHTML = `<img src='eventos/slide02.jpg' alt=''>`;
        carouselContainer.appendChild(fixedSlide);

        // Reinicializa o Slick Carousel
        if (typeof jQuery !== 'undefined' && jQuery.fn.slick) {
            const $c = jQuery(carouselContainer);
            if ($c.hasClass('slick-initialized')) {
                $c.slick('unslick');
            }
            $c.slick({
                lazyLoad: 'ondemand',
                infinite: true,
                autoplay: this.config.carouselAutoplay || true,
                autoplaySpeed: this.config.carouselSpeed || 5000
            });
        }
    }

    /**
     * Renderiza cards de eventos na home
     */
    renderEventCards() {
        const cardsContainer = document.querySelector('.row.align-items-end');
        if (!cardsContainer) {
            console.warn('Container de cards não encontrado');
            return;
        }

        // Remove cards antigos de eventos (mantém apenas elementos que não são eventos)
        const oldCards = cardsContainer.querySelectorAll('.event-card');
        oldCards.forEach(card => card.remove());

        // Detectar se é mobile
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Mobile: Adicionar classe para carrossel
            cardsContainer.classList.add('eventos-carousel-mobile');
        } else {
            // Desktop: Remover classe de carrossel se existir
            cardsContainer.classList.remove('eventos-carousel-mobile');
        }

        // Adiciona novos cards
        this.events.forEach(event => {
            const eventDate = new Date(event.date);
            const formattedDate = this.formatDate(eventDate);
            const dayOfWeek = this.getDayOfWeek(eventDate);

            const card = document.createElement('div');
            card.className = 'col-12 col-lg-4 order-3 order-lg-2 text-center z-index-0 wow animate__fadeIn event-card';
            card.innerHTML = `
                <div class='tilt-box' data-tilt-options='{ "maxTilt": 20, "perspective": 1000, "easing": "cubic-bezier(.03,.98,.52,.99)", "scale": 1, "speed": 500, "transition": true, "reset": true, "glare": false, "maxGlare": 1 }'>
                    <a href='eventos/${event.slug}.html'>
                        <img src='${event.bannerEvent}' alt='${event.title}'>
                    </a>
                    <span class='alt-font text-extra-large text-extra-dark-gray letter-spacing-4px font-weight-600 text-uppercase margin-5px-top d-block'>
                        <h5 style='text-align: center !important; margin: 0 0 0 0 !important;'>${event.title}</h5>
                        ${formattedDate}<br>
                        <span class='event-day-of-week'>${dayOfWeek}</span><br><br>
                    </span>
                </div>
            `;

            cardsContainer.appendChild(card);
        });

        // Inicializar carrossel no mobile
        if (isMobile && typeof jQuery !== 'undefined' && jQuery.fn.slick) {
            const $container = jQuery(cardsContainer);

            // Destruir carrossel existente se houver
            if ($container.hasClass('slick-initialized')) {
                $container.slick('unslick');
            }

            // Inicializar novo carrossel
            setTimeout(() => {
                $container.slick({
                    dots: true,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 4000,
                    arrows: true,
                    adaptiveHeight: false,
                    centerMode: false,
                    responsive: [
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1.5,
                                slidesToScroll: 1,
                                centerMode: false,
                                centerPadding: '0px'
                            }
                        }
                    ]
                });
            }, 100);
        }
    }

    /**
     * Formata data para exibição
     */
    formatDate(date) {
        // Usar UTC para evitar problemas de timezone
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    }

    /**
     * Retorna o dia da semana em português
     */
    getDayOfWeek(date) {
        const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        return days[date.getUTCDay()];
    }

    /**
     * Adiciona novo evento
     */
    async addEvent(eventData) {
        // Gera slug automático se não fornecido
        if (!eventData.slug) {
            const date = new Date(eventData.date);
            const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
            const titleSlug = eventData.title.toLowerCase().replace(/\s+/g, '-');
            eventData.slug = `evento-${dateStr}-${titleSlug}`;
        }

        // Gera ID automático se não fornecido
        if (!eventData.id) {
            const date = new Date(eventData.date);
            eventData.id = date.toISOString().split('T')[0].replace(/-/g, '');
        }

        this.events.push(eventData);
        await this.saveEvents();
        await this.createEventPage(eventData);
    }

    /**
     * Salva eventos no JSON (apenas para referência - requer backend)
     */
    async saveEvents() {
        console.log('Para salvar eventos, implemente um backend ou use localStorage');
        // Esta função precisaria de um backend PHP/Node para salvar o JSON
        // Por enquanto, vamos usar localStorage como alternativa
        const data = {
            events: this.events,
            config: this.config
        };
        localStorage.setItem('vitrinni_events', JSON.stringify(data));
    }

    /**
     * Cria página do evento
     */
    async createEventPage(event) {
        console.log(`Para criar a página do evento ${event.slug}, use o template em eventos/template.html`);
        // Esta função seria executada no servidor
        // No frontend, apenas informamos que a página precisa ser criada
    }

    /**
     * Remove evento por ID
     */
    removeEvent(eventId) {
        this.events = this.events.filter(e => e.id !== eventId);
        this.saveEvents();
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.vitrinniEvents = new VitrinniEventsManager();
    window.vitrinniEvents.init();

    // Reinicializar ao redimensionar (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.vitrinniEvents) {
                window.vitrinniEvents.renderEventCards();
            }
        }, 250);
    });
});
