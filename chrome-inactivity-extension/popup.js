document.addEventListener('DOMContentLoaded', async () => {
  const urlInput = document.getElementById('url');
  const minutesInput = document.getElementById('minutes');
  const autoStartCheckbox = document.getElementById('autoStart');
  const startBtn = document.getElementById('startBtn');
  const statusDiv = document.getElementById('status');

  // Cargar configuración guardada
  const result = await chrome.storage.sync.get(['url', 'minutes', 'autoStart', 'isActive']);
  
  if (result.url) {
    urlInput.value = result.url;
  }
  if (result.minutes) {
    minutesInput.value = result.minutes;
  }
  if (result.autoStart !== undefined) {
    autoStartCheckbox.checked = result.autoStart;
  }

  // Actualizar estado del botón
  updateButtonState(result.isActive);

  // Guardar configuración y actualizar estado
  startBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    const minutes = parseInt(minutesInput.value, 10);
    const autoStart = autoStartCheckbox.checked;

    if (!url) {
      showStatus('Por favor, ingresa una URL válida.', 'error');
      return;
    }

    if (isNaN(minutes) || minutes < 1) {
      showStatus('Por favor, ingresa un tiempo de inactividad válido (mínimo 1 minuto).', 'error');
      return;
    }

    // Guardar configuración
    await chrome.storage.sync.set({
      url: url,
      minutes: minutes,
      autoStart: autoStart
    });

    // Alternar estado activo/inactivo
    const currentState = result.isActive || false;
    const newState = !currentState;
    
    await chrome.storage.sync.set({ isActive: newState });
    
    if (newState) {
      // Iniciar el monitoreo
      chrome.runtime.sendMessage({ action: 'startMonitoring', minutes: minutes });
      updateButtonState(true);
      showStatus(`Extensión activada. La URL se cargará después de ${minutes} minutos de inactividad.`, 'success');
    } else {
      // Detener el monitoreo
      chrome.runtime.sendMessage({ action: 'stopMonitoring' });
      updateButtonState(false);
      showStatus('Extensión desactivada.', 'info');
    }
  });

  function updateButtonState(isActive) {
    if (isActive) {
      startBtn.textContent = 'Stop';
      startBtn.classList.add('stop');
    } else {
      startBtn.textContent = 'Start';
      startBtn.classList.remove('stop');
    }
  }

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.classList.remove('hidden');
    
    // Colores según el tipo
    if (type === 'error') {
      statusDiv.style.backgroundColor = '#ffebee';
      statusDiv.style.borderLeftColor = '#f44336';
    } else if (type === 'success') {
      statusDiv.style.backgroundColor = '#e8f5e9';
      statusDiv.style.borderLeftColor = '#4CAF50';
    } else {
      statusDiv.style.backgroundColor = '#e7f3fe';
      statusDiv.style.borderLeftColor = '#2196F3';
    }
  }
});
