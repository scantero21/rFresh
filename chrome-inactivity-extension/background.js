// Variables globales
let inactivityTimer = null;
let isMonitoring = false;

// Escuchar mensajes del popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startMonitoring') {
    startMonitoring(request.minutes);
  } else if (request.action === 'stopMonitoring') {
    stopMonitoring();
  }
});

// Iniciar el monitoreo de inactividad
async function startMonitoring(minutes) {
  if (isMonitoring) {
    return;
  }
  
  isMonitoring = true;
  
  // Configurar la alarma para verificar la inactividad
  const alarmName = 'inactivityCheck';
  await chrome.alarms.create(alarmName, { periodInMinutes: 1 });
  
  // Guardar el tiempo de inactividad en storage
  await chrome.storage.local.set({ 
    lastActivity: Date.now(),
    inactivityThreshold: minutes * 60 * 1000 // convertir a milisegundos
  });
  
  console.log(`Monitoreo de inactividad iniciado: ${minutes} minutos`);
}

// Detener el monitoreo
async function stopMonitoring() {
  isMonitoring = false;
  
  // Cancelar la alarma
  await chrome.alarms.clear('inactivityCheck');
  
  console.log('Monitoreo de inactividad detenido');
}

// Escuchar la alarma periódica
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'inactivityCheck' && isMonitoring) {
    await checkInactivity();
  }
});

// Verificar si ha pasado el tiempo de inactividad
async function checkInactivity() {
  const storage = await chrome.storage.local.get(['lastActivity', 'inactivityThreshold']);
  const storageConfig = await chrome.storage.sync.get(['url']);
  
  const lastActivity = storage.lastActivity || Date.now();
  const threshold = storage.inactivityThreshold || 5 * 60 * 1000; // 5 minutos por defecto
  const url = storageConfig.url;
  
  const now = Date.now();
  const inactiveTime = now - lastActivity;
  
  if (inactiveTime >= threshold && url) {
    // Ha pasado el tiempo de inactividad, cargar la URL
    console.log(`Inactividad detectada (${Math.round(inactiveTime / 60000)} min). Cargando URL: ${url}`);
    
    // Crear o actualizar una pestaña con la URL
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tabs.length > 0) {
      await chrome.tabs.update(tabs[0].id, { url: url });
    } else {
      await chrome.tabs.create({ url: url });
    }
    
    // Resetear el timer de inactividad después de cargar la URL
    await chrome.storage.local.set({ lastActivity: Date.now() });
  }
}

// Detectar actividad del usuario
async function detectActivity() {
  if (!isMonitoring) {
    return;
  }
  
  // Actualizar el último tiempo de actividad
  await chrome.storage.local.set({ lastActivity: Date.now() });
}

// Escuchar eventos de actividad del usuario
chrome.tabs.onActivated.addListener(detectActivity);
chrome.tabs.onUpdated.addListener(detectActivity);
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    detectActivity();
  }
});

// También escuchar movimientos del mouse y teclas presionadas (requiere permissions adicionales en manifest)
// Nota: Para un monitoreo más preciso, se necesitaría inyectar scripts en las páginas

// Inicializar al iniciar el navegador
chrome.runtime.onStartup.addListener(async () => {
  const result = await chrome.storage.sync.get(['autoStart', 'minutes']);
  
  if (result.autoStart && result.minutes) {
    startMonitoring(result.minutes);
    console.log('Extensión iniciada automáticamente');
  }
});

// También verificar al instalar la extensión
chrome.runtime.onInstalled.addListener(async (details) => {
  const result = await chrome.storage.sync.get(['autoStart', 'minutes']);
  
  if (result.autoStart && result.minutes) {
    startMonitoring(result.minutes);
    console.log('Extensión iniciada automáticamente después de la instalación');
  }
});
