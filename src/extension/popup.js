const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const REDIRECT_URI = `https://${chrome.runtime.id}.chromiumapp.org/`;
const SCOPES = [
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file'
];

document.getElementById('saveNote').addEventListener('click', saveNote);
document.getElementById('getPrompt').addEventListener('click', getAIPrompt);

function saveNote() {
  const noteContent = document.getElementById('noteArea').value;
  const category = document.getElementById('categorySelect').value;
  saveNoteToGoogleDoc(noteContent, category);
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

// OAuth2 Authentication
function getAccessToken(interactive) {
  return new Promise((resolve, reject) => {
    const authUrl =
      `https://accounts.google.com/o/oauth2/auth` +
      `?client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(SCOPES.join(' '))}`;

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: interactive
      },
      function (redirectUrl) {
        if (chrome.runtime.lastError || redirectUrl.includes('error=access_denied')) {
          reject(new Error('Authorization failed'));
          return;
        }

        const urlParams = new URLSearchParams(redirectUrl.split('#')[1]);
        const accessToken = urlParams.get('access_token');

        if (accessToken) {
          resolve(accessToken);
        } else {
          reject(new Error('Access token not found'));
        }
      }
    );
  });
}

// Function to get or create a folder in Google Drive
async function getOrCreateFolder(accessToken, category) {
  // Search for an existing folder
  const searchResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(category)}'+and+mimeType='application/vnd.google-apps.folder'&fields=files(id,name)&spaces=drive`,
    {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    }
  );

  const searchData = await searchResponse.json();

  if (searchData.files && searchData.files.length > 0) {
    // Folder exists
    return searchData.files[0].id;
  } else {
    // Create a new folder
    const createFolderResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: category,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });

    const folderData = await createFolderResponse.json();
    return folderData.id;
  }
}

// Function to move a file to a folder in Google Drive
async function moveFileToFolder(accessToken, fileId, folderId) {
  // Retrieve the existing parents to remove
  const getFileResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=parents`, {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
  });

  const fileData = await getFileResponse.json();
  const previousParents = fileData.parents ? fileData.parents.join(',') : '';

  // Move the file to the new folder
  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?addParents=${folderId}&removeParents=${previousParents}&fields=id, parents`, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
  });
}

async function saveNoteToGoogleDoc(content, category) {
  try {
    const accessToken = await getAccessToken(true);

    // Get or create the category folder
    const folderId = await getOrCreateFolder(accessToken, category);

    // Create a new Google Doc
    const docTitle = `${category} Note - ${new Date().toLocaleDateString()}`;
    const createDocResponse = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: docTitle,
      }),
    });

    const doc = await createDocResponse.json();
    const documentId = doc.documentId;

    // Move the document to the category folder
    await moveFileToFolder(accessToken, documentId, folderId);

    // Prepare the content with timestamp
    const timestamp = new Date().toLocaleString();
    const contentWithTimestamp = `Date: ${timestamp}\n\n${content}`;

    // Insert text into the new Google Doc
    await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              text: contentWithTimestamp,
              location: {
                index: 1,
              },
            },
          },
        ],
      }),
    });

    alert('Note saved to Google Docs in category folder!');
  } catch (error) {
    console.error('Error saving to Google Docs:', error);
    alert('Failed to save note to Google Docs.');
  }
}
