import os
from typing import Dict, List, Any
import openai
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, WebsiteSearchTool
from dotenv import load_dotenv
from langchain.agents import load_tools


# Load environment variables from .env file with the contents: 
# SERPER_API_KEY=your_serper_api_key
# OPENAI_API_KEY=your_openai_api_key
load_dotenv()

# Set up API keys
serper_api_key = os.getenv("SERPER_API_KEY")
#openai_api_key = os.getenv("OPENAI_API_KEY")
openai_api_key="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"

# Initialize tools
search_tool = SerperDevTool()
web_search_tool = WebsiteSearchTool()

#vars 
llm = "gpt-4o"
fast_llm = "gpt-3.5-turbo"

langchain_tools = load_tools(["google-serper"], llm = llm)

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

# This dictionary (stores in pinata as json) represents a page in the system. It includes:
# - Page ID: A unique identifier for the page.
# - Title: The title of the page.
# - Content: A brief description or content of the page.
# - Links: An array of pointers to related pages and files. Each link has a type (either 'page' or 'file'), an ID, and a title or filename.
# The frontend can use this dictionary to dynamically fetch and display related content by following the IDs in the links array. This structure allows for easy navigation and organization of interconnected pages and files.
page_example = {
    "page_id": "123",
    "title": "Introduction to BrainButler",
    "content": "This page provides an overview of BrainButler.",
    "links": [
        {
            "type": "page",
            "id": "124",
            "title": "System Architecture"
        },
        {
            "type": "file",
            "id": "file_001",
            "filename": "README.md"
        }
    ]
}

import openai

def set_openai_api_key(api_key):
    openai.api_key = api_key

def create_agent_prompt(role, goal, backstory):
    return f"You are a {role}. Your goal is to {goal}. Backstory: {backstory}"

def execute_task(agent_prompt, task_description, context=""):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": agent_prompt},
            {"role": "user", "content": f"Task: {task_description}\nContext: {context}"}
        ]
    )
    return response.choices[0].message['content']

def knowledge_base_crew(knowledge_base):
    agent_prompt = create_agent_prompt(
        "Knowledge Base Organizer",
        "Organize and manage knowledge bases",
        "An expert in information architecture with a keen eye for organizing complex data structures."
    )
    task = "Analyze the current knowledge base structure and suggest improvements or new knowledge bases."
    return execute_task(agent_prompt, task, str(knowledge_base))

def assimilation_crew(new_info, kb_analysis):
    agent_prompt = create_agent_prompt(
        "Information Assimilator",
        "Decide how to incorporate new information into existing knowledge bases",
        "A skilled analyst with expertise in content curation and information synthesis."
    )
    task = "Review new information and determine the best way to incorporate it into the existing knowledge base."
    context = f"New Information: {new_info}\nKnowledge Base Analysis: {kb_analysis}"
    return execute_task(agent_prompt, task, context)

def creation_crew(assimilation_plan):
    agent_prompt = create_agent_prompt(
        "Content Creator",
        "Research and generate comprehensive pages for knowledge bases",
        "A creative writer and researcher with a talent for producing engaging and informative content."
    )
    task = "Research and generate a new page for the knowledge base based on the assimilation plan."
    return execute_task(agent_prompt, task, assimilation_plan)

def process_new_information(new_info, knowledge_base):
    # Step 1: Analyze knowledge base structure
    kb_analysis = knowledge_base_crew(knowledge_base)
    
    # Step 2: Determine how to incorporate new information
    assimilation_plan = assimilation_crew(new_info, kb_analysis)
    
    # Step 3: Create new content based on the assimilation plan
    new_content = creation_crew(assimilation_plan)
    
    return new_content

# Example usage
if __name__ == "__main__":
    set_openai_api_key("your_openai_api_key_here")
    
    new_info = "Recent advancements in quantum computing and their potential impact on cryptography."
    knowledge_base = {
        "title": "Technology Trends",
        "pages": [
            {"title": "Quantum Computing Basics", "content": "..."},
            {"title": "Modern Cryptography", "content": "..."}
        ]
    }
    
    updated_content = process_new_information(new_info, knowledge_base)
    print("New content generated:", updated_content)