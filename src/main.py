import os
from typing import Dict, List, Any
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key="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")

# Example knowledge base json structure
knowledge_base_example = {
    "knowledge_base": {
        "title": "BrainButler Knowledge Base",
        "pages": [
            {
                "page_id": "001",
                "title": "Summary",
                "description": "Overview of BrainButler's features and capabilities."
            },
            {
                "page_id": "002",
                "title": "System Architecture",
                "description": "Details on input methods, information processing flow, and AI crews."
            },
            {
                "page_id": "003",
                "title": "Features",
                "description": "List of features including user-controlled page generation and feedback options."
            },
            {
                "page_id": "004",
                "title": "User Interface",
                "description": "Information on the Chrome extension and web app functionalities."
            },
            {
                "page_id": "005",
                "title": "Data Storage",
                "description": "Explanation of how user data, pages, and metadata are stored."
            }
        ]
    }
}

# Function definitions
def set_openai_api_key(api_key):
    client.api_key = api_key

def create_agent_prompt(role, goal, backstory):
    return f"You are a {role}. Your goal is to {goal}. Backstory: {backstory}"

def execute_task(agent_prompt, task_description, context=""):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": agent_prompt},
            {"role": "user", "content": f"Task: {task_description}\nContext: {context}"}
        ]
    )

    return response.choices[0].message.content
    # return response.choices[0].message['content']

def analyze_kb(knowledge_base):
    agent_prompt = create_agent_prompt(
        "Knowledge Base Organizer",
        "Organize and manage knowledge bases",
        "An expert in information architecture with a keen eye for organizing complex data structures."
    )
    task = "Analyze the current knowledge base structure and suggest improvements or new knowledge bases."
    return execute_task(agent_prompt, task, str(knowledge_base))

def summarize_kb(knowledge_base):
    agent_prompt = create_agent_prompt(
        "Knowledge Base Summarizer",
        "Summarize the current knowledge base as concisely as possible",
        "An expert in summarizing and condensing information into concise and clear summaries."
    )
    task = "Provide a summary of the current knowledge base."
    return execute_task(agent_prompt, task, str(knowledge_base))



def assimilation(new_info, kb_analysis):
    agent_prompt = create_agent_prompt(
        "Information Assimilator",
        "Decide how to incorporate new information into existing knowledge bases",
        "A skilled analyst with expertise in content curation and information synthesis."
    )
    task = ("Review new information and determine the best way to incorporate it into the existing knowledge base.")
    context = f"New Information: {new_info}\nKnowledge Base Analysis: {kb_analysis}"
    return execute_task(agent_prompt, task, context)

def creation(assimilation_plan):
    agent_prompt = create_agent_prompt(
        "Content Creator",
        ("Research and generate comprehensive pages for knowledge bases"),
        ("A creative writer and researcher with a talent for producing engaging and informative content.")
    )
    task = ("Research and generate a new page for the knowledge base based on the assimilation plan.")
    return execute_task(agent_prompt, task, assimilation_plan)

def process_new_information(new_info, knowledge_base):
    # Step 1: Analyze knowledge base structure
    kb_summary = summarize_kb(knowledge_base)
    
    # Step 2: Determine how to incorporate new information
    assimilation_plan = assimilation(new_info, kb_summary)
    
    # Step 3: Create new content based on the assimilation plan
    new_content = creation(assimilation_plan)
    
    return new_content

# Example usage
if __name__ == "__main__":
    
    new_info = ("Recent advancements in quantum computing and their potential impact on cryptography.")
    
    knowledge_base = {
        "title": ("Technology Trends"),
        "pages": [
            {"title": ("Quantum Computing Basics"), "content": "..."},
            {"title": ("Modern Cryptography"), "content": "..."}
        ]
    }
    
    updated_content = process_new_information(new_info, knowledge_base)
    print("New content generated:", updated_content)

