# BrainButler Documentation

## Summary

BrainButler is an AI-powered knowledge management system that helps users organize, research, and generate content. It currently features a Chrome extension for note-taking and a web app for note management, with plans for more advanced AI-driven features in the future.

## Current Features

### Chrome Extension

- Note-taking functionality directly in the browser
- Note categorization for easy organization
- AI-powered response generation for note content
- Local storage for secure note saving
- Redirect to web app for viewing existing notes

### Web Application

- Centralized dashboard to view all notes
- Add new notes through a user-friendly interface
- Delete existing notes
- Basic editing functionality for notes

### AI Integration

- Processes note content to generate relevant responses or suggestions
- Utilizes OpenAI's GPT model for intelligent text processing

### Data Storage

- SQLite database for efficient local storage of notes
- Data persistence across sessions

## Future Planned Features

1. **Advanced AI Capabilities**:
   - Automatic note summarization
   - Keyword extraction and tagging
   - Intelligent note linking and relationship mapping

2. **Enhanced Synchronization**:
   - Real-time syncing between extension and web app
   - Cloud storage integration for access across devices

3. **Improved Search Functionality**:
   - Full-text search with natural language processing
   - Filter notes by categories, tags, and date ranges

4. **Collaboration Features**:
   - Shared notebooks for team collaboration
   - Real-time collaborative editing

5. **Rich Media Support**:
   - Embed images, videos, and other media in notes
   - Voice note recording and transcription

6. **Data Visualization**:
   - Mind mapping and concept visualization tools
   - Timeline view for chronological note organization

7. **Enhanced Security**:
   - End-to-end encryption for sensitive notes
   - Two-factor authentication for account access

8. **Integration with Productivity Tools**:
   - Calendar integration for date-based notes and reminders
   - Task management features with to-do lists

9. **Customization Options**:
   - Themes and layout customization
   - Configurable AI behavior and response types

10. **Mobile Application**:
    - Native mobile apps for iOS and Android
    - Offline mode for note access without internet connection

## System Architecture

### Current Input Methods

- Chrome extension
- Web app

### Information Processing Flow

1. New information entry via Chrome extension or web app
2. AI processing of note content
3. Storage in SQLite database
4. Retrieval and display in web app

## User Interface

### Chrome Extension

- User notetaking with AI prompt generation
- Save note functionality
- Redirect user to web app to view existing notes

### Web App

- Display of all saved notes
- Note management (add, edit, delete)

## Data Storage

### Current User Data

1. **Notes**: Source input from users
2. **Metadata**: Basic information like categories and timestamps

Note: The knowledge base structures mentioned in the original README are part of the planned future features and are not implemented in the current version.