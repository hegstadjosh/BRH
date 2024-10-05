import os
from typing import Dict, List, Any
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

#TODO func to analyze how much more info a user wants for a note 

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
