document.getElementById('saveNote').addEventListener('click', saveNote);
document.getElementById('getResponse').addEventListener('click', getAIResponse);
document.getElementById('viewJournals').addEventListener('click', viewJournals);

function saveNote() {
  const noteContent = document.getElementById('noteArea').value;
  const category = document.getElementById('categorySelect').value;
  const title = `${category} Note - ${new Date().toLocaleDateString()}`;

  if (!noteContent.trim()) {
    alert('Please enter some content before saving.');
    return;
  }

  fetch('http://localhost:3000/save-note', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content: noteContent, category }),
  })
    .then(response => response.json())
    .then(data => {
      alert('Note saved successfully!');
      document.getElementById('noteArea').value = '';
    })
    .catch(error => {
      console.error('Error saving note:', error);
      alert('Failed to save note.');
    });
}

// function getAIPrompt() {
//   fetch('http://localhost:5000/get-prompt')
//     .then(response => response.json())
//     .then(data => {
//       document.getElementById('noteArea').value = data.prompt;
//     })
//     .catch(error => {
//       console.error('Error fetching AI prompt:', error);
//       alert('Failed to get AI prompt.');
//     });
// }

function getAIResponse() {
  const noteContent = document.getElementById('noteArea').value;
  
  if (!noteContent.trim()) {
    alert('Please enter some content before requesting an AI response.');
    return;
  }

  fetch('http://localhost:5000/get-response', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ note: noteContent }),
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('noteArea').value += '\n\nAI Response:\n' + data.response;
    })
    .catch(error => {
      console.error('Error fetching AI response:', error);
      alert('Failed to get AI response.');
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