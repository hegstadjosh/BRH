document.addEventListener('DOMContentLoaded', function () {
    // Load existing keys if they exist
    chrome.storage.local.get(['authMethod', 'pinataApiKey', 'pinataSecretApiKey', 'pinataJwt'], function (keys) {
      const authMethodSelect = document.getElementById('authMethod');
      authMethodSelect.value = keys.authMethod || 'apiKey';
  
      toggleAuthMethod(authMethodSelect.value);
  
      if (keys.pinataApiKey) {
        document.getElementById('apiKey').value = keys.pinataApiKey;
      }
      if (keys.pinataSecretApiKey) {
        document.getElementById('apiSecret').value = keys.pinataSecretApiKey;
      }
      if (keys.pinataJwt) {
        document.getElementById('jwtToken').value = keys.pinataJwt;
      }
    });
  
    document.getElementById('authMethod').addEventListener('change', function () {
      const method = this.value;
      toggleAuthMethod(method);
    });
  
    document.getElementById('saveKeys').addEventListener('click', function () {
      const authMethod = document.getElementById('authMethod').value;
      if (authMethod === 'apiKey') {
        const apiKey = document.getElementById('apiKey').value;
        const apiSecret = document.getElementById('apiSecret').value;
  
        chrome.storage.local.set({
          authMethod: 'apiKey',
          pinataApiKey: apiKey,
          pinataSecretApiKey: apiSecret,
          pinataJwt: null // Clear JWT
        }, function () {
          alert('API keys saved.');
        });
      } else if (authMethod === 'jwt') {
        const jwtToken = document.getElementById('jwtToken').value;
  
        chrome.storage.local.set({
          authMethod: 'jwt',
          pinataJwt: jwtToken,
          pinataApiKey: null, // Clear API key and secret
          pinataSecretApiKey: null
        }, function () {
          alert('JWT token saved.');
        });
      }
    });
  });
  
  function toggleAuthMethod(method) {
    const apiKeySection = document.getElementById('apiKeySection');
    const jwtSection = document.getElementById('jwtSection');
  
    if (method === 'apiKey') {
      apiKeySection.style.display = 'block';
      jwtSection.style.display = 'none';
    } else if (method === 'jwt') {
      apiKeySection.style.display = 'none';
      jwtSection.style.display = 'block';
    }
  }
  
  