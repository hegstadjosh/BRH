// Google Docs Chrome Extension
// This script allows users to save notes to Google Docs and fetch AI-generated prompts.

// Constants for Google OAuth
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID
const REDIRECT_URI = `https://${chrome.runtime.id}.chromiumapp.org/`; // Chrome extension's redirect URI
const SCOPES = ['https://www.googleapis.com/auth/documents']; // Required scope for Google Docs API

// Event listeners for UI buttons
document.getElementById('saveNote').addEventListener('click', saveNote);
document.getElementById('getPrompt').addEventListener('click', getAIPrompt);

/**
 * Saves the content of the noteArea to a Google Doc.
 */
function saveNote() {
  const noteContent = document.getElementById('noteArea').value;
  saveNoteToGoogleDoc(noteContent);
}

/**
 * Fetches an AI-generated prompt from a local server and populates the noteArea.
 */
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

/**
 * Retrieves an access token for Google OAuth.
 * @param {boolean} interactive - Whether to show the auth prompt to the user.
 * @returns {Promise<string>} A promise that resolves with the access token.
 */
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

/**
 * Saves the given content to a new Google Doc.
 * @param {string} content - The text content to save in the Google Doc.
 */
async function saveNoteToGoogleDoc(content) {
  try {
    // Get the access token
    const accessToken = await getAccessToken(true);

    // Create a new Google Doc
    const createDocResponse = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'My Note',
      }),
    });

    const doc = await createDocResponse.json();
    const documentId = doc.documentId;

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
              text: content,
              location: {
                index: 1,
              },
            },
          },
        ],
      }),
    });

    alert('Note saved to Google Docs!');
  } catch (error) {
    console.error('Error saving to Google Docs:', error);
    alert('Failed to save note to Google Docs.');
  }
}