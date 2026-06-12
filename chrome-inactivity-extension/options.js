document.addEventListener('DOMContentLoaded', async () => {
  const urlInput = document.getElementById('url');
  const minutesInput = document.getElementById('minutes');
  const autoStartCheckbox = document.getElementById('autoStart');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  const statusDiv = document.getElementById('status');

  // Cargar configuración guardada
  const result = await chrome.storage.sync.get(['url', 'minutes', 'autoStart']);
  
  if (result.url) {
    urlInput.value = result.url;
  }
  if (result.minutes) {
    minutesInput.value = result.minutes;
  }
  if (result.autoStart !== undefined) {
    autoStartCheckbox.checked = result.autoStart;
  }

  // Guardar configuración
  saveBtn.addEventListener('click', async () => {
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

    await chrome.storage.sync.set({
      url: url,
      minutes: minutes,
      autoStart: autoStart
    });

    showStatus('Configuración guardada exitosamente.', 'success');
  });

  // Resetear configuración
  resetBtn.addEventListener('click', async () => {
    await chrome.storage.sync.clear();
    
    urlInput.value = '';
    minutesInput.value = '5';
    autoStartCheckbox.checked = false;
    
    showStatus('Configuración reseteada a los valores predeterminados.', 'info');
  });

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
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      statusDiv.classList.add('hidden');
    }, 3000);
  }
});
