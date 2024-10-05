import os
from typing import Dict, List, Any
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

#TODO func to analyze how much more info a user wants for a note 
'''
#chrome extension or web app entry -> new info -> generate best pitch of routes to take for info 
# -> compare with current pages -> either:
 - add info to existing page 
 - create parent or child for existing page 
 - create new page 
-> add to knowledge base

#paths for info RAG: 
 - simple note-taking : format user's saved info nicely
 - research assistant : use internet and knowledge base to generate report and possible new paths
 - project planning   : use knowledge base to organize, plan

#features:
user chooses how many pages to automatically generate from their note
user selects which knowledge base(s) to use for generating new pages
user can like, dislike, or give direct feedback on generated pages 
user can create new pages manually

#ui 
##chrome extension:

##web app:
login, enter api key, create/modify knowledge bases, upload files to pages

views: 
 - show pages as squares, sortable by date, knowledge base, or category
 - (if time) show tree view of knowledge base
#crews: 
knowledge base crew: organizes knowledge bases, suggests, and creates new ones (ie combining directories of pages) 
assimilation crew: decides how to incorporate info into a KB
creation crew: researches and generates pages

#Stored data for each user: 
knowledge base outlines: generated by knowledge base crew
pages (the main content): generated by creation crew
notes: source input for pages
metadata: user behavior & preferences, used to modify prompts

'''
class Delta:

    def __init__(self):
        self.knowledge_base = {}  # This will be replaced with a proper database or knowledge graph later

    def process_input(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process incoming data from the Chrome extension or other sources.
        """
        # Extract relevant information from input_data
        content = input_data.get("content", "")
        url = input_data.get("url", "")
        
        # Categorize the input
        category = self.categorize(content)
        
        # Augment the information
        augmented_data = self.augment_information(content)
        
        # Store the processed information
        processed_data = {
            "original_content": content,
            "url": url,
            "category": category,
            "augmented_data": augmented_data
        }
        self.store_information(processed_data)
        
        return processed_data

    def categorize(self, content: str) -> str:
        """
        Use LLM to categorize the input content.
        """
        prompt = f"Categorize the following content into a single word or short phrase:\n\n{content}\n\nCategory:"
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()

    def augment_information(self, content: str) -> str:
        """
        Use LLM to augment the input content with additional information.
        """
        prompt = f"Provide additional relevant information for the following content:\n\n{content}\n\nAdditional information:"
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()

    def store_information(self, processed_data: Dict[str, Any]):
        """
        Store the processed information in the knowledge base.
        This is a placeholder and should be replaced with proper database operations.
        """
        # Generate a simple key for demonstration purposes
        key = f"entry_{len(self.knowledge_base) + 1}"
        self.knowledge_base[key] = processed_data

    def query_knowledge_base(self, query: str) -> List[Dict[str, Any]]:
        """
        Query the knowledge base for relevant information.
        This is a simple implementation and should be enhanced with proper search algorithms.
        """
        results = []
        for entry in self.knowledge_base.values():
            if query.lower() in entry["original_content"].lower() or query.lower() in entry["augmented_data"].lower():
                results.append(entry)
        return results

# Example usage
if __name__ == "__main__":
    delta = Delta()
    
    # Process some input
    input_data = {
        "content": "The Python programming language was created by Guido van Rossum.",
        "url": "https://example.com/python-history"
    }
    processed = delta.process_input(input_data)
    print("Processed data:", processed)
    
    # Query the knowledge base
    query_results = delta.query_knowledge_base("Python")
    print("Query results:", query_results)
