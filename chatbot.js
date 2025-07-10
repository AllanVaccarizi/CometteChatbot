// =======================================================
// CONFIGURATION CLIENT - À MODIFIER POUR CHAQUE CLIENT
// =======================================================

const CLIENT_CONFIG = {
    // 🎨 COULEURS
    colors: {
        primaryColor: '#6b837b',        // Couleur principale (boutons, en-tête, liens)
        secondaryColor: '#B19CD9',      // Couleur secondaire (dégradés)
        backgroundColor: '#ffffff',     // Fond du chatbot
        fontColor: '#1B1919',          // Couleur du texte
        popupColor: '#DC2626'          // Couleur du popup "Une question ?"
    },

    // 📝 MESSAGES ET TEXTES
    messages: {
        welcomeTitle: 'Besoin d\'aide ?',
        welcomeMessage: 'Je suis là pour vous répondre à vos questions !',
        popupText: 'Une question ?',
        inputPlaceholder: 'Posez votre question...',
        sendButtonText: 'Envoyer',
        predefinedTitle: 'Questions fréquentes',
        typingMessage: 'Temps moyen de réponse ~30 secondes'
    },

    // ❓ QUESTIONS FRÉQUENTES
    predefinedMessages: [
        "Quels produits conviennent à ma peau sensible ?",
        "Comment choisir ma routine de soin naturelle ?",
        "Vos produits sont-ils vraiment 100% biologiques ?",
        "Avez-vous des coffrets cadeaux disponibles ?"
    ],

    // 🖼️ IMAGES ET AVATARS
    images: {
        botAvatar: 'https://comettecosmetics.com/wp-content/uploads/2024/11/Rectangle-5-2-1-768x797.png',
        // Alternative : avatarEmoji: '🤖' (si vous préférez un emoji)
    },

    // 🎭 STYLE ET APPARENCE
    style: {
        fontFamily: 'Montserrat',                    // Police principale
        fontUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap',
        position: 'right',                           // 'right' ou 'left'
        chatWidth: '380px',                         // Largeur du chatbot
        chatHeight: '600px',                        // Hauteur du chatbot
        borderRadius: '12px',                       // Arrondi des coins
        showPopupOnMobile: false                    // Afficher le popup sur mobile
    },

    // 🔗 LIENS ET BRANDING
    branding: {
        poweredByText: 'Propulsé par',
        poweredByName: 'Growth-AI',
        poweredByUrl: 'https://agence-n8n.com',
        showPoweredBy: true                         // Afficher ou masquer le footer
    },

    // ⚙️ TECHNIQUE (webhook)
    technical: {
        webhookUrl: 'https://n8n.srv749948.hstgr.cloud/webhook/88707b4f-c9ba-4bd5-b1ae-4eecb628fa9d/chat',
        route: 'general',
        maxMessageLength: 2000,
        requestTimeout: 60000,
        autoOpen: false,                            // Ouverture automatique à la première visite
        autoOpenDelay: 500                          // Délai avant ouverture auto (ms)
    }
};

// =======================================================
// CODE PRINCIPAL - NE PAS MODIFIER SAUF PERSONNALISATION AVANCÉE
// =======================================================

