(function() {

    // ============================================
    // 🎨 CONFIGURATION DU CHATBOT
    // ============================================
    
    // --- COULEURS ET STYLE ---
    const CHATBOT_COLORS = {
        primaryColor: '#6b837b',      // Couleur principale (orange)
        secondaryColor: '#B19CD9',    // Couleur secondaire (jaune)
        backgroundColor: '#ffffff',   // Fond du chatbot
        fontColor: '#1B1919',        // Couleur du texte
        position: 'right'            // Position: 'left' ou 'right'
    };
    
    // --- AVATAR DU CHATBOT ---
    const CHATBOT_AVATAR = 'https://comettecosmetics.com/wp-content/uploads/2025/08/Photo-chatbot.webp';
    
    // --- OUVERTURE AUTOMATIQUE ---
    // Mettre à false pour désactiver l'ouverture automatique du chat au chargement de la page
    const AUTO_OPEN_CHAT = false;
    
    // Debug: Vérifier la valeur
    console.log('AUTO_OPEN_CHAT constant:', AUTO_OPEN_CHAT);
    
    // --- QUESTIONS FRÉQUENTES ---
    const PREDEFINED_MESSAGES = [
        "Quels produits conviennent à ma peau sensible ?",
        "Comment choisir ma routine de soin naturelle ?",
        "Vos produits sont-ils vraiment 100% biologiques ?",
        "Avez-vous des coffrets cadeaux disponibles ?"
    ];
    
    // --- CONFIGURATION WEBHOOK ---
    const WEBHOOK_CONFIG = {
        url: window.CHATBOT_WEBHOOK_URL || 'https://n8n.srv749948.hstgr.cloud/webhook/88707b4f-c9ba-4bd5-b1ae-4eecb628fa9d/chat',
        route: 'general'
    };
    

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
            --chat--color-primary: var(--n8n-chat-primary-color, ${CHATBOT_COLORS.primaryColor});
            --chat--color-secondary: var(--n8n-chat-secondary-color, ${CHATBOT_COLORS.secondaryColor});
            --chat--color-background: var(--n8n-chat-background-color, ${CHATBOT_COLORS.backgroundColor});
            --chat--color-font: var(--n8n-chat-font-color, ${CHATBOT_COLORS.fontColor});
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 2vh;
            right: 2vw;
            z-index: 1000;
            display: none;
            width: min(380px, 90vw);
            height: min(600px, 85vh);
            max-width: 380px;
            max-height: 600px;
            min-width: 280px;
            min-height: 400px;
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
            left: 2vw;
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
            padding: 8px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            border-bottom: 1px solid rgba(255, 128, 0, 0.1);
            position: relative;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            cursor: pointer;
            user-select: none;
            min-height: 44px; /* Hauteur minimale contrôlée */
            max-height: 50px; /* Hauteur maximale pour éviter l'expansion */
        }

        .n8n-chat-widget .close-button {
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            padding: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 18px;
            opacity: 0.8;
            font-weight: bold;
            flex-shrink: 0; /* Empêche le rétrécissement */
        }

        .n8n-chat-widget .clear-history-button {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: #ffffff;
            cursor: pointer;
            padding: 3px 6px; /* Padding réduit */
            font-size: 10px; /* Taille de police réduite */
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
            border-radius: 3px; /* Border-radius réduit */
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.3px; /* Letter-spacing réduit */
            line-height: 1; /* Line-height fixe */
            height: 20px; /* Hauteur fixe */
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0; /* Empêche le rétrécissement */
            white-space: nowrap; /* Empêche le retour à la ligne */
        }

        .n8n-chat-widget .clear-history-button:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-1px);
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
            bottom: 2vh;
            right: 2vw;
            width: clamp(50px, 8vw, 60px);
            height: clamp(50px, 8vw, 60px);
            border-radius: 50%;
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
            left: 2vw;
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
            background-image: url('${CHATBOT_AVATAR}');
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
            margin: 0;
            padding: 16px 20px;
            background: #f8f9fa;
            border-radius: 0;
            border-bottom: 1px solid rgba(255, 128, 0, 0.1);
        }

        .n8n-chat-widget .initial-message h3 {
            margin: 0 0 6px 0;
            color: var(--chat--color-font);
            font-family: 'Anton SC', sans-serif;
            font-size: 16px;
            text-align: center;
        }

        .n8n-chat-widget .initial-message p {
            margin: 0;
            color: var(--chat--color-font);
            opacity: 0.8;
            font-size: 13px;
            line-height: 1.4;
            text-align: center;
        }

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


        @keyframes popupBounce {
            0%, 100% { transform: scale(1) translateX(0); }
            50% { transform: scale(1.05) translateX(0); }
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

        /* Media queries pour mobile */
        @media (max-width: 768px) {
            .n8n-chat-widget .chat-container {
                bottom: 1vh;
                right: 1vw;
                width: 96vw;
                height: 80vh;
                max-width: none;
                min-width: 280px;
            }
            
            .n8n-chat-widget .chat-container.position-left {
                left: 1vw;
            }
            
            .n8n-chat-widget .chat-toggle {
                bottom: 1vh;
                right: 1vw;
                width: 50px;
                height: 50px;
            }
            
            .n8n-chat-widget .chat-toggle.position-left {
                left: 1vw;
            }
        }

        /* Media queries pour très petits écrans */
        @media (max-width: 480px) {
            .n8n-chat-widget .chat-container {
                bottom: 0;
                right: 0;
                left: 0;
                width: 100vw;
                height: 90vh;
                border-radius: 12px 12px 0 0;
                max-height: none;
            }
            
            .n8n-chat-widget .chat-container.position-left {
                left: 0;
            }
        }

        /* Media queries pour grands écrans */
        @media (min-width: 1200px) {
            .n8n-chat-widget .chat-container {
                bottom: 3vh;
                right: 3vw;
            }
            
            .n8n-chat-widget .chat-container.position-left {
                left: 3vw;
            }
            
            .n8n-chat-widget .chat-toggle {
                bottom: 3vh;
                right: 3vw;
            }
            
            .n8n-chat-widget .chat-toggle.position-left {
                left: 3vw;
            }
            
        }
`;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: WEBHOOK_CONFIG,
        branding: {
            welcomeText: 'Besoin d\'aide ?',
        },
        style: CHATBOT_COLORS,
        security: {
            maxMessageLength: 2000,
            requestTimeout: 60000,
            maxSessionDuration: 3600000
        },
        // Nouvelles options pour l'historique
        history: {
            enabled: true,
            maxMessages: 100, // Limite du nombre de messages stockés
            persistDuration: 7 * 24 * 60 * 60 * 1000 // 7 jours en millisecondes
        },
        // Nouvelle option pour l'ouverture automatique
        behavior: {
            autoOpen: AUTO_OPEN_CHAT // Utilise la variable de configuration
        }
    };

    // Messages pré-rédigés
    const predefinedMessages = PREDEFINED_MESSAGES;

    // Merge user config with defaults
    const config = window.GrowthAIChatConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.GrowthAIChatConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.GrowthAIChatConfig.branding },
            style: { ...defaultConfig.style, ...window.GrowthAIChatConfig.style },
            security: { ...defaultConfig.security, ...window.GrowthAIChatConfig.security },
            history: { ...defaultConfig.history, ...window.GrowthAIChatConfig.history },
            behavior: { ...defaultConfig.behavior, ...window.GrowthAIChatConfig.behavior }
        } : defaultConfig;

    // Debug logs
    console.log('Final config.behavior.autoOpen:', config.behavior.autoOpen);
    console.log('External config exists:', !!window.GrowthAIChatConfig);
    if (window.GrowthAIChatConfig && window.GrowthAIChatConfig.behavior) {
        console.log('External behavior config:', window.GrowthAIChatConfig.behavior);
    }

    let currentSessionId = '';
    let sessionTimeout = null;

    // Clé pour le localStorage
    const STORAGE_KEY = 'chatbot_history';
    const SESSION_KEY = 'chatbot_session';

    // Variables pour mémoriser l'état du chatbot
    let chatHasBeenClosed = localStorage.getItem('chatbot_closed') === 'true';
    let chatHasBeenOpened = localStorage.getItem('chatbot_opened') === 'true';

    // === GESTION DE L'HISTORIQUE ===
    
    // Classe pour gérer l'historique des messages
    class ChatHistory {
        constructor() {
            this.storageKey = STORAGE_KEY;
            this.sessionKey = SESSION_KEY;
            this.maxMessages = config.history.maxMessages;
            this.persistDuration = config.history.persistDuration;
        }

        // Sauvegarder un message dans l'historique
        saveMessage(message) {
            if (!config.history.enabled) return;

            const history = this.getHistory();
            const messageData = {
                ...message,
                timestamp: Date.now(),
                id: this.generateMessageId()
            };

            history.messages.push(messageData);

            // Limiter le nombre de messages
            if (history.messages.length > this.maxMessages) {
                history.messages = history.messages.slice(-this.maxMessages);
            }

            // Mettre à jour le timestamp de dernière activité
            history.lastActivity = Date.now();
            
            // Marquer qu'il y a eu une vraie conversation si ce n'est pas juste le message de bienvenue
            if (message.type === 'user' || (message.type === 'bot' && !message.isWelcome)) {
                history.hasRealConversation = true;
            }

            this.setHistory(history);
        }

        // Récupérer l'historique
        getHistory() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                if (!stored) {
                    return this.createEmptyHistory();
                }

                const history = JSON.parse(stored);
                
                // Vérifier si l'historique n'est pas expiré
                if (this.isHistoryExpired(history)) {
                    this.clearHistory();
                    return this.createEmptyHistory();
                }

                return history;
            } catch (error) {
                console.error('Erreur lors de la lecture de l\'historique:', error);
                return this.createEmptyHistory();
            }
        }

        // Sauvegarder l'historique
        setHistory(history) {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(history));
            } catch (error) {
                console.error('Erreur lors de la sauvegarde de l\'historique:', error);
                // Si le localStorage est plein, supprimer les anciens messages
                if (error.name === 'QuotaExceededError') {
                    history.messages = history.messages.slice(-Math.floor(this.maxMessages / 2));
                    try {
                        localStorage.setItem(this.storageKey, JSON.stringify(history));
                    } catch (retryError) {
                        console.error('Impossible de sauvegarder l\'historique même après nettoyage:', retryError);
                    }
                }
            }
        }

        // Créer un historique vide
        createEmptyHistory() {
            return {
                messages: [],
                sessionId: this.getOrCreateSessionId(),
                lastActivity: Date.now(),
                hasRealConversation: false, // Nouveau flag pour détecter une vraie conversation
                version: '1.0'
            };
        }

        // Vérifier si l'historique est expiré
        isHistoryExpired(history) {
            if (!history.lastActivity) return true;
            return (Date.now() - history.lastActivity) > this.persistDuration;
        }

        // Nettoyer l'historique
        clearHistory() {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.sessionKey);
        }

        // Générer un ID unique pour un message
        generateMessageId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        // Obtenir ou créer un ID de session persistant
        getOrCreateSessionId() {
            let sessionId = localStorage.getItem(this.sessionKey);
            if (!sessionId) {
                sessionId = this.generateUUID();
                localStorage.setItem(this.sessionKey, sessionId);
            }
            return sessionId;
        }

        // Générer un UUID
        generateUUID() {
            if (crypto && crypto.randomUUID) {
                return crypto.randomUUID();
            }
            // Fallback pour les navigateurs plus anciens
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // Restaurer les messages dans l'interface
        restoreMessages(messagesContainer) {
            if (!config.history.enabled) return false;

            const history = this.getHistory();
            if (!history.messages || history.messages.length === 0) {
                return false;
            }

            // Si il n'y a pas eu de vraie conversation, ne pas restaurer (juste le message de bienvenue)
            if (!history.hasRealConversation) {
                return false;
            }

            // Nettoyer le conteneur de messages
            messagesContainer.innerHTML = '';

            // Restaurer chaque message
            history.messages.forEach(messageData => {
                this.createMessageElement(messageData, messagesContainer);
            });

            // Faire défiler vers le bas
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            return true;
        }

        // Créer un élément de message à partir des données
        createMessageElement(messageData, messagesContainer) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${messageData.type}`;

            if (messageData.type === 'bot') {
                // Ajouter l'avatar pour les messages du bot
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'bot-avatar';
                messageDiv.appendChild(avatarDiv);
            }

            const textContainer = document.createElement('span');
            
            // Traiter le contenu selon le type
            if (messageData.isHtml) {
                textContainer.innerHTML = messageData.content;
            } else {
                textContainer.textContent = messageData.content;
            }

            messageDiv.appendChild(textContainer);
            messagesContainer.appendChild(messageDiv);
        }
    }

    // Initialiser le gestionnaire d'historique
    const chatHistory = new ChatHistory();

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
            this.maxRequests = 5;
            this.timeWindow = 60000;
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
        text = sanitizeHtml(text);
        text = text.replace(/\\n/g, '\n');
        
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
            if (isValidUrl(url)) {
                let cleanLinkText = linkText
                    .replace(/&lt;strong&gt;/g, '<strong>')
                    .replace(/&lt;\/strong&gt;/g, '</strong>')
                    .replace(/&lt;em&gt;/g, '<em>')
                    .replace(/&lt;\/em&gt;/g, '</em>');
                
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${cleanLinkText}</a>`;
            }
            return linkText;
        });
        
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\n/g, '<br>');
        return text;
    }

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
                <button class="clear-history-button" title="Effacer l'historique">Effacer</button>
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
    
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const predefinedMessagesContainer = chatContainer.querySelector('.predefined-messages');
    const clearHistoryButton = chatContainer.querySelector('.clear-history-button');

    // Récupérer l'ID de session persistant
    currentSessionId = chatHistory.getOrCreateSessionId();

    // Gestionnaire pour effacer l'historique
    clearHistoryButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique des messages ?')) {
            chatHistory.clearHistory();
            messagesContainer.innerHTML = '';
            // Réinitialiser l'ID de session
            currentSessionId = chatHistory.getOrCreateSessionId();
            // Réafficher les messages pré-rédigés
            showPredefinedMessages();
            // Ajouter le message de bienvenue
            setTimeout(() => addWelcomeMessage(), 300);
        }
    });

    // Auto-open chatbot seulement si la configuration l'autorise explicitement
    if (config.behavior.autoOpen === true && !chatHasBeenOpened && !chatHasBeenClosed) {
        console.log('Auto-opening chatbot - config.behavior.autoOpen:', config.behavior.autoOpen);
        setTimeout(() => {
            chatContainer.style.display = 'flex';
            void chatContainer.offsetWidth;
            chatContainer.classList.add('open');
            chatHasBeenOpened = true;
            localStorage.setItem('chatbot_opened', 'true');
            
            setTimeout(() => {
                // Essayer de restaurer l'historique d'abord
                const hasHistory = chatHistory.restoreMessages(messagesContainer);
                if (hasHistory) {
                    // Si il y a un historique, masquer les messages pré-rédigés
                    hidePredefinedMessages();
                } else {
                    // Sinon, ajouter le message de bienvenue
                    addWelcomeMessage();
                }
            }, 800);
        }, 500);
    } else {
        console.log('Chatbot auto-open disabled - config.behavior.autoOpen:', config.behavior.autoOpen, 'chatHasBeenOpened:', chatHasBeenOpened, 'chatHasBeenClosed:', chatHasBeenClosed);
    }

    function generateUUID() {
        return chatHistory.generateUUID();
    }

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
        
        const welcomeText = `<strong>${config.branding.welcomeText}</strong><br>Je suis là pour répondre à vos questions !`;
        
        // Sauvegarder le message de bienvenue dans l'historique
        chatHistory.saveMessage({
            type: 'bot',
            content: welcomeText,
            isHtml: true,
            isWelcome: true // Marquer comme message de bienvenue
        });
        
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

    function resetSessionTimeout() {
        if (sessionTimeout) {
            clearTimeout(sessionTimeout);
        }
        sessionTimeout = setTimeout(() => {
            console.log('Session expirée');
        }, config.security.maxSessionDuration);
    }

    async function initializeSession() {
        if (!currentSessionId) {
            currentSessionId = chatHistory.getOrCreateSessionId();
        }
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
    }

    function hidePredefinedMessages() {
        if (predefinedMessagesContainer && !predefinedMessagesContainer.classList.contains('hide')) {
            predefinedMessagesContainer.style.display = 'none';
        }
    }

    function showPredefinedMessages() {
        if (predefinedMessagesContainer) {
            predefinedMessagesContainer.style.display = 'block';
            predefinedMessagesContainer.classList.remove('hide');
        }
    }

    function typeWriter(element, htmlText, speed = 30) {
        let index = 0;
        const parentDiv = element.parentElement;
        parentDiv.classList.add('typing');
        element.innerHTML = '';
        
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
            const validatedMessage = validateMessage(message);
            await initializeSession();

            // Masquer les questions prédéfinies dès qu'un message est envoyé
            hidePredefinedMessages();

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
            
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = validatedMessage;
            messagesContainer.appendChild(userMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Sauvegarder le message utilisateur dans l'historique
            chatHistory.saveMessage({
                type: 'user',
                content: validatedMessage,
                isHtml: false
            });

            const typingContainer = createTypingIndicatorWithMessage();
            messagesContainer.appendChild(typingContainer);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

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
            
            if (messagesContainer.contains(typingContainer)) {
                messagesContainer.removeChild(typingContainer);
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
                
                let processedText = messageText;
                let isHtml = false;
                
                if (messageText.trim().startsWith('<html>') && messageText.trim().endsWith('</html>')) {
                    processedText = messageText.replace(/<html>|<\/html>/g, '').trim();
                    isHtml = true;
                } else {
                    processedText = convertMarkdownToHtml(messageText);
                    isHtml = true;
                }

                // Sauvegarder la réponse du bot dans l'historique
                chatHistory.saveMessage({
                    type: 'bot',
                    content: processedText,
                    isHtml: isHtml
                });
                
                typeWriter(textContainer, processedText, 20);
            } else {
                throw new Error('Réponse invalide du serveur');
            }
            
        } catch (error) {
            console.error('Erreur dans sendMessage:', error);
            
            const existingTypingContainer = messagesContainer.querySelector('.typing-container');
            if (existingTypingContainer) {
                messagesContainer.removeChild(existingTypingContainer);
            }
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'chat-message bot';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'bot-avatar';
            errorDiv.appendChild(avatarDiv);
            
            const textContainer = document.createElement('span');
            errorDiv.appendChild(textContainer);
            
            let errorMessage;
            if (error.message.includes('trop long') || error.message.includes('non autorisé') || error.message.includes('invalide')) {
                errorMessage = error.message;
            } else if (error.name === 'AbortError') {
                errorMessage = "La requête a pris trop de temps. Veuillez réessayer.";
            } else {
                errorMessage = "Désolé, une erreur est survenue. Veuillez réessayer.";
            }

            textContainer.textContent = errorMessage;
            messagesContainer.appendChild(errorDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Sauvegarder le message d'erreur dans l'historique
            chatHistory.saveMessage({
                type: 'bot',
                content: errorMessage,
                isHtml: false
            });
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

            // Sauvegarder le message utilisateur dans l'historique
            chatHistory.saveMessage({
                type: 'user',
                content: validatedMessage,
                isHtml: false
            });

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
                
                let processedText = messageText;
                let isHtml = false;
                
                if (messageText.trim().startsWith('<html>') && messageText.trim().endsWith('</html>')) {
                    processedText = messageText.replace(/<html>|<\/html>/g, '').trim();
                    isHtml = true;
                } else {
                    processedText = convertMarkdownToHtml(messageText);
                    isHtml = true;
                }

                // Sauvegarder la réponse du bot dans l'historique
                chatHistory.saveMessage({
                    type: 'bot',
                    content: processedText,
                    isHtml: isHtml
                });
                
                typeWriter(textContainer, processedText, 20);
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
            
            let errorMessage;
            if (error.message.includes('trop long') || error.message.includes('non autorisé') || error.message.includes('invalide')) {
                errorMessage = error.message;
            } else if (error.name === 'AbortError') {
                errorMessage = "La requête a pris trop de temps. Veuillez réessayer.";
            } else {
                errorMessage = "Désolé, une erreur est survenue. Veuillez réessayer.";
            }

            textContainer.textContent = errorMessage;
            messagesContainer.appendChild(errorMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Sauvegarder le message d'erreur dans l'historique
            chatHistory.saveMessage({
                type: 'bot',
                content: errorMessage,
                isHtml: false
            });
        }
    }

    const predefinedMessageButtons = chatContainer.querySelectorAll('.predefined-message-button');
    predefinedMessageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const message = button.textContent;
            
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
            
            hidePredefinedMessages();
            
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = message;
            messagesContainer.appendChild(userMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            const typingContainer = createTypingIndicatorWithMessage();
            messagesContainer.appendChild(typingContainer);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
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

    function closeChatbot() {
        localStorage.setItem('chatbot_closed', 'true');
        chatHasBeenClosed = true;
        
        chatContainer.classList.add('closing');
        toggleButton.classList.add('hidden');
        
        setTimeout(() => {
            chatContainer.classList.remove('open', 'closing');
            chatContainer.style.display = 'none';
            toggleButton.classList.remove('hidden');
        }, 300);
    }
    
    toggleButton.addEventListener('click', () => {
        if (chatContainer.classList.contains('open')) {
            closeChatbot();
        } else {
            localStorage.removeItem('chatbot_closed');
            chatHasBeenClosed = false;
            
            chatContainer.style.display = 'flex';
            toggleButton.classList.add('hidden');
            void chatContainer.offsetWidth;
            chatContainer.classList.add('open');
            chatHasBeenOpened = true;
            localStorage.setItem('chatbot_opened', 'true');
            
            setTimeout(() => {
                // Essayer de restaurer l'historique
                const hasHistory = chatHistory.restoreMessages(messagesContainer);
                if (hasHistory) {
                    hidePredefinedMessages();
                } else if (messagesContainer.children.length === 0) {
                    addWelcomeMessage();
                }
                toggleButton.classList.remove('hidden');
            }, 300);
        }
    });

    const closeButton = chatContainer.querySelector('.close-button');
    const brandHeader = chatContainer.querySelector('.brand-header');
    
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        closeChatbot();
    });
    
    brandHeader.addEventListener('click', (e) => {
        // Ne pas fermer si on clique sur les boutons
        if (e.target === clearHistoryButton || clearHistoryButton.contains(e.target) ||
            e.target === closeButton || closeButton.contains(e.target)) {
            return;
        }
        closeChatbot();
    });

    window.addEventListener('beforeunload', () => {
        if (sessionTimeout) {
            clearTimeout(sessionTimeout);
        }
    });

})();