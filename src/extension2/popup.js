document.getElementById('saveNote').addEventListener('click', saveNote);
document.getElementById('getPrompt').addEventListener('click', getAIPrompt);
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

function getAIPrompt() {
  // This function remains unchanged
}

function viewJournals() {
  chrome.windows.create({
    url: 'journals.html',
    type: 'popup',
    width: 400,
    height: 600,
  });
}
