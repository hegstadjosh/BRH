document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get({ journals: [] }, function (result) {
      const journals = result.journals;
      const journalListDiv = document.getElementById('journalList');
  
      if (journals.length === 0) {
        journalListDiv.innerText = 'No journals found.';
        return;
      }
  
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
        date.innerText = 'Date: ' + journal.date;
        journalDiv.appendChild(date);
  
        const viewButton = document.createElement('button');
        viewButton.innerText = 'View';
        viewButton.addEventListener('click', function () {
          viewJournalContent(journal.ipfsHash);
        });
        journalDiv.appendChild(viewButton);
  
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', function () {
          deleteJournal(journal.ipfsHash);
        });
        journalDiv.appendChild(deleteButton);
  
        journalListDiv.appendChild(journalDiv);
      });
    });
  });
  
  function viewJournalContent(ipfsHash) {
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    window.open(url, '_blank');
  }
  
  function deleteJournal(ipfsHash) {
    if (confirm('Are you sure you want to delete this journal? This action cannot be undone.')) {
      // Delete from local storage
      chrome.storage.local.get({ journals: [] }, function (result) {
        let journals = result.journals;
        journals = journals.filter(journal => journal.ipfsHash !== ipfsHash);
        chrome.storage.local.set({ journals: journals }, function () {
          alert('Journal deleted.');
          location.reload(); // Refresh the page to update the list
        });
      });
      // Optionally, unpin from Pinata Cloud (requires additional API calls)
    }
  }
  
  