(function() {
    // Prevent multiple initializations
    if (window.GrowthAIChatWidgetInitialized) return;
    window.GrowthAIChatWidgetInitialized = true;

    // Load Google Fonts avec la police configurée
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = CLIENT_CONFIG.style.fontUrl;
    document.head.appendChild(fontLink);

    // Générer les styles CSS dynamiquement
    const generateStyles = () => `
        .n8n-chat-widget {
            --chat--color-primary: ${CLIENT_CONFIG.colors.primaryColor};
            --chat--color-secondary: ${CLIENT_CONFIG.colors.secondaryColor};
            --chat--color-background: ${CLIENT_CONFIG.colors.backgroundColor};
            --chat--color-font: ${CLIENT_CONFIG.colors.fontColor};
            font-family: '${CLIENT_CONFIG.style.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            ${CLIENT_CONFIG.style.position}: 20px;
            z-index: 1000;
            display: none;
            width: ${CLIENT_CONFIG.style.chatWidth};
            height: ${CLIENT_CONFIG.style.chatHeight};
            background: var(--chat--color-background);
            border-radius: ${CLIENT_CONFIG.style.borderRadius};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(0, 0, 0, 0.1);
            overflow: hidden;
            font-family: inherit;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            position: relative;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            cursor: pointer;
            user-select: none;
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
            font-family: '${CLIENT_CONFIG.style.fontFamily}', sans-serif;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: #ffffff;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border: none;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-message.bot {
            background: #f8f9fa;
            border: 1px solid rgba(0, 0, 0, 0.1);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            position: relative;
            margin-top: 35px;
            margin-left: 18px;
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
            background-image: url('${CLIENT_CONFIG.images.botAvatar}');
            border: 2px solid var(--chat--color-primary);
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: '${CLIENT_CONFIG.style.fontFamily}', sans-serif;
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
            font-family: '${CLIENT_CONFIG.style.fontFamily}', sans-serif;
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
            ${CLIENT_CONFIG.style.position}: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: #ffffff;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle.hidden {
            transform: scale(0);
            opacity: 0;
        }

        .n8n-chat-widget .chat-popup {
            position: fixed;
            bottom: 90px;
            ${CLIENT_CONFIG.style.position}: 20px;
            background: ${CLIENT_CONFIG.colors.popupColor};
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            font-family: '${CLIENT_CONFIG.style.fontFamily}', sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transform: scale(0) translateX(20px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: none;
            z-index: 998;
            cursor: pointer;
        }

        ${!CLIENT_CONFIG.style.showPopupOnMobile ? `
        @media (max-width: 768px) {
            .n8n-chat-widget .chat-popup {
                display: none !important;
            }
        }` : ''}

        .n8n-chat-widget .chat-popup.show {
            opacity: 1;
            transform: scale(1) translateX(0);
            pointer-events: auto;
        }

        .n8n-chat-widget .predefined-messages {
            padding: 16px;
            background: var(--chat--color-background);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            line-height: 1.4;
            color: var(--chat--color-font);
            font-family: '${CLIENT_CONFIG.style.fontFamily}', sans-serif;
            transition: all 0.2s ease;
        }

        .n8n-chat-widget .predefined-message-button:hover {
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.02) 100%);
            border-color: var(--chat--color-primary);
            transform: translateX(4px);
        }

        ${CLIENT_CONFIG.branding.showPoweredBy ? `
        .n8n-chat-widget .chat-footer {
            padding: 8px 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            text-align: center;
            font-size: 11px;
            color: var(--chat--color-font);
            opacity: 0.7;
            font-family: '${CLIENT_CONFIG.style.fontFamily}', sans-serif;
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
        }` : `
        .n8n-chat-widget .chat-footer {
            display: none;
        }`}

        /* Autres styles nécessaires... */
        .n8n-chat-widget .typing-indicator {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.05);
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
            animation: pulse 1s infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: 0.4; transform: scale(1); }
        }
    `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = generateStyles();
    document.head.appendChild(styleSheet);

    // Configuration par défaut fusionnée avec la config client
    const defaultConfig = {
        webhook: {
            url: window.CHATBOT_WEBHOOK_URL || CLIENT_CONFIG.technical.webhookUrl,
            route: CLIENT_CONFIG.technical.route
        },
        branding: {
            welcomeText: CLIENT_CONFIG.messages.welcomeTitle,
        },
        style: {
            primaryColor: CLIENT_CONFIG.colors.primaryColor,
            secondaryColor: CLIENT_CONFIG.colors.secondaryColor,
            position: CLIENT_CONFIG.style.position,
            backgroundColor: CLIENT_CONFIG.colors.backgroundColor,
            fontColor: CLIENT_CONFIG.colors.fontColor
        },
        security: {
            maxMessageLength: CLIENT_CONFIG.technical.maxMessageLength,
            requestTimeout: CLIENT_CONFIG.technical.requestTimeout,
            maxSessionDuration: 3600000
        }
    };

    // Merge user config with defaults
    const config = window.GrowthAIChatConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.GrowthAIChatConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.GrowthAIChatConfig.branding },
            style: { ...defaultConfig.style, ...window.GrowthAIChatConfig.style },
            security: { ...defaultConfig.security, ...window.GrowthAIChatConfig.security }
        } : defaultConfig;

    // Variables de session
    let currentSessionId = '';
    let sessionTimeout = null;
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

    // Créer le HTML de l'interface
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    
    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="predefined-messages">
                <div class="predefined-messages-title">${CLIENT_CONFIG.messages.predefinedTitle}</div>
                ${CLIENT_CONFIG.predefinedMessages.map(msg => 
                    `<button class="predefined-message-button">${msg}</button>`
                ).join('')}
            </div>
            <div class="chat-input">
                <textarea placeholder="${CLIENT_CONFIG.messages.inputPlaceholder}" rows="1" maxlength="${config.security.maxMessageLength}"></textarea>
                <button type="submit">${CLIENT_CONFIG.messages.sendButtonText}</button>
            </div>
            ${CLIENT_CONFIG.branding.showPoweredBy ? `
            <div class="chat-footer">
                ${CLIENT_CONFIG.branding.poweredByText} <a href="${CLIENT_CONFIG.branding.poweredByUrl}" target="_blank" rel="noopener noreferrer">${CLIENT_CONFIG.branding.poweredByName}</a>
            </div>` : ''}
        </div>
    `;
    
    chatContainer.innerHTML = chatInterfaceHTML;
    
    // Bouton toggle
    const toggleButton = document.createElement('button');
    toggleButton.className = 'chat-toggle';
    toggleButton.innerHTML = `
        <span style="font-size: 24px; color: white; font-weight: bold;">💬</span>
    `;
    
    // Popup "Une question ?"
    const chatPopup = document.createElement('div');
    chatPopup.className = 'chat-popup';
    chatPopup.textContent = CLIENT_CONFIG.messages.popupText;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    widgetContainer.appendChild(chatPopup);
    document.body.appendChild(widgetContainer);

    // Auto-open si configuré et conditions remplies
    if (CLIENT_CONFIG.technical.autoOpen && !chatHasBeenOpened && !chatHasBeenClosed) {
        setTimeout(() => {
            chatContainer.style.display = 'flex';
            void chatContainer.offsetWidth;
            chatContainer.classList.add('open');
            chatHasBeenOpened = true;
            localStorage.setItem('chatbot_opened', 'true');
            
            setTimeout(() => {
                addWelcomeMessage();
            }, 800);
        }, CLIENT_CONFIG.technical.autoOpenDelay);
    }

    // Références aux éléments
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');

    // Fonction pour ajouter le message de bienvenue
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
        
        const welcomeText = `<strong>${CLIENT_CONFIG.messages.welcomeTitle}</strong><br>${CLIENT_CONFIG.messages.welcomeMessage}`;
        typeWriter(textContainer, welcomeText, 30);
    }

    // Fonction typewriter simplifiée
    function typeWriter(element, text, speed = 30) {
        let index = 0;
        element.innerHTML = '';
        
        function type() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Event listeners
    toggleButton.addEventListener('click', () => {
        if (chatContainer.classList.contains('open')) {
            localStorage.setItem('chatbot_closed', 'true');
            chatContainer.classList.remove('open');
            chatContainer.style.display = 'none';
        } else {
            localStorage.removeItem('chatbot_closed');
            chatContainer.style.display = 'flex';
            void chatContainer.offsetWidth;
            chatContainer.classList.add('open');
            
            if (messagesContainer.children.length === 0) {
                setTimeout(() => addWelcomeMessage(), 300);
            }
        }
    });

    const closeButton = chatContainer.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        toggleButton.click();
    });

    // Popup
    chatPopup.addEventListener('click', () => {
        toggleButton.click();
    });

    setTimeout(() => {
        if (!chatContainer.classList.contains('open')) {
            chatPopup.classList.add('show');
        }
    }, 2000);

    console.log('✅ Chatbot initialisé avec la configuration client');
})();