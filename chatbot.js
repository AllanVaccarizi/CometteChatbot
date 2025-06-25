(function() {
    // Prevent multiple initializations
    if (window.GrowthAIChatWidgetInitialized) return;
    window.GrowthAIChatWidgetInitialized = true;

    // Load Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap';
    document.head.appendChild(fontLink);

    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #B19CD9);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b837b);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #1B1919);
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(255, 128, 0, 0.15);
            border: 1px solid rgba(255, 128, 0, 0.2);
            overflow: hidden;
            font-family: inherit;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .n8n-chat-widget .chat-container.closing {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(255, 128, 0, 0.1);
            position: relative;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            cursor: pointer; /* Ajouter le curseur pointer pour indiquer que c'est cliquable */
            user-select: none; /* Empêcher la sélection de texte */
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.8;
            font-weight: bold;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: #ffffff;
            font-family: 'Montserrat', sans-serif;
        }

        .n8n-chat-widget .chat-interface {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
            font-family: 'Montserrat', sans-serif;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: #ffffff;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(255, 128, 0, 0.2);
            border: none;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-message.bot {
            background: #f8f9fa;
            border: 1px solid rgba(27, 25, 25, 0.1);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            position: relative;
            margin-top: 35px;
            margin-left: 18px;
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(255, 128, 0, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(255, 128, 0, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            transition: border-color 0.2s;
        }

        .n8n-chat-widget .chat-input textarea:focus {
            outline: none;
            border-color: var(--chat--color-primary);
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
    background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 0 20px;
    cursor: pointer;
    transition: transform 0.2s;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    height: 100%;
    min-height: 44px;
    align-self: stretch;
}

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: #ffffff;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 128, 0, 0.3);
            z-index: 999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle.hidden {
            transform: scale(0);
            opacity: 0;
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .typing-indicator {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 8px 12px;
            background: rgba(255, 128, 0, 0.1);
            border-radius: 12px;
            width: fit-content;
            align-self: flex-start;
            margin-top: 35px;
            margin-left: 18px;
        }

        .n8n-chat-widget .typing-indicator span {
            height: 8px;
            width: 8px;
            margin: 0 2px;
            background-color: var(--chat--color-primary);
            border-radius: 50%;
            display: inline-block;
            opacity: 0.8;
        }

        .n8n-chat-widget .typing-indicator span:nth-child(1) {
            animation: pulse 1s infinite;
        }

        .n8n-chat-widget .typing-indicator span:nth-child(2) {
            animation: pulse 1s infinite 0.2s;
        }

        .n8n-chat-widget .typing-indicator span:nth-child(3) {
            animation: pulse 1s infinite 0.4s;
        }

        /* Nouveau style pour le conteneur typing avec texte */
        .n8n-chat-widget .typing-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin: 10px 0;
            margin-top: 35px;
            margin-left: 18px;
            gap: 4px;
        }

        .n8n-chat-widget .typing-container .typing-indicator {
            margin: 0;
            margin-left: 0;
            margin-top: 0;
        }

        .n8n-chat-widget .typing-container .response-time-info {
            font-size: 11px;
            color: var(--chat--color-font);
            opacity: 0.6;
            font-family: 'Montserrat', sans-serif;
            font-style: italic;
            padding-left: 12px;
        }

        @keyframes pulse {
            0% {
                opacity: 0.4;
                transform: scale(1);
            }
            50% {
                opacity: 1;
                transform: scale(1.2);
            }
            100% {
                opacity: 0.4;
                transform: scale(1);
            }
        }

        .n8n-chat-widget .bot-avatar {
            position: absolute;
            top: -30px;
            left: -12px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            background-image: url('https://comettecosmetics.com/wp-content/uploads/2024/11/Rectangle-5-2-1-768x797.png');
            border: 2px solid var(--chat--color-primary);
        }

        .n8n-chat-widget .chat-message a {
            color: var(--chat--color-primary);
            text-decoration: underline;
            font-weight: 600;
            transition: color 0.2s;
        }

        .n8n-chat-widget .chat-message a:hover {
            color: var(--chat--color-secondary);
            opacity: 0.8;
        }

        .n8n-chat-widget .initial-message {
    margin: 0; /* Supprimer les marges pour prendre toute la largeur */
    padding: 16px 20px; /* Augmenter le padding */
    background: #f8f9fa;
    border-radius: 0; /* Supprimer le border-radius pour aller jusqu'aux bords */
    border-bottom: 1px solid rgba(255, 128, 0, 0.1); /* Bordure en bas au lieu de gauche */
}

.n8n-chat-widget .initial-message h3 {
    margin: 0 0 6px 0; /* Augmenter un peu l'espacement sous le titre */
    color: var(--chat--color-font);
    font-family: 'Anton SC', sans-serif;
    font-size: 16px; /* Augmenter la taille du titre */
    text-align: center; /* Centrer le titre */
}

.n8n-chat-widget .initial-message p {
    margin: 0;
    color: var(--chat--color-font);
    opacity: 0.8;
    font-size: 13px; /* Augmenter légèrement la taille du texte */
    line-height: 1.4; /* Améliorer l'interligne */
    text-align: center; /* Centrer le texte */
}

        /* Styles pour les messages pré-rédigés */
        .n8n-chat-widget .predefined-messages {
            padding: 16px;
            background: var(--chat--color-background);
            border-bottom: 1px solid rgba(255, 128, 0, 0.1);
        }

        .n8n-chat-widget .predefined-messages-title {
            font-size: 12px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin-bottom: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .n8n-chat-widget .predefined-message-button {
            display: block;
            width: 100%;
            text-align: left;
            padding: 10px 14px;
            margin-bottom: 8px;
            background: #f8f9fa;
            border: 1px solid rgba(255, 128, 0, 0.15);
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            line-height: 1.4;
            color: var(--chat--color-font);
            font-family: 'Montserrat', sans-serif;
            transition: all 0.2s ease;
        }

        .n8n-chat-widget .predefined-message-button:last-child {
            margin-bottom: 0;
        }

        .n8n-chat-widget .predefined-message-button:hover {
            background: linear-gradient(135deg, rgba(255, 128, 0, 0.1) 0%, rgba(231, 191, 38, 0.1) 100%);
            border-color: var(--chat--color-primary);
            transform: translateX(4px);
        }

        .n8n-chat-widget .predefined-message-button:active {
            transform: scale(0.98);
        }

        /* Animation de sortie pour les messages pré-rédigés */
        @keyframes fadeOut {
            0% {
                opacity: 1;
                transform: translateY(0);
            }
            100% {
                opacity: 0;
                transform: translateY(-10px);
            }
        }

        .n8n-chat-widget .predefined-messages.hide {
            animation: fadeOut 0.3s ease forwards;
        }

        /* Animation d'apparition pour les messages du bot */
        @keyframes messageAppear {
            0% {
                opacity: 0;
                transform: translateY(10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .n8n-chat-widget .chat-message.bot {
            animation: messageAppear 0.3s ease-out;
        }

        .n8n-chat-widget .bot-avatar {
            animation: messageAppear 0.2s ease-out;
        }

        /* Effet curseur clignotant pour l'effet machine à écrire */
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        .n8n-chat-widget .chat-message.bot.typing::after {
            content: '|';
            animation: blink 1s infinite;
            color: var(--chat--color-primary);
            font-weight: bold;
        }

        /* Popup "Une question ?" */
        .n8n-chat-widget .chat-popup {
            position: fixed;
            bottom: 90px;
            right: 20px;
            background: #DC2626;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Montserrat', sans-serif;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
            opacity: 0;
            transform: scale(0) translateX(20px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: none;
            z-index: 998;
            cursor: pointer;
        }

        /* Masquer le popup sur mobile */
        @media (max-width: 768px) {
            .n8n-chat-widget .chat-popup {
                display: none !important;
            }
        }

        .n8n-chat-widget .chat-popup.position-left {
            right: auto;
            left: 20px;
            transform: scale(0) translateX(-20px);
        }

        .n8n-chat-widget .chat-popup.show {
            opacity: 1;
            transform: scale(1) translateX(0);
            pointer-events: auto;
        }

        .n8n-chat-widget .chat-popup::after {
            content: '';
            position: absolute;
            bottom: -8px;
            right: 30px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid #DC2626;
        }

        .n8n-chat-widget .chat-popup.position-left::after {
            right: auto;
            left: 30px;
        }

        @keyframes popupBounce {
            0%, 100% { transform: scale(1) translateX(0); }
            50% { transform: scale(1.05) translateX(0); }
        }

        .n8n-chat-widget .chat-popup.show {
            animation: popupBounce 2s ease-in-out infinite;
        }
        .n8n-chat-widget .chat-message strong {
    font-weight: 700;
    color: inherit;
        }
        .n8n-chat-widget .chat-message em {
            font-style: italic;
            color: inherit;
        }

        .n8n-chat-widget .chat-message.bot strong {
            color: var(--chat--color-font);
            font-weight: 700;
        }

        .n8n-chat-widget .chat-message.bot em {
            color: var(--chat--color-font);
            font-style: italic;
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(255, 128, 0, 0.1);
            text-align: center;
            font-size: 11px;
            color: var(--chat--color-font);
            opacity: 0.7;
            font-family: 'Montserrat', sans-serif;
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.2s;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 0.8;
            text-decoration: underline;
        }    
`;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: window.CHATBOT_WEBHOOK_URL || 'https://n8n.srv749948.hstgr.cloud/webhook/88707b4f-c9ba-4bd5-b1ae-4eecb628fa9d/chat',
            route: 'general'
        },
        branding: {
            welcomeText: 'Besoin d\'aide ?',
        },
        style: {
            primaryColor: '#B19CD9',
            secondaryColor: '#6b837b',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1B1919'
        },
        security: {
            maxMessageLength: 2000,
            requestTimeout: 60000, // 60 secondes pour les réponses lentes
            maxSessionDuration: 3600000
        }
    };

    // Messages pré-rédigés
    const predefinedMessages = [
        "Quels produits conviennent à ma peau sensible ?",
        "Comment choisir ma routine de soin naturelle ?",
        "Vos produits sont-ils vraiment 100% biologiques ?",
        "Avez-vous des coffrets cadeaux disponibles ?"
    ];

    // Merge user config with defaults
    const config = window.GrowthAIChatConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.GrowthAIChatConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.GrowthAIChatConfig.branding },
            style: { ...defaultConfig.style, ...window.GrowthAIChatConfig.style },
            security: { ...defaultConfig.security, ...window.GrowthAIChatConfig.security }
        } : defaultConfig;

    let currentSessionId = '';
    let sessionTimeout = null;

    // Variables pour mémoriser l'état du chatbot
    let chatHasBeenClosed = localStorage.getItem('chatbot_closed') === 'true';
    let chatHasBeenOpened = localStorage.getItem('chatbot_opened') === 'true';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);
  
    // Security functions
    function sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return ['http:', 'https:'].includes(url.protocol);
        } catch (_) {
            return false;
        }
    }

    // Rate Limiter
    class RateLimiter {
        constructor() {
            this.requests = [];
            this.maxRequests = 5; // 5 messages par minute
            this.timeWindow = 60000; // 1 minute
        }
        
        canMakeRequest() {
            const now = Date.now();
            this.requests = this.requests.filter(time => now - time < this.timeWindow);
            
            if (this.requests.length >= this.maxRequests) {
                return false;
            }
            
            this.requests.push(now);
            return true;
        }
    }

    const rateLimiter = new RateLimiter();

    function convertMarkdownToHtml(text) {
        // Échapper d'abord tout le HTML
        text = sanitizeHtml(text);
        
        text = text.replace(/\\n/g, '\n');
        
        // Traiter les liens AVANT le formatage bold pour éviter les conflits
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
            if (isValidUrl(url)) {
                // Nettoyer le texte du lien des balises HTML échappées
                let cleanLinkText = linkText
                    .replace(/&lt;strong&gt;/g, '<strong>')
                    .replace(/&lt;\/strong&gt;/g, '</strong>')
                    .replace(/&lt;em&gt;/g, '<em>')
                    .replace(/&lt;\/em&gt;/g, '</em>');
                
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${cleanLinkText}</a>`;
            }
            return linkText;
        });
        
        // Traiter le formatage bold APRÈS les liens
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        text = text.replace(/\n/g, '<br>');
        return text;
    }

    // Fonction pour créer l'indicateur de typing avec le message de temps de réponse
    function createTypingIndicatorWithMessage() {
        const typingContainer = document.createElement('div');
        typingContainer.className = 'typing-container';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        
        const responseTimeInfo = document.createElement('div');
        responseTimeInfo.className = 'response-time-info';
        responseTimeInfo.textContent = 'Temps moyen de réponse ~30 secondes';
        
        typingContainer.appendChild(typingIndicator);
        typingContainer.appendChild(responseTimeInfo);
        
        return typingContainer;
    }

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="predefined-messages">
                <div class="predefined-messages-title">Questions fréquentes</div>
                ${predefinedMessages.map(msg => 
                    `<button class="predefined-message-button">${sanitizeHtml(msg)}</button>`
                ).join('')}
            </div>
            <div class="chat-input">
                <textarea placeholder="Posez votre question..." rows="1" maxlength="${config.security.maxMessageLength}"></textarea>
                <button type="submit">Envoyer</button>
            </div> 
             <div class="chat-footer">
            Propulsé par <a href="https://agence-n8n.com" target="_blank" rel="noopener noreferrer">Growth-AI</a>
            </div>
        </div>
    `;
    
    chatContainer.innerHTML = chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    // Créer le popup "Une question ?"
    const chatPopup = document.createElement('div');
    chatPopup.className = `chat-popup${config.style.position === 'left' ? ' position-left' : ''}`;
    chatPopup.textContent = 'Une question ?';
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    widgetContainer.appendChild(chatPopup);
    document.body.appendChild(widgetContainer);

    // Auto-open chatbot seulement si c'est la première visite ET qu'il n'a jamais été fermé
    if (!chatHasBeenOpened && !chatHasBeenClosed) {
        setTimeout(() => {
            chatContainer.style.display = 'flex';
            void chatContainer.offsetWidth; // Force reflow
            chatContainer.classList.add('open');
            chatHasBeenOpened = true;
            localStorage.setItem('chatbot_opened', 'true');
            
            // Ajouter le message de bienvenue automatique après l'ouverture
            setTimeout(() => {
                addWelcomeMessage();
            }, 800); // Délai pour que l'animation d'ouverture soit terminée
        }, 500);
    }

    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const predefinedMessagesContainer = chatContainer.querySelector('.predefined-messages');

    function generateUUID() {
        return crypto.randomUUID();
    }

    // Fonction pour ajouter le message de bienvenue automatique
    function addWelcomeMessage() {
        const welcomeMessageDiv = document.createElement('div');
        welcomeMessageDiv.className = 'chat-message bot';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'bot-avatar';
        welcomeMessageDiv.appendChild(avatarDiv);
        
        const textContainer = document.createElement('span');
        welcomeMessageDiv.appendChild(textContainer);
        
        messagesContainer.appendChild(welcomeMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Message de bienvenue avec effet machine à écrire
        const welcomeText = `<strong>${config.branding.welcomeText}</strong><br>Je suis là pour vous répondre à vos questions !`;
        typeWriter(textContainer, welcomeText, 30);
    }

    function validateMessage(message) {
        if (!message || typeof message !== 'string') {
            throw new Error('Message invalide');
        }

        if (message.length > config.security.maxMessageLength) {
            throw new Error(`Message trop long (max ${config.security.maxMessageLength} caractères)`);
        }
        
        const suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+=/i,
            /data:/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /vbscript:/i
        ];
        
        for (const pattern of suspiciousPatterns) {
            if (pattern.test(message)) {
                throw new Error('Contenu non autorisé détecté');
            }
        }
        
        return message.trim();
    }

    // Session management with timeout
    function resetSessionTimeout() {
        if (sessionTimeout) {
            clearTimeout(sessionTimeout);
        }
        sessionTimeout = setTimeout(() => {
            currentSessionId = '';
            console.log('Session expirée');
        }, config.security.maxSessionDuration);
    }

    // Initialiser la session automatiquement lors de l'ouverture
    async function initializeSession() {
        if (!currentSessionId) {
            currentSessionId = generateUUID();
            resetSessionTimeout();
            
            const data = [{
                action: "loadPreviousSession",
                sessionId: currentSessionId,
                route: config.webhook.route,
                metadata: {
                    userId: "",
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent.substring(0, 100)
                }
            }];

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), config.security.requestTimeout);

                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                const responseData = await response.json();
                console.log('Session initialized:', responseData);
            } catch (error) {
                console.error('Error initializing session:', error);
            }
        } else {
            resetSessionTimeout();
        }
    }

    // Fonction pour masquer les messages pré-rédigés
    function hidePredefinedMessages() {
        if (predefinedMessagesContainer && !predefinedMessagesContainer.classList.contains('hide')) {
            predefinedMessagesContainer.style.display = 'none';
        }
    }

    // Fonction pour créer l'effet machine à écrire
    function typeWriter(element, htmlText, speed = 30) {
        let index = 0;
        const parentDiv = element.parentElement;
        parentDiv.classList.add('typing');
        element.innerHTML = '';
        
        // Convertir le HTML en texte visible + balises cachées
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlText;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        function type() {
            if (index < textContent.length) {
                updateElementWithPartialText(element, htmlText, index + 1);
                index++;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                setTimeout(type, speed);
            } else {
                parentDiv.classList.remove('typing');
            }
        }
        
        function updateElementWithPartialText(elem, fullHtml, charCount) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = fullHtml;
            
            let currentCount = 0;
            processNode(tempDiv, charCount);
            elem.innerHTML = tempDiv.innerHTML;
            
            function processNode(node, targetCount) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    const child = node.childNodes[i];
                    
                    if (child.nodeType === Node.TEXT_NODE) {
                        const textLength = child.textContent.length;
                        if (currentCount + textLength <= targetCount) {
                            currentCount += textLength;
                        } else {
                            const remainingChars = targetCount - currentCount;
                            child.textContent = child.textContent.substring(0, remainingChars);
                            currentCount = targetCount;
                            while (node.childNodes[i + 1]) {
                                node.removeChild(node.childNodes[i + 1]);
                            }
                            return;
                        }
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        const textInElement = child.textContent.length;
                        if (currentCount + textInElement <= targetCount) {
                            currentCount += textInElement;
                        } else {
                            processNode(child, targetCount);
                            while (node.childNodes[i + 1]) {
                                node.removeChild(node.childNodes[i + 1]);
                            }
                            return;
                        }
                    }
                    
                    if (currentCount >= targetCount) {
                        while (node.childNodes[i + 1]) {
                            node.removeChild(node.childNodes[i + 1]);
                        }
                        return;
                    }
                }
            }
        }
        
        type();
    }

    async function sendMessage(message) {
        // 1. Vérifier le rate limiting
        if (!rateLimiter.canMakeRequest()) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'chat-message bot';
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'bot-avatar';
            errorDiv.appendChild(avatarDiv);
            const textContainer = document.createElement('span');
            textContainer.textContent = 'Trop de messages. Attendez 1 minute.';
            errorDiv.appendChild(textContainer);
            messagesContainer.appendChild(errorDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            return;
        }

        try {
            // 2. Valider le message
            const validatedMessage = validateMessage(message);
            
            // 3. Initialiser la session
            await initializeSession();

            // 4. Préparer les données
            const messageData = {
                action: "sendMessage",
                sessionId: currentSessionId,
                route: config.webhook.route,
                chatInput: validatedMessage,
                metadata: {
                    userId: "",
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent.substring(0, 100)
                }
            };
            
            // 5. Afficher le message utilisateur (avec le message validé)
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = validatedMessage;
            messagesContainer.appendChild(userMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // 6. Afficher l'indicateur de frappe avec le message de temps de réponse
            const typingContainer = createTypingIndicatorWithMessage();
            messagesContainer.appendChild(typingContainer);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // 7. Envoyer la requête avec timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.security.requestTimeout);

            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            // Valider la réponse du serveur
            if (!data || (Array.isArray(data) && !data[0]?.output) || (!Array.isArray(data) && !data.output)) {
                throw new Error('Réponse invalide du serveur');
            }
            
            console.log("Response data:", data);
            
            // 8. Supprimer l'indicateur de frappe avec le message
            if (messagesContainer.contains(typingContainer)) {
                messagesContainer.removeChild(typingContainer);
            }
            
            // 9. Créer le message du bot
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'bot-avatar';
            botMessageDiv.appendChild(avatarDiv);
            
            const textContainer = document.createElement('span');
            botMessageDiv.appendChild(textContainer);
            
            // 10. Traiter la réponse
            let messageText = Array.isArray(data) ? data[0].output : data.output;
            
            // Sanitize response
            if (typeof messageText === 'string') {
                messagesContainer.appendChild(botMessageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // 11. Appliquer l'effet machine à écrire
                if (messageText.trim().startsWith('<html>') && messageText.trim().endsWith('</html>')) {
                    messageText = messageText.replace(/<html>|<\/html>/g, '').trim();
                    typeWriter(textContainer, messageText, 20);
                } else {
                    messageText = convertMarkdownToHtml(messageText);
                    typeWriter(textContainer, messageText, 20);
                }
            } else {
                throw new Error('Réponse invalide du serveur');
            }
            
        } catch (error) {
            console.error('Erreur dans sendMessage:', error);
            
            // Supprimer l'indicateur de frappe s'il existe encore
            const existingTypingContainer = messagesContainer.querySelector('.typing-container');
            if (existingTypingContainer) {
                messagesContainer.removeChild(existingTypingContainer);
            }
            
            // Afficher le message d'erreur approprié
            const errorDiv = document.createElement('div');
            errorDiv.className = 'chat-message bot';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'bot-avatar';
            errorDiv.appendChild(avatarDiv);
            
            const textContainer = document.createElement('span');
            errorDiv.appendChild(textContainer);
            
            // Message d'erreur spécifique selon le type d'erreur
            if (error.message.includes('trop long') || error.message.includes('non autorisé') || error.message.includes('invalide')) {
                textContainer.textContent = error.message;
            } else if (error.name === 'AbortError') {
                textContainer.textContent = "La requête a pris trop de temps. Veuillez réessayer.";
            } else {
                textContainer.textContent = "Désolé, une erreur est survenue. Veuillez réessayer.";
            }
            
            messagesContainer.appendChild(errorDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async function sendMessageBackground(message, existingTypingContainer) {
        try {
            const validatedMessage = validateMessage(message);
            await initializeSession();

            const messageData = {
                action: "sendMessage",
                sessionId: currentSessionId,
                route: config.webhook.route,
                chatInput: validatedMessage,
                metadata: {
                    userId: "",
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent.substring(0, 100)
                }
            };

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.security.requestTimeout);

            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data || (Array.isArray(data) && !data[0]?.output) || (!Array.isArray(data) && !data.output)) {
                throw new Error('Réponse invalide du serveur');
            }
            
            console.log("Response data:", data);
            
            // Supprimer le typing container existant
            if (messagesContainer.contains(existingTypingContainer)) {
                messagesContainer.removeChild(existingTypingContainer);
            }
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'bot-avatar';
            botMessageDiv.appendChild(avatarDiv);
            
            const textContainer = document.createElement('span');
            botMessageDiv.appendChild(textContainer);
            
            let messageText = Array.isArray(data) ? data[0].output : data.output;
            
            if (typeof messageText === 'string') {
                messagesContainer.appendChild(botMessageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                if (messageText.trim().startsWith('<html>') && messageText.trim().endsWith('</html>')) {
                    messageText = messageText.replace(/<html>|<\/html>/g, '').trim();
                    typeWriter(textContainer, messageText, 20);
                } else {
                    messageText = convertMarkdownToHtml(messageText);
                    typeWriter(textContainer, messageText, 20);
                }
            } else {
                throw new Error('Réponse invalide du serveur');
            }
            
        } catch (error) {
            console.error('Erreur réseau:', error);
            
            if (messagesContainer.contains(existingTypingContainer)) {
                messagesContainer.removeChild(existingTypingContainer);
            }
            
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.className = 'chat-message bot';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'bot-avatar';
            errorMessageDiv.appendChild(avatarDiv);
            
            const textContainer = document.createElement('span');
            errorMessageDiv.appendChild(textContainer);
            
            if (error.message.includes('trop long') || error.message.includes('non autorisé') || error.message.includes('invalide')) {
                textContainer.textContent = error.message;
            } else if (error.name === 'AbortError') {
                textContainer.textContent = "La requête a pris trop de temps. Veuillez réessayer.";
            } else {
                textContainer.textContent = "Désolé, une erreur est survenue. Veuillez réessayer.";
            }
            
            messagesContainer.appendChild(errorMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Gestionnaire pour les messages pré-rédigés
    const predefinedMessageButtons = chatContainer.querySelectorAll('.predefined-message-button');
    predefinedMessageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const message = button.textContent;
            
            // Vérifier le rate limiting pour les messages pré-rédigés aussi
            if (!rateLimiter.canMakeRequest()) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'chat-message bot';
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'bot-avatar';
                errorDiv.appendChild(avatarDiv);
                const textContainer = document.createElement('span');
                textContainer.textContent = 'Trop de messages. Attendez 1 minute.';
                errorDiv.appendChild(textContainer);
                messagesContainer.appendChild(errorDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                return;
            }
            
            // 1. Masquer immédiatement les messages pré-remplis
            hidePredefinedMessages();
            
            // 2. Afficher immédiatement le message utilisateur
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = message;
            messagesContainer.appendChild(userMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // 3. Afficher immédiatement l'indicateur "typing" avec le message de temps de réponse
            const typingContainer = createTypingIndicatorWithMessage();
            messagesContainer.appendChild(typingContainer);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // 4. Envoyer la requête en arrière-plan
            sendMessageBackground(message, typingContainer);
        });
    });

    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });

    // Fonction pour fermer le chatbot
    function closeChatbot() {
        // Marquer que le chatbot a été fermé par l'utilisateur
        localStorage.setItem('chatbot_closed', 'true');
        chatHasBeenClosed = true; // Mettre à jour la variable aussi
        
        chatContainer.classList.add('closing');
        toggleButton.classList.add('hidden');
        
        setTimeout(() => {
            chatContainer.classList.remove('open', 'closing');
            chatContainer.style.display = 'none';
            toggleButton.classList.remove('hidden');
            
            // Afficher le popup après fermeture
            handlePopupDisplay();
        }, 300);
    }
    
    toggleButton.addEventListener('click', () => {
        if (chatContainer.classList.contains('open')) {
            // Fermeture
            closeChatbot();
        } else {
            // Ouverture manuelle - réinitialiser le flag de fermeture
            localStorage.removeItem('chatbot_closed');
            chatHasBeenClosed = false; // Mettre à jour la variable aussi
            
            chatContainer.style.display = 'flex';
            toggleButton.classList.add('hidden');
            
            // Force reflow pour que l'animation fonctionne
            void chatContainer.offsetWidth;
            
            chatContainer.classList.add('open');
            chatHasBeenOpened = true;
            localStorage.setItem('chatbot_opened', 'true');
            
            // Masquer le popup lors de l'ouverture
            chatPopup.classList.remove('show');
            
            // Ajouter le message de bienvenue si la zone de messages est vide
            setTimeout(() => {
                if (messagesContainer.children.length === 0) {
                    addWelcomeMessage();
                }
                toggleButton.classList.remove('hidden');
            }, 300); // Délai pour que l'animation d'ouverture soit terminée
        }
    });

    const closeButton = chatContainer.querySelector('.close-button');
    const brandHeader = chatContainer.querySelector('.brand-header');
    
    // Event listener pour le bouton de fermeture
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêcher la propagation vers l'en-tête
        closeChatbot();
    });
    
    // Event listener pour l'en-tête complet
    brandHeader.addEventListener('click', () => {
        closeChatbot();
    });

    // Fonction pour gérer l'affichage du popup
    function handlePopupDisplay() {
        if (!chatContainer.classList.contains('open')) {
            // Afficher le popup avec un petit délai après fermeture
            setTimeout(() => {
                if (!chatContainer.classList.contains('open')) {
                    chatPopup.classList.add('show');
                }
            }, 1000); // 1 seconde après fermeture
        } else {
            // Masquer le popup si le chat est ouvert
            chatPopup.classList.remove('show');
        }
    }

    // Afficher le popup initial après un délai, même si le chatbot a été fermé avant
    setTimeout(() => {
        // Si le chatbot n'est pas ouvert (soit jamais ouvert, soit fermé), afficher le popup
        if (!chatContainer.classList.contains('open')) {
            handlePopupDisplay();
        }
    }, 2000);

    // Masquer le popup si on clique dessus ou sur le bouton
    chatPopup.addEventListener('click', () => {
        toggleButton.click();
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        currentSessionId = '';
        if (sessionTimeout) {
            clearTimeout(sessionTimeout);
        }
    });

})();