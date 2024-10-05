chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'uploadToPinata') {
      const { url, headers, data } = request;
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          return response.json();
        })
        .then(responseData => {
          sendResponse({ success: true, data: responseData });
        })
        .catch(error => {
          console.error('Error uploading to Pinata:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep the message channel open for sendResponse
    }
  });
  