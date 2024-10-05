document.getElementById('saveNote').addEventListener('click', saveNote);
document.getElementById('getPrompt').addEventListener('click', getAIPrompt);
document.getElementById('viewJournals').addEventListener('click', viewJournals);
document.getElementById('openSettings').addEventListener('click', openSettings);

function saveNote() {
  const noteContent = document.getElementById('noteArea').value;
  const category = document.getElementById('categorySelect').value;
  const title = `${category} Note - ${new Date().toLocaleDateString()}`;

  if (!noteContent.trim()) {
    alert('Please enter some content before saving.');
    return;
  }

  uploadJournalToPinata(title, noteContent, category)
    .then((ipfsHash) => {
      alert('Note saved to IPFS with hash:\n' + ipfsHash);
      // Save the IPFS hash and metadata locally for retrieval
      saveHashLocally(ipfsHash, title, category);
    })
    .catch((error) => {
      console.error('Failed to save note to Pinata:', error);
      alert('Failed to save note to Pinata.');
    });
}

function getAIPrompt() {
  fetch('http://localhost:3000/get-prompt')
    .then(response => response.json())
    .then(data => {
      document.getElementById('noteArea').value = data.prompt;
    })
    .catch(error => {
      console.error('Error fetching AI prompt:', error);
      alert('Failed to get AI prompt.');
    });
}

function viewJournals() {
  chrome.windows.create({
    url: 'journals.html',
    type: 'popup',
    width: 400,
    height: 600,
  });
}

function openSettings() {
  chrome.windows.create({
    url: 'settings.html',
    type: 'popup',
    width: 400,
    height: 300,
  });
}

function uploadJournalToPinata(title, content, category) {
  // Retrieve authentication method and credentials from storage
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['authMethod', 'pinataApiKey', 'pinataSecretApiKey', 'pinataJwt'], function (keys) {
      const authMethod = keys.authMethod || 'apiKey';
      const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

      const data = {
        pinataMetadata: {
          name: title,
        },
        pinataContent: {
          title: title,
          content: content,
          category: category,
          timestamp: new Date().toISOString(),
        },
      };

      let headers = {
        'Content-Type': 'application/json',
      };

      if (authMethod === 'apiKey') {
        if (!keys.pinataApiKey || !keys.pinataSecretApiKey) {
          alert('Please set your Pinata API keys in the settings.');
          reject('API keys not set.');
          return;
        }
        headers['pinata_api_key'] = keys.pinataApiKey;
        headers['pinata_secret_api_key'] = keys.pinataSecretApiKey;
      } else if (authMethod === 'jwt') {
        if (!keys.pinataJwt) {
          alert('Please set your Pinata JWT in the settings.');
          reject('JWT not set.');
          return;
        }
        headers['Authorization'] = `Bearer ${keys.pinataJwt}`;
      } else {
        alert('Invalid authentication method.');
        reject('Invalid authentication method.');
        return;
      }

      // Send a message to the background script
      chrome.runtime.sendMessage(
        {
          action: 'uploadToPinata',
          url: url,
          headers: headers,
          data: data,
        },
        function (response) {
          if (response && response.success) {
            const ipfsHash = response.data.IpfsHash;
            resolve(ipfsHash);
          } else {
            console.error('Error uploading to Pinata:', response.error);
            reject(response.error);
          }
        }
      );
    });
  });
}

function saveHashLocally(ipfsHash, title, category) {
  chrome.storage.local.get({ journals: [] }, function (result) {
    const journals = result.journals;
    journals.push({
      ipfsHash: ipfsHash,
      title: title,
      category: category,
      date: new Date().toLocaleString(),
    });
    chrome.storage.local.set({ journals: journals }, function () {
      console.log('Journal metadata saved locally.');
    });
  });
}
