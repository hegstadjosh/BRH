document.addEventListener('DOMContentLoaded', function () {
  fetchJournals();
});

function fetchJournals() {
  fetch('http://localhost:3000/get-notes')
    .then(response => response.json())
    .then(journals => {
      const journalListDiv = document.getElementById('journalList');

      if (journals.length === 0) {
        journalListDiv.innerText = 'No journals found.';
        return;
      }

      journalListDiv.innerHTML = '';

      journals.forEach((journal) => {
        const journalDiv = document.createElement('div');
        journalDiv.classList.add('journal-entry');

        const title = document.createElement('h3');
        title.innerText = journal.title;
        journalDiv.appendChild(title);

        const category = document.createElement('p');
        category.innerText = 'Category: ' + journal.category;
        journalDiv.appendChild(category);

        const date = document.createElement('p');
        date.innerText = 'Date: ' + new Date(journal.date).toLocaleString();
        journalDiv.appendChild(date);

        const viewButton = document.createElement('button');
        viewButton.innerText = 'View';
        viewButton.addEventListener('click', function () {
          viewJournalContent(journal.content);
        });
        journalDiv.appendChild(viewButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', function () {
          deleteJournal(journal.id);
        });
        journalDiv.appendChild(deleteButton);

        journalListDiv.appendChild(journalDiv);
      });
    })
    .catch(error => {
      console.error('Error fetching journals:', error);
      document.getElementById('journalList').innerText = 'Error fetching journals.';
    });
}

function viewJournalContent(content) {
  alert(content);
}

function deleteJournal(id) {
  if (confirm('Are you sure you want to delete this journal? This action cannot be undone.')) {
    fetch(`http://localhost:3000/delete-note/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        alert('Journal deleted.');
        fetchJournals(); // Refresh the list
      })
      .catch(error => {
        console.error('Error deleting journal:', error);
        alert('Failed to delete journal.');
      });
  }
}